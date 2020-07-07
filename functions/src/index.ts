import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from "moment"
import {HaikuLikeStatus, Haiku, LikedHaiku} from "./Haiku"
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

const likeStatusCollection = firestore.collection("haikuLikeStatuses");


export interface HaikuRef {
    id:           string;
    createdAt?:   admin.firestore.FieldValue
    haikuRef: admin.firestore.DocumentReference;
}

const db = functions.firestore


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const onCreateHaiku = 
    db.document("/haikus/{haikuId}")
    .onCreate( (snapShot, context) =>{
        const newHaiku      = snapShot.data() as Haiku
        const newHaikuRef   = snapShot.ref 
    
        //季節ごとに振り分け
        const season: string = newHaiku.season.length === 0 ? "noSeason" : newHaiku.season
        const seasonRef = firestore.collection("seasons").doc(season).collection("haikus").doc();
    
        //いいねカウンターを作成
        const newLikeStatus = {likeCount: 0, likedUser: {}, haikuRef: newHaikuRef}   
        
        const likeStatusRef     = likeStatusCollection.doc("all").collection("statuses").doc(newHaiku.id)
    
        return [seasonRef.set(newHaiku), likeStatusRef.set(newLikeStatus)]
    })

export const onToggleLike = 
    db.document("/users/{userId}/likedHaiku/{haikuId}")
    .onWrite( (snapShot, context) =>{
        if(snapShot.after.data()&&snapShot.before.data()){
            //updateは考慮されないs
            return
        }

        let doc:LikedHaiku|null=null
        let operate: Object|null=null

        if(snapShot.after.data()){
            //追加
            doc  = snapShot.after.data() as LikedHaiku
            operate = {likedUser: {[doc.userId]: true}, haikuRef: doc.haikuRef}
        }
        if(snapShot.before.data()){
            //削除
            doc  = snapShot.before.data() as LikedHaiku
            operate = {likedUser: {[doc.userId]: admin.firestore.FieldValue.delete()}, haikuRef: doc.haikuRef}
        }

        if(!doc){return}
        if(!operate){return}

        const createTime = moment(doc.createTime)
        const year  = createTime.year().toString()
        const month = createTime.month().toString()
        const week  = Math.floor((createTime.date() - createTime.day() + 12) / 7).toString()
        const date   = createTime.date().toString()


        const statuses = "statuses"
              
        // Set yearly like count
        const docYear = likeStatusCollection.doc(year).collection(statuses).doc(doc.id)
        const setYear = setLikeAndCountLike(docYear, operate)
        // Set monthly like count
        const docMonth = likeStatusCollection.doc(year).collection("monthes").doc(month).collection(statuses).doc(doc.id)
        const setMonth = setLikeAndCountLike(docMonth, operate)
        // Set weekly like count
        const docWeek = likeStatusCollection.doc(year).collection("monthes").doc(month).collection("weeks").doc(week).collection(statuses).doc(doc.id)
        const setWeek = setLikeAndCountLike(docWeek, operate)
        // Set daily like count
        const docDate = likeStatusCollection.doc(year).collection("monthes").doc(month).collection("weeks").doc(week).collection("dates").doc(date).collection(statuses).doc(doc.id)
        const setDate = setLikeAndCountLike(docDate, operate)
        return [setYear
                ,setMonth
                ,setWeek
                ,setDate]
    })

    const setLikeAndCountLike = (doc: admin.firestore.DocumentReference, operate:Object) => {
        return doc.set(operate, {merge: true})
        .then(() => {
            return doc.get()
        }).then(snapShot => {
            const status = snapShot.data() as HaikuLikeStatus
            return doc.set({likeCount: Object.keys(status.likedUser).length??0}, {merge: true})
        })
    }