import {Haiku, HaikuLikeStatus, LikedHaiku} from "./Haiku"
import moment from 'moment';
import firebase, {firestore} from 'firebase'
import {Auth} from '@/user/auth'

const db = firebase.firestore

export interface FetchResult
{
    haikus: Haiku[];
    //ページング処理のため次のクエリを再帰的に返す
    nextQuery: Promise<FetchResult> | null;
}

const fetchHaikuFromHaikuRefCollection = (baseQuery: firestore.CollectionReference|firestore.Query, limit: number|null = null, startAfter: firestore.DocumentData|null = null): Promise<FetchResult>  => {
    let nextQuery: Promise<FetchResult>|null = null

    let query = baseQuery

    if(limit){query = query.limit(limit)}
    if(startAfter){query = query.startAfter(startAfter)}
     
    return new Promise((resolve, reject) => {
        if(limit&&limit<=0){reject(new Error("range is must be positive"))}
        query.get()
        .then(snapShot => {
            if(snapShot.docs.length){
                const lastDoc = snapShot.docs[snapShot.docs.length - 1]
                nextQuery = fetchHaikuFromHaikuRefCollection(baseQuery, limit, lastDoc)
            }
            return Promise.all(
                snapShot.docs.map(doc => {
                    const ref = (doc.data() as {haikuRef: firestore.DocumentReference}).haikuRef
                    return ref?.get()
                        .then(haikuDoc=>{
                            return haikuDoc.data() as Haiku
                        })
                })
            )
        }).then((haikus) => {
            resolve({haikus: haikus, nextQuery: nextQuery})
        }).catch(err=>{
            console.log(err)
            reject(err)
        })
    })
}

//::This is singleton class
export class HaikuInterecter{

    private static _instance: HaikuInterecter;

    private auth = Auth.getInstance()

    private likeStatusCollection = db().collection("haikuLikeStatuses")
    private allLikeStatusCollection = db().collection("haikuLikeStatuses").doc("all").collection("statuses");
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

    public fetchHaikuWithLikedBy(userId: string, limit: number): Promise<FetchResult> {
        const queryBase = this.usersCollection.doc(userId).collection("likedHaiku").orderBy("createTime", "desc")
        return fetchHaikuFromHaikuRefCollection(queryBase, limit)
    }

    public fetchHaiku(limit: number, startAfter: firebase.firestore.DocumentData | null = null): Promise<FetchResult> {
        const queryBase = this.haikusCollection.orderBy("createdAt", "desc")
        const query = startAfter ? queryBase.startAfter(startAfter).limit(limit).get()
                                    : queryBase.limit(limit).get()
        //先頭から
        return new Promise((resolve, reject) => {
            if(limit <= 0){
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
                    const nextQuery = snapshot.docs.length < limit ? null : this.fetchHaiku(limit, lastDoc)
                    resolve({haikus:newHaikus, nextQuery: nextQuery})
                }).catch((err)=>{
                    console.log(err)
                    reject(err)
                })
        })


    }

    public watchHaikuLikeStatus(id: string, onFetchDoc: (newStatus: HaikuLikeStatus) => void) {
        this.allLikeStatusCollection.doc(id).onSnapshot(doc => {
            const newHaikuStatus: HaikuLikeStatus = doc.data() as HaikuLikeStatus
            onFetchDoc(newHaikuStatus)
        })
    }

    public likeToHaiku(userId: string, haiku: Haiku){
        const batch = db().batch()
        const likedHaikuRef = this.haikusCollection.doc(haiku.id)
        const likedUserRef  = this.usersCollection.doc(userId)
        const newLikedHaiku: LikedHaiku = {"id": haiku.id, "userId": userId, "season": haiku.season ?? "", "haikuRef": likedHaikuRef, createTime: db.FieldValue.serverTimestamp()}

        const status: HaikuLikeStatus = {likedUser: {[userId]: true}, likeCount: db.FieldValue.increment(1), haikuRef: likedHaikuRef}

        //俳句のいいねカウントを更新
        batch.set(this.allLikeStatusCollection.doc(haiku.id), status, {merge: true})
        //ユーザーのいいねリストを追加
        batch.set(likedUserRef.collection("likedHaiku").doc(haiku.id), newLikedHaiku)

        batch.commit()
    }

    public cancelLikeToHaiku(userId: string, haiku: Haiku){
        const batch = db().batch()
        const likedUserRef  = this.usersCollection.doc(userId)

        const status = {likedUser: db.FieldValue.delete(), likeCount: db.FieldValue.increment(-1)}

        //俳句のいいねカウントを更新
        batch.set(this.allLikeStatusCollection.doc(haiku.id), status, {merge: true})
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

    public postHaiku(haiku: Haiku): Promise<void>{
        haiku.createdAt = db.FieldValue.serverTimestamp()
        const newHaikuRef = this.haikusCollection.doc();
        haiku.id = newHaikuRef.id
        return newHaikuRef.set(haiku)
    }
}

export const term = [
    "year",
    "month",
    "week",
    "date"
] as const

export type Term = typeof term[number]

export class HaikuRankingInterecter {
    private static _instance: HaikuRankingInterecter;

    private likeStatusCollection = db().collection("haikuLikeStatuses").doc("all").collection("statuses");
    private usersCollection = db().collection("users");
    private haikusCollection = db().collection("haikus");

    public static getInstance(): HaikuRankingInterecter
    {
        if (!this._instance)
            this._instance = new HaikuRankingInterecter(HaikuRankingInterecter.getInstance);

        return this._instance;
    }

    constructor(caller: Function){
        if (caller == HaikuRankingInterecter.getInstance)
            console.log("インスタンスを作成。。");
        else if (HaikuRankingInterecter._instance)
            throw new Error("既にインスタンスが存在するためエラー。");
        else
            throw new Error("コンストラクタの引数が不正な為エラー。");
    }

    public fetchLikeRanking(atDate: Date, byTerm: Term): Promise<FetchResult>{
        const mdate = moment(atDate)
        const year  = mdate.year().toString()
        const month = mdate.month().toString()
        const week  = Math.floor((mdate.date() - mdate.day() + 12) / 7).toString()
        const date  = mdate.date().toString()

        let coll: firebase.firestore.CollectionReference|null=null
        switch (byTerm){
            case "year":
                coll=this.likeStatusCollection.doc(year).collection("statuses")
                break
            case "month":
                coll=this.likeStatusCollection.doc(year).collection("monthes").doc(month).collection("statuses")
                break
            case "week":
                coll=this.likeStatusCollection.doc(year).collection("monthes").doc(month).collection("weeks").doc(week).collection("statuses")
                break
            case "date":
                coll=this.likeStatusCollection.doc(year).collection("monthes").doc(month).collection("weeks").doc(week).collection("dates").doc(date).collection("statuses")
                break
        }

        const query = coll.orderBy("likeCount")

        return fetchHaikuFromHaikuRefCollection(query, 5)
    }
}