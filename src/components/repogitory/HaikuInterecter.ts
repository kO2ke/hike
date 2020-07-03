import {Haiku, emptyHaiku, HaikuLikeStatus} from "./Haiku"
import moment from 'moment';
import firebase, { database } from 'firebase'
import {Auth} from '@/user/auth'

const db = firebase.firestore

export interface FetchResult
{
    haikus: Haiku[];
    nextQuery: Promise<FetchResult> | null;
}

interface LikedHaiku 
{
    id: string;
    createTime: firebase.firestore.Timestamp;
    haikuRef: firebase.firestore.DocumentReference;
}

//::This is singleton class
export default class HaikuInterecter{

    private static _instance: HaikuInterecter;

    private auth = Auth.getInstance()

    private likeStatusCollection = db().collection("haikuLikeStatuses").doc("all").collection("statuses");
    private usersCollection = db().collection("users");
    private haikusCollection = db().collection("haikus");

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

    public fetchHaikuWithLikedBy(userId: string, span: number, startAfter: firebase.firestore.DocumentData | null = null): Promise<FetchResult> {
        const queryBase = this.usersCollection.doc(userId).collection("likedHaiku").orderBy("createTime", "desc")
        const query = startAfter ? queryBase.startAfter(startAfter).limit(span).get()
                                    : queryBase.limit(span).get()
        //先頭から
        return new Promise((resolve, reject) => {
            if(span <= 0){
                reject(new Error("range is must be positive"))
            }
            query
                .then((snapshot) => {
                    const newHaikus: Haiku[] = []
                    const lastDoc = snapshot.docs[snapshot.docs.length - 1]
                    snapshot.forEach(doc => {
                        const ref = (doc.data() as LikedHaiku).haikuRef
                        ref.get().then((haikuDoc) => {
                            const haiku = haikuDoc.data() as Haiku
                            newHaikus.push(haiku)
                        }).catch((err)=>{
                            resolve(err)
                        })
                    })
                    //次がなければnextQueryはnullをかえす
                    const nextQuery = snapshot.docs.length < span ? null : this.fetchHaikuWithLikedBy(userId, span, lastDoc)
                    resolve({haikus:newHaikus, nextQuery: nextQuery})
                }).catch((err)=>{
                    console.log(err)
                    reject(err)
                })
        })
    }

    public fetchHaiku(span: number, startAfter: firebase.firestore.DocumentData | null = null): Promise<FetchResult> {
        const queryBase = this.haikusCollection.orderBy("createdAt", "desc")
        const query = startAfter ? queryBase.startAfter(startAfter).limit(span).get()
                                    : queryBase.limit(span).get()
        //先頭から
        return new Promise((resolve, reject) => {
            if(span <= 0){
                reject(new Error("range is must be positive"))
            }
            query
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
                    console.log(err)
                    reject(err)
                })
        })


    }

    public watchHaikuLikeStatus(id: string, onFetchDoc: (newStatus: HaikuLikeStatus) => void) {
        this.likeStatusCollection.doc(id).onSnapshot(doc => {
            const newHaikuStatus: HaikuLikeStatus = doc.data() as HaikuLikeStatus
            onFetchDoc(newHaikuStatus)
        })
    }

    public likeToHaiku(userId: string, haiku: Haiku){
        const batch = db().batch()
        const likeStatusRef = this.likeStatusCollection.doc(haiku.id)
        const likedHaikuRef = this.haikusCollection.doc(haiku.id)
        const likedUserRef  = this.usersCollection.doc(userId)

        //俳句のいいね数といいねした人リストを更新
        const likedUserPath = "likedUser."+userId
        batch.update(likeStatusRef, {[likedUserPath]: true, likeCount: db.FieldValue.increment(1)})

        //ユーザーのいいねリストを追加
        batch.set(likedUserRef.collection("likedHaiku").doc(haiku.id), {"id": haiku.id, "season": haiku.season ?? "", "haikuRef": likedHaikuRef, createTime: db.FieldValue.serverTimestamp()})

        batch.commit()
    }

    public cancelLikeToHaiku(userId: string, haiku: Haiku){
        const batch = db().batch()
        const likeStatusRef = this.likeStatusCollection.doc(haiku.id)
        const likedHaikuRef = this.haikusCollection.doc(haiku.id)
        const likedUserRef  = this.usersCollection.doc(userId)

        //俳句のいいね数といいねした人リストを更新
        const likedUserPath = "likedUser."+userId
        batch.update(likeStatusRef, {[likedUserPath]: db.FieldValue.delete(), likeCount: db.FieldValue.increment(-1)})

        //ユーザーのいいねリストを削除
        batch.delete(likedUserRef.collection("likedHaiku").doc(haiku.id))

        batch.commit()
    }



    public realtimeFetchAll(onFetchDoc: (haikus: Haiku[]) => void){
        this.haikusCollection.onSnapshot(querySnapshot => {
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
        const newHaikuRef = this.haikusCollection.doc();
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