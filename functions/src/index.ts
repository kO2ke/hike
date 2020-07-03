import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

export interface Haiku {
    composer:     string;
    first:        string;
    second:       string;
    third:        string;
    season:       string;
    createdAt?:   admin.firestore.FieldValue
    likeCount: number;
    likedUser: {[id: string]: boolean};
    id:           string;
}

export interface HaikuLikeStatus {
    likeCount: number;
    likedUser: {[id: string]: boolean};
    haikuRef: admin.firestore.DocumentReference;
}

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
        const newLikeStatus:HaikuLikeStatus = {likeCount: 0, likedUser: {}, haikuRef: newHaikuRef}   
        const likeStatusCollection = firestore.collection("haikuLikeStatuses");
        const likeStatusRef     = likeStatusCollection.doc("all").collection("statuses").doc(newHaiku.id)
    
        return [seasonRef.set(newHaiku), likeStatusRef.set(newLikeStatus)]
    } )