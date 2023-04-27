import React from "react";
import { Route, Router } from "react-router-dom";
import history from "./History";
import About from "./pages/About";
import Search from "./search/Search";

// import Search2 from "./search/Search2";
import MyLoguiData from "./components/MyLoguiData";
import MyMongoData from "./components/MyMongoData";

// import RegisterForm from "./auth/RegisterForm";

// import { Provider } from 'react-redux';
// import { store } from './store/reduxStore';
import UserStore from "../stores/UserStore";
// import Popup from "./Popup";
import { observer } from "mobx-react";

import "./App.css";
// import AccountStore from "../stores/AccountStore";
// console.log("---App");

export class App extends React.Component {
    async componentDidMount() {
        // try {
        //     // const response = await fetch('/api/T35T');
        //     let testServer = "/api/TE5T";
        //     if (process.env.NODE_ENV === "development") {
        //         testServer = "http://84.46.248.181:2999/api/T35T"
        //     }
        //     const response = await fetch(testServer);
        //     console.log(response);
        // } catch (err) {
        //     console.error("proxy err:", err);
        // }
        UserStore.setLoading(false);
        UserStore.loading = false;
       
        

        // try {
        //     let isLoggedIn = UserStore.getIsLoggedIn();

        //     let result = isLoggedIn;
        //     console.log('isloggedin?:', isLoggedIn);

        //     if (result && result.success) {
        //         UserStore.setLoading(false);
        //         UserStore.setIsLoggedIn(true);
        //         UserStore.setUsername(result.username);

        //         // UserStore.loading = false;
        //         // UserStore.isLoggedIn = true;
        //         // UserStore.username = result.username;
        //     } else {
        //         UserStore.setLoading(false);
        //         UserStore.setIsLoggedIn(false);
        //         // UserStore.loading = false;
        //         // UserStore.isLoggedIn = false;
        //     }
        // } catch (e) {
        //     console.log('fetch isLoggedIn err:', e);
        //     UserStore.setLoading(false);
        //     UserStore.setIsLoggedIn(false);
        //     // UserStore.loading = false;
        //     // UserStore.isLoggedIn = false;
        // }
    }

    componentWillUnmount() {
    }

    async doLogout() {
        try {
            let res = await fetch("/logout", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.setIsLoggedIn(false);
                UserStore.setUsername(result.username);

                // UserStore.isLoggedIn = false;
                // UserStore.username = '';
            }
        } catch (e) {
            console.log(e);
        }
    }

    footnote() {
        return (
            <div className="footer">
                <About />
            </div>
        );
    }

    render() {
        localStorage.setItem("server_url", process.env.REACT_APP_SERVER_URL);
        if (UserStore.loading) {
            return (
                <div className="app">
                    <div className="container">Loading, please wait ..</div>
                </div>
            );
        } else {
            return (
                <>
                    {/* <Popup /> */}

                    <div className="app">
                        <Router history={history}>
                            <Route exact path="/" component={Search} />
                            <Route
                                exact
                                path="/loguidata"
                                component={MyLoguiData}
                            />
                            <Route
                                exact
                                path="/mongodata"
                                component={MyMongoData}
                            />
                            {/* <Route exact path="/search2" component={Search2} /> */}
                            {/* <Route path="/loguiData" component={LoguiData} /> */}
                            {/* <Route path="/register" component={RegisterForm} /> */}
                            <Route path="/about" component={About} />
                        </Router>
                    </div>
                </>
            );
        }
    }
}

// export default withParams(observer(App))
export default observer(App);
