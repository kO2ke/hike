import {Haiku} from "./Haiku"
import moment from 'moment';

export default class HaikuInterecter{
    public stub: Haiku[]
    constructor(){
        this.stub = [{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"春の雷",season:0,createdAt:"2020-01-01",id:1},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"夏の雷",season:1,createdAt:"2020-01-02",id:2},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"秋の雷",season:2,createdAt:"2020-01-03",id:3},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"冬の雷",season:3,createdAt:"2020-01-04",id:4}]
    }

    public fetchAll(): Promise<Haiku[]> {
        return this.stubFetchAll()
    }

    public fetchWithSeason(season: number): Promise<Haiku[]> {
        return this.stubFetchWithSeason(season) 
    }

    public postHaiku(haiku: Haiku, success: (success: Haiku[]) => void): void{
        haiku.createdAt = moment(new Date()).format(("YYYY-MM-DD HH:mm"))
        haiku.id = this.stub.length + 1
        this.stub.push(haiku)
        console.log(haiku.createdAt)
        success(this.stub)
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

    private stubFetchWithSeason(season: number): Promise<Haiku[]> {
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