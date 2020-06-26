import {Haiku} from "./Haiku"

export default class HaikuInterecter{
    public stub: Haiku[]
    constructor(){
        this.stub = [{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"春の雷",season:0,createdAt:"2020-01-01",id:1},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"夏の雷",season:1,createdAt:"2020-01-02",id:2},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"秋の雷",season:2,createdAt:"2020-01-03",id:3},{composer:"近藤さちこ",first:"あした行く",second:"方より聞こゆ",third:"冬の雷",season:3,createdAt:"2020-01-04",id:4}]
    }

    public fetchAll(success: (result: Haiku[]) => void): void {
        setTimeout(() => {
            success(this.stub)
        }, 1000);   
    }

    public fetchWithSeason(season: number, success: (result: Haiku[]) => void): void {
        setTimeout(() => {
            success(this.stub.filter(function(val){return val.season == season}))
        }, 1000); 
    }

    public postHaiku(composer: string, first: string, second: string, third: string, season: number, success: (result: Haiku[]) => void): void{
        const newHaiku: Haiku  = {composer: composer, 
            first: first, 
            second: second, 
            third: third, 
            season: season,
            createdAt: Date.now.toString(),
            id: this.stub.length + 1
        }
        this.stub.push(newHaiku)
        success(this.stub)
    }
}