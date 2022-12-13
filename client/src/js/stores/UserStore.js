import { extendObservable } from "mobx";

class UserStore {
    constructor(){
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            username: '',

            getIsLoggedIn() {
                return this.isLoggedIn
            },
            getUsername: function () {
                return this.username
            },
            setLoading(newBool) {
                this.loading = newBool
            },
            setIsLoggedIn(newBool) {
                this.isLoggedIn = newBool
            },
            setUsername(newUserName) {
                this.username = newUserName
                localStorage.setItem("username", newUserName)
            },
        })
    }
}



export default new UserStore();