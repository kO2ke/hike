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

export const onCreateLike = 
    db.document("/users/{userId}/likedHaiku/{haikuId}")
    .onWrite( (snapShot, context) =>{
        const doc  = snapShot.after.data() as LikedHaiku
        const createTime = moment(doc.createTime)
        const year  = createTime.year().toString()
        const month = createTime.month().toString()
        const week  = Math.floor((createTime.date() - createTime.day() + 12) / 7).toString()
        const date   = createTime.date().toString()

        const statuses = "statuses"

        let operate: HaikuLikeStatus | null = null
        switch (context.eventType) {
            case "create":
                operate = {likedUser: {[doc.userId]: true}, likeCount: admin.firestore.FieldValue.increment(1), haikuRef: doc.haikuRef}
                break
            case "delete":
                operate = {likedUser: {[doc.userId]: admin.firestore.FieldValue.delete()}, likeCount: admin.firestore.FieldValue.increment(-1), haikuRef: doc.haikuRef}
                break
            default:
                break
        }
        
        if(!operate){return}
      
        // Set yearly like count
        const setYear = likeStatusCollection.doc(year).collection(statuses).doc(doc.id).set(operate, {merge: true})
        // Set monthly like count
        const setMonth = likeStatusCollection.doc(year).collection("monthes").doc(month).collection(statuses).doc(doc.id).set(operate, {merge: true})
        // Set weekly like count
        const setWeek = likeStatusCollection.doc(year).collection("monthes").doc(month).collection("weeks").doc(week).collection(statuses).doc(doc.id).set(operate, {merge: true})
        // Set daily like count
        const setDate = likeStatusCollection.doc(year).collection("monthes").doc(month).collection("weeks").doc(week).collection("dates").doc(date).collection(statuses).doc(doc.id).set(operate, {merge: true})

        return [setYear
                ,setMonth
                ,setWeek
                ,setDate]
    })