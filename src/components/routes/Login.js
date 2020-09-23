import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';
import {
    useHistory,
    useLocation,
} from "react-router-dom";

const Login = observer((props) => {

    const { globalStore } = useStores();
    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

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
        <div class="container-login">
			<div class="wrap-login">
				<form class="login-form" onSubmit={_onLogin}>
					<span class="login-form-logo">
                        <img src={require('../../icons/icon.png')} width='100%' height='100%' style={{ overflow: 'hidden', borderRadius: 100 }}/>
					</span>

					<span class="login-form-title">Log in</span>

					<div class="wrap-input" data-validate = "Enter username">
						<input class="input" type="text" name="username" placeholder="Username" onChange={_onUsernameChange} value={username} required/>
                        <span class="focus-input"/>
                    </div>

					<div class="wrap-input" data-validate="Enter password">
						<input class="input" type="password" name="pass" placeholder="Password" onChange={_onPasswordChange} value={password} required/>
                        <span class="focus-input"/>
                    </div>

					<div class="contact-form-checkbox">
						<input class="input-checkbox" id="remember_me" type="checkbox" name="remember-me" checked={remember} onChange={_onRememberChange}/>
						<label class="label-checkbox" htmlFor="remember_me">Remember me</label>
					</div>

					<div class="container-login-form-btn">
						<button type="submit" class="login-form-btn">Login</button>
					</div>
				</form>
			</div>
        </div>
    )
});

export default Login;