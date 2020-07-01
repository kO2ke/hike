import {Haiku, emptyHaiku} from "./Haiku"
import moment from 'moment';
import firebase from 'firebase'
import {Auth} from '@/user/auth'

const db = firebase.firestore

export interface FetchResult
{
    haikus: Haiku[];
    nextQuery: Promise<FetchResult> | null;
}

//::This is singleton class
export default class HaikuInterecter{

    private static _instance: HaikuInterecter;

    private auth = Auth.getInstance()

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

    public fetchHaiku(span: number, startAfter: firebase.firestore.DocumentData | null = null): Promise<FetchResult> {
        if(startAfter){
            return new Promise((resolve, reject) => {
                if(span <= 0){
                    reject(new Error("range is must be positive"))
                }
                db().collection("haikus").orderBy("createdAt", "desc").startAfter(startAfter).limit(span).get()
                    .then((snapshot) => {
                        const newHaikus: Haiku[] = []
                        const lastDoc = snapshot.docs[snapshot.docs.length - 1]
                        snapshot.forEach(doc => {
                            newHaikus.push(doc.data() as Haiku)
                        })
                        //次がなければnextQueryはnullをかえす
                        const nextQuery = snapshot.docs.length < span ? null : this.fetchHaiku(span, lastDoc)
                       resolve({haikus:newHaikus, nextQuery: nextQuery})
                    }).catch((err)=>{
                        reject(err)
                    })
            }) 
        }

        //先頭から
        return new Promise((resolve, reject) => {
            if(span <= 0){
                reject(new Error("range is must be positive"))
            }
            db().collection("haikus").orderBy("createdAt", "desc").limit(span).get()
                .then((snapshot) => {
                    const newHaikus: Haiku[] = []
                    const lastDoc = snapshot.docs[snapshot.docs.length - 1]
                    snapshot.forEach(doc => {
                        newHaikus.push(doc.data() as Haiku)
                    })
                    //次がなければnextQueryはnullをかえす
                    const nextQuery = snapshot.docs.length < span ? null : this.fetchHaiku(span, lastDoc)
                    resolve({haikus:newHaikus, nextQuery: nextQuery})
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

    public likeToHaiku(userId: string, haikuId: string){
        const batch = db().batch()
        const likedHaikuRef = db().collection("haikus").doc(haikuId)
        const likedUserRef  = db().collection("users").doc(userId)

        //俳句のいいね数といいねした人リストを更新
        const likedUserPath = "likedUser."+userId
        batch.update(likedHaikuRef, {[likedUserPath]: true, likeCount: db.FieldValue.increment(1)})

        //ユーザーのいいねリストを追加
        batch.set(likedUserRef.collection("likedHaiku").doc(haikuId), {"id": haikuId, "haikuRef": likedHaikuRef, createTime: db.FieldValue.serverTimestamp()})

        batch.commit()
    }

    public cancelLikeToHaiku(userId: string, haikuId: string){
        const batch = db().batch()
        const likedHaikuRef = db().collection("haikus").doc(haikuId)
        const likedUserRef  = db().collection("users").doc(userId)

        //俳句のいいね数といいねした人リストを更新
        const likedUserPath = "likedUser."+userId
        batch.update(likedHaikuRef, {[likedUserPath]: db.FieldValue.delete(), likeCount: db.FieldValue.increment(-1)})

        //ユーザーのいいねリストを削除
        batch.delete(likedUserRef.collection("likedHaiku").doc(haikuId))

        batch.commit()
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