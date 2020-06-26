import {Haiku} from "./Haiku"

export default class HaikuInterecter{
    public stub: Haiku[]
    constructor(){
        this.stub = [{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"春の雷",season:0,createdAt:"2020-01-01",id:1},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"夏の雷",season:1,createdAt:"2020-01-02",id:2},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"秋の雷",season:2,createdAt:"2020-01-03",id:3},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"冬の雷",season:3,createdAt:"2020-01-04",id:4}]
    }

    public fetchAll(success: (result: Haiku[]) => void): void {
        setTimeout(() => {
            success(this.stub.map((val)=>{
                val.composer = val.composer.length == 0 ? "詠み人知らず" : val.composer
                return val
            }))
        }, 1000);   
    }

    public fetchWithSeason(season: number, success: (result: Haiku[]) => void): void {
        setTimeout(() => {
            success(this.stub.filter(function(val){return val.season == season}).map((val)=>{
                val.composer = val.composer.length == 0 ? "詠み人知らず" : val.composer
                return val
            }))
        }, 1000); 
    }

    public postHaiku(haiku: Haiku, success: (success: Haiku[]) => void): void{
        haiku.createdAt = Date.now.toString()
        haiku.id = this.stub.length + 1
        this.stub.push(haiku)
        success(this.stub)
    }
}