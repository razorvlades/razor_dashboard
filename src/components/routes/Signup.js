import React, { useState, useEffect } from 'react';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import '../../css/register.css';

const Signup = (props) => {

    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const _onSignup = async (e) => {
        e.preventDefault();

        const res = await fetch('/create_user', {
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

        const registered = (await res.json()).registered;
        
        if (registered) {
            const { from } = location.state || { from: { pathname: "/settings" } };
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
        <div class="container-register">
			<div class="wrap-login">
				<form class="login-form" onSubmit={_onSignup}>
					<span class="login-form-logo">
                        <img alt='RazorDash logo' src={require('../../icons/icon.png')} width='100%' height='100%' style={{ overflow: 'hidden', borderRadius: 100 }}/>
					</span>

					<span class="login-form-title">New Account</span>

					<div class="wrap-input" data-validate = "Enter username">
						<input class="input" type="text" name="username" placeholder="Username" onChange={_onUsernameChange} value={username} required/>
                        <span class="focus-input"/>
                    </div>

					<div class="wrap-input" data-validate="Enter password">
						<input class="input" type="password" name="pass" placeholder="Password" onChange={_onPasswordChange} value={password} required/>
                        <span class="focus-input"/>
                    </div>

					<div class="container-login-form-btn">
						<button type="submit" class="login-form-btn">Create Account</button>
					</div>
				</form>
			</div>
        </div>  
    )
}

export default Signup;