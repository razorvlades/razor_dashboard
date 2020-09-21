import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores';
import {
    useHistory,
    useLocation,
    Link
  } from "react-router-dom";

const Login = observer((props) => {

    const { globalStore } = useStores();
    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const settingsContainerStyle = {
        alignContent: 'center',
        marginTop: 25,
        marginLeft: 500,
        marginRight: 500,
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
                password
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

    return (
        <div style={settingsContainerStyle}>
            <form onSubmit={_onLogin}>
                <label for="uname"><b>Username</b></label>
                <input className='textInput' onChange={_onUsernameChange} value={username} type="text" required/>

                <label for="psw"><b>Password</b></label>
                <input className='textInput' onChange={_onPasswordChange} value={password} type="password" required/>

                <button type="submit">Login</button>
            </form>
            <Link className="menu_button" to="/register">Click here to create a new user</Link>
        </div>
    )
});

export default Login;