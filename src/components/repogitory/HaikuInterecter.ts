import {Haiku} from "./Haiku"
import moment from 'moment';
import firebase from 'firebase'
import {firebaseConfig} from "@/firebaseConfig"

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Initialize Firebase
firebase.analytics();

const db = firebase.firestore

export default class HaikuInterecter{
    public stub: Haiku[]
    constructor(){
        this.stub = [{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"春の雷",season:"spring",createdAt:db.Timestamp.fromDate(new Date("2020-01-01")),id:"a"}]
    }

    public fetchAll(): Promise<firebase.firestore.QuerySnapshot> {
        return db().collection("haikus").get()
    }

    public realtimeFetchAll(onFetchDoc: (haikus: Haiku[]) => void){
        db().collection("haikus").onSnapshot(querySnapshot => {
            const newHaikus: Haiku[] = []
            querySnapshot.forEach(doc => {
                newHaikus.push(doc.data() as Haiku)
            })
            onFetchDoc(newHaikus)
        })
    }

    public fetchWithSeason(season: string): Promise<Haiku[]> {
        return this.stubFetchWithSeason(season) 
    }

    public postHaiku(haiku: Haiku): Promise<void>{
        haiku.createdAt = db.FieldValue.serverTimestamp()
        const newHaikuRef = db().collection("haikus").doc();
        haiku.id = newHaikuRef.id
        return newHaikuRef.set(haiku)
    }

    private stubFetchAll(): Promise<Haiku[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                const isErr = (new Date()).getSeconds() % 3 == 0 

                if (isErr){
                    reject("ERROR!!")
                }

                resolve(
                    this.stub.map((val)=>{
                        val.composer = val.composer.length == 0 || val.composer.length == null ? "詠み人知らず" : val.composer
                        return val
                    }).sort((a, b)=>{
                        return a.createdAt! > b.createdAt! ? -1 : 1
                    })
                )
            }, 1000);   
        })
    }

    private stubFetchWithSeason(season: string): Promise<Haiku[]> {
        return new Promise((resolve) => {
        setTimeout(() => {

                const isErr = (new Date()).getSeconds() % 3 == 0 

                if (isErr){
                    throw "ERROR!!"
                }

                resolve(this.stub.filter(function(val){return val.season == season}).map((val)=>{
                    val.composer = val.composer.length == 0 ? "詠み人知らず" : val.composer
                    return val
                }))
            }, 1000);   
        })
    }

}