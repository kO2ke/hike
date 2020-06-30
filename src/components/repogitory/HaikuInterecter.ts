import {Haiku, emptyHaiku} from "./Haiku"
import moment from 'moment';
import firebase from 'firebase'

const db = firebase.firestore

//::This is singleton class
export default class HaikuInterecter{

    private static _instance: HaikuInterecter;

    public static getInstance(): HaikuInterecter
    {
        if (!this._instance)
            this._instance = new HaikuInterecter(HaikuInterecter.getInstance);

        return this._instance;
    }

    constructor(caller: Function){
        if (caller == HaikuInterecter.getInstance)
            console.log("インスタンスを作成。。");
        else if (HaikuInterecter._instance)
            throw new Error("既にインスタンスが存在するためエラー。");
        else
            throw new Error("コンストラクタの引数が不正な為エラー。");
    }

    public fetchAll(): Promise<Haiku[]> {
        return new Promise((resolve, reject) => {
            db().collection("haikus").get()
                .then((snapshot) => {
                    const newHaikus: Haiku[] = []
                    snapshot.forEach(doc => {
                        newHaikus.push(doc.data() as Haiku)
                    })
                   resolve(newHaikus)
                }).catch((err)=>{
                    reject(err)
                })
        })
    }

    public watchHaiku(id: string, onFetchDoc: (haiku: Haiku) => void) {
        db().collection("haikus").doc(id).onSnapshot(doc => {
            let newHaikuStatus: Haiku = emptyHaiku()
            newHaikuStatus = doc.data() as Haiku
            onFetchDoc(newHaikuStatus)
        })
    }

    public likeToHaiku(id: string){
        const batch = db().batch()
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

    // public fetchWithSeason(season: string): Promise<Haiku[]> {
    //     return this.stubFetchWithSeason(season) 
    // }

    public postHaiku(haiku: Haiku): Promise<void>{
        haiku.createdAt = db.FieldValue.serverTimestamp()
        const newHaikuRef = db().collection("haikus").doc();
        haiku.id = newHaikuRef.id
        return newHaikuRef.set(haiku)
    }

    // private stubFetchAll(): Promise<Haiku[]> {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {

    //             const isErr = (new Date()).getSeconds() % 3 == 0 

    //             if (isErr){
    //                 reject("ERROR!!")
    //             }

    //             resolve(
    //                 this.stub.map((val)=>{
    //                     val.composer = val.composer.length == 0 || val.composer.length == null ? "詠み人知らず" : val.composer
    //                     return val
    //                 }).sort((a, b)=>{
    //                     return a.createdAt! > b.createdAt! ? -1 : 1
    //                 })
    //             )
    //         }, 1000);   
    //     })
    // }

    // private stubFetchWithSeason(season: string): Promise<Haiku[]> {
    //     return new Promise((resolve) => {
    //     setTimeout(() => {

    //             const isErr = (new Date()).getSeconds() % 3 == 0 

    //             if (isErr){
    //                 throw "ERROR!!"
    //             }

    //             resolve(this.stub.filter(function(val){return val.season == season}).map((val)=>{
    //                 val.composer = val.composer.length == 0 ? "詠み人知らず" : val.composer
    //                 return val
    //             }))
    //         }, 1000);   
    //     })
    // }

}