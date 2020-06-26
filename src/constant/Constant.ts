export interface Season {
    name: string;
    class: string;
    value: number;
}

export class Const{
 static readonly seasons: Season[] = [
    {name: "春", class: "spring", value: 0},
    {name: "夏", class: "summer", value: 1},
    {name: "秋", class: "autumn", value: 2},
    {name: "冬", class: "winter", value: 3}
]
}
