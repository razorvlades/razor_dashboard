import React, { useState } from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import { 
    useHistory,
    useLocation,
    useParams
} from 'react-router-dom';

export const EditUser = observer((props) => {

    let params = useParams();
    const history = useHistory();
    const location = useLocation();

    const [deleting, setDeleting] = useState(false);

    const [username, setUsername] = useState(params.username);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    
    const _changeUsername = e => {
        setUsername(e.target.value);
    }

    const _changePassword = e => {
        setPassword(e.target.value);
    }

    const _changeConfirmPassword = e => {
        setPasswordConfirm(e.target.value);
    }

    const _updateAccount = async () => {
        let user;
        if (password === passwordConfirm && password !== '') {
            user = {
                current_username: params.username,
                username: username,
                password: password
            }
        }
        else {
            user = {
                current_username: params.username,
                username: username
            } 
        }

        const result = await fetch('/user/update', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user
            })
        });
    }

    const _deleteAccount = async () => {
        if (!deleting) {
            setDeleting(true);
        }
        else {
            await fetch('/user/delete?username=' + username);
            const { from } = location.state || { from: { pathname: "/settings" } };
            history.replace(from);
        }
    }

    return (
        <div className='edit_app_container'>
            <Header deleting={deleting} _updateAccount={_updateAccount} _deleteAccount={_deleteAccount} />
            <Body 
                username={username} 
                password={password}
                passwordConfirm={passwordConfirm}
                _changeUsername={_changeUsername}
                _changePassword={_changePassword}
                _changeConfirmPassword={_changeConfirmPassword}
            />
        </div>
    )
});

const Header = props => {

    const {
        deleting,
        _updateAccount,
        _deleteAccount
    } = props;

    const history = useHistory();
    const location = useLocation();

    const _onCancel = () => {
        const { from } = location.state || { from: { pathname: "/settings" } };
        history.replace(from);
    }

    return (
        <div className='edit_app_header'>
            <div className='edit_app_header_title'>
                { 'Edit User' }
            </div>
            <div className='edit_app_header_save_button'>
                <button onClick={_updateAccount}>
                    {'Save'}
                </button>
            </div>
            <div className='edit_app_header_delete_button'>
                <button onClick={_deleteAccount}>
                    { deleting ? 'Are you sure?' : 'Delete'}
                </button>
            </div>
            <div className='edit_app_header_delete_button'>
                <button onClick={_onCancel}>
                    { 'Cancel' }
                </button>
            </div>
        </div>
    )
}

const Body = props => {

    const {
        username,
        password,
        passwordConfirm,
        _changeUsername,
        _changePassword,
        _changeConfirmPassword
    } = props;

    return (
        <div className='edit_app_body'>

            <div className='edit_app_body_row_1'>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="username">Username</label>
                        <input id='username' className='textInput' onChange={_changeUsername} value={username || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="password">Password</label>
                        <input id='password' className='textInput' onChange={_changePassword} value={password} type="password"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="confirm_password">Confirm Password</label>
                        <input id='confirm_password' className='textInput' onChange={_changeConfirmPassword} value={passwordConfirm} type="password"/>
                    </div>
                </div>

            </div>

        </div>
    )
}