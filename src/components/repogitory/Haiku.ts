import firebase, { firestore } from 'firebase'


export interface Haiku {
    composer:     string;
    first:        string;
    second:       string;
    third:        string;
    season:       string;
    createdAt?:    firebase.firestore.FieldValue;
    id:           string;
    staticData?: number;
}

export interface HaikuLikeStatus {
    likeCount: number | firebase.firestore.FieldValue;
    likedUser: {[id: string]: boolean | firebase.firestore.FieldValue};
    haikuRef?: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
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
    createTime: Date | firebase.firestore.FieldValue;
    season: string;
    haikuRef: firebase.firestore.DocumentReference;
}