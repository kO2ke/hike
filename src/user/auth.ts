import firebase from 'firebase'

export class Auth{

    private static _instance: Auth;

    public static getInstance(): Auth
    {
        if (!this._instance)
            this._instance = new Auth(Auth.getInstance);

        return this._instance;
    }

    public currentUser: firebase.User|null = null

    constructor(caller: Function){
        if (caller == Auth.getInstance){
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user
                if(user){
                    firebase.firestore().collection("users").doc(user.uid).set({id: user.uid}, {merge: true})
                        .then(() => {
                            console.log(user.uid)
                        })
                        .catch(err => {console.log(err)})
                }
            });
        }
        else if (Auth._instance)
            throw new Error("既にインスタンスが存在するためエラー。");
        else
            throw new Error("コンストラクタの引数が不正な為エラー。");
    }
    
    public signOut() {
        return firebase.auth().signOut()
    }
}