import React from 'react'
import { Route, Router } from 'react-router-dom'
import MobileDetect from 'mobile-detect';
import Bowser from "bowser"
import history from './History';

import About from './pages/About';
import Search from './search/Search';
import Search2 from './search/Search2';
import Login from './auth/Login';
import LoguiData from './components/LoguiData';

import RegisterForm from './auth/RegisterForm'

import SimpleRegister from './tasks/example-simple/Register';
import SimpleSubmit from './tasks/example-simple/Submit';
import SimpleSession from './tasks/example-simple/Session';
import SyncRegister from './tasks/example-group-sync/Register';
import Disqualified from './tasks/example-group-sync/Disqualified';
import SyncPreTest from './tasks/example-group-sync/PreTest';
import SyncIntermediateTests from './tasks/example-group-sync/IntermediateTests';
import SyncPostTest from './tasks/example-group-sync/PostTest';
import SyncSession from './tasks/example-group-sync/Session';
import AsyncRegister from './tasks/example-group-async/Register';
import AsyncFeedback from './tasks/example-group-async/Feedback';
import AsyncSession from './tasks/example-group-async/Session';
import PilotRegister from './tasks/algorithmic-mediation-pilot/Register';
import PilotWait from './tasks/algorithmic-mediation-pilot/Wait';
import PilotSession1 from './tasks/algorithmic-mediation-pilot/Session1';
import PilotDescription1 from './tasks/algorithmic-mediation-pilot/TaskDescription1';
import PilotSession2 from './tasks/algorithmic-mediation-pilot/Session2';
import PilotDescription2 from './tasks/algorithmic-mediation-pilot/TaskDescription2';
import PilotSession3 from './tasks/algorithmic-mediation-pilot/Session3';
import PilotDescription3 from './tasks/algorithmic-mediation-pilot/TaskDescription3';
import PilotPostTest from './tasks/algorithmic-mediation-pilot/PostTest';


import RoleBasedRegister from './tasks/role-based/Register';
import RoleBasedReRegister from './tasks/role-based/ReRegister';
import RoleBasedWait from './tasks/role-based/Wait';
import RoleBasedSession from './tasks/role-based/Session';
import RoleBasedDescription from './tasks/role-based/TaskDescription';
import RoleBasedDescriptionShort from './tasks/role-based/TaskDescriptionShort';
import RoleBasedPostTest from './tasks/role-based/PostTest';
import Chat from './search/features/chat/Chat';
// import { Provider } from 'react-redux';
// import { store } from './store/reduxStore';
import UserStore from '../stores/UserStore';
import { observer } from 'mobx-react';


import './App.css';
import LoginForm from './auth/LoginForm';
import InputField from './auth/InputField';
import SubmitButton from './auth/SubmitButtion';


export class App extends React.Component {

    async componentDidMount() {
        try {
            // let res = await fetch('/isLoggedIn', {
            //     method: 'post',
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-type': 'application/json'
            //     }
            // });
            // console.log("isLoggedIn fetched:", res)

            // let result  = await res.json();
            let isLoggedIn = UserStore.getIsLoggedIn()
            let result = isLoggedIn
            console.log("isloggedin?:", isLoggedIn)
            if (result && result.success) {
                UserStore.setLoading(false)
                UserStore.setIsLoggedIn(true)
                UserStore.setUsername(result.username)

                // UserStore.loading = false;
                // UserStore.isLoggedIn = true;
                // UserStore.username = result.username;
            } else {
                UserStore.setLoading(false)
                UserStore.setIsLoggedIn(false)
                // UserStore.loading = false;
                // UserStore.isLoggedIn = false;
            }
        }
        catch (e) {
            console.log("fetch isLoggedIn err:", e)
            UserStore.setLoading(false)
            UserStore.setIsLoggedIn(false)
            // UserStore.loading = false;
            // UserStore.isLoggedIn = false;
        }
    }

    async doLogout() {
        try {
            let res = await fetch('/logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.setIsLoggedIn(false)
                UserStore.setUsername(results.username)

                // UserStore.isLoggedIn = false;
                // UserStore.username = '';
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    footnote() {
        return (
            <div className="footer" >
                    <About />
            </div>
        )
    }

    render() {
        console.log("rendering App")
        console.log(process.env.react_app_server_url)
        if (UserStore.loading) {
            return (
                <div className='app'>
                    <div className='container'>
                        Loading, please wait ..
                    </div>
                </div>
            );
        } else {
            return (
                <div className='app'>
                    <Router history={history}>
                        <Route exact path="/" component={Search} />
                        <Route exact path="/search2" component={Search2} />
                        <Route path="/loguiData" component={LoguiData} />
                        <Route path="/register" component={RegisterForm} />
                        <Route path="/about" component={About} />
                    </Router>
                    
                </div>
            );
        }

    }
}

export default observer(App)
