import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores';
import {
    useHistory,
    useLocation,
    Link
  } from "react-router-dom";
import './login.css';

const Login = observer((props) => {

    const { globalStore } = useStores();
    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const settingsContainerStyle = {
        alignContent: 'center',
        marginTop: 25,
        marginLeft: '30%',
        marginRight: '30%',
        borderRadius: 10,
        marginBottom: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        overflow: 'hidden',
    }

    const _onLogin = async (e) => {
        e.preventDefault();

        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                remember_me: remember
            })
        });

        const loggedIn = (await res.json()).loggedIn;
        
        if (loggedIn) {
            globalStore.setLoggedIn(true);
            const { from } = location.state || { from: { pathname: "/" } };
            history.replace(from);
        }
    }

    const _onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const _onUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const _onRememberChange = (e) => {
        setRemember(!remember);
    }

    return (
        <div className='loginContainer'>
            <form onSubmit={_onLogin} className="loginForm">
                <label htmlFor="uname"><b>Username</b></label>
                <input id="uname" className='textInput' onChange={_onUsernameChange} value={username} type="text" required/>
                <br></br>
                
                <label htmlFor="psw"><b>Password</b></label>
                <input id="psw" className='textInput' onChange={_onPasswordChange} value={password} type="password" required/>
                <br></br>

                <input type="checkbox" id="remember_me_checkbox" checked={remember} onChange={_onRememberChange}/>
                <label htmlFor="remember_me_checkbox">Remember me</label>
                <br></br>

                <button className='button' type="submit">Login</button>
            </form>
            <Link className="menu_button" to="/register">Click here to create a new user</Link>
        </div>
    )
});

export default Login;