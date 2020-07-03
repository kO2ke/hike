import firebase, { firestore } from 'firebase'

export interface Haiku {
    composer:     string;
    first:        string;
    second:       string;
    third:        string;
    season:       string;
    createdAt?:    firebase.firestore.FieldValue;
    id:           string;
}

export interface HaikuLikeStatus {
    likeCount: number;
    likedUser: {[id: string]: boolean};
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