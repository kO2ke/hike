import firebase, { firestore } from 'firebase'

export interface Haiku {
    composer:     string;
    first:        string;
    second:       string;
    third:        string;
    season?:       string;
    createdAt?:    firebase.firestore.FieldValue;
    id?:           string;
}