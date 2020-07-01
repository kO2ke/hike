import firebase, { firestore } from 'firebase'

export interface Haiku {
    composer:     string;
    first:        string;
    second:       string;
    third:        string;
    season?:       string;
    createdAt?:    firebase.firestore.FieldValue;
    likeCount: number;
    likedUser: {[id: string]: boolean};
    id:           string;
}

export const emptyHaiku = () =>{
    return {
        composer: "",
        id: "",
        first:     "",
        second:    "",
        third:     "",
        likeCount: 0,
        likedUser: {}
    }
}