export interface Season {
    name: string;
    class: string;
}

export class Const{
 static readonly seasons: Season[] = [
    {name: "春", class: "spring"},
    {name: "夏", class: "summer"},
    {name: "秋", class: "autumn"},
    {name: "冬", class: "winter"}
]
}
