import * as admin from 'firebase-admin';

export interface Haiku {
    composer:     string;
    first:        string;
    second:       string;
    third:        string;
    season:       string;
    createdAt?:    admin.firestore.FieldValue;
    id:           string;
}

export interface HaikuLikeStatus {
    likeCount: number | FirebaseFirestore.FieldValue;
    likedUser: {[id: string]: boolean | FirebaseFirestore.FieldValue};
    haikuRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
}

export const emptyHaiku = () =>{
    return {
        composer: "",
        id: "",
        first:     "",
        second:    "",
        third:     "",
        season: "",
        likeCount: 0,
        likedUser: {}
    }
}

export interface LikedHaiku 
{
    userId: string;
    id: string;
    createTime: Date;
    season: string;
    haikuRef: admin.firestore.DocumentReference;
}