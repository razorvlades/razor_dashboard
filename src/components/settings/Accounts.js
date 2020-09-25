import React, { useEffect, useState } from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import {
    useHistory,
} from "react-router-dom";

export const Accounts = observer(() => {

    const { globalStore } = useStores();
    const history = useHistory();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const result = await fetch('/users');
            const json = await result.json();
            setAccounts(json.users);
            setLoading(false);
        }

        getUsers();
        
    }, []);

    const _addAccount = () => {
        history.replace({ pathname: "/register" });
    }

    const tableHeaderStyle = {
        alignSelf: 'center',
        justifySelf: 'center',
        textAlign: 'left',
        flex: 1,
        paddingLeft: 20,
        fontWeight: 'bold'
    }

    const tableHeaderContainerStyle = {
        width: '100%'
    }

    const tableStyle = {
        textAlign: "left",
        borderCollapse: "collapse",
        width: "100%"
    }

    const buttonStyle = {
        textAlign: 'right',
        flex: 1,
        paddingRight: 20,
        alignSelf: 'center',
        justifySelf: 'center'
    }

    return (
        !loading && 
        <div className='settingsContainer'>
            <div style={tableStyle}>
                <div style={tableHeaderContainerStyle}>
                    <div className="settingsTableHeader">
                        <div style={tableHeaderStyle}>Accounts</div>
                        <div style={buttonStyle}>
                                <button onClick={_addAccount}>Add</button>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        accounts.map((item) => {
                            return (
                                <AccountSettingsItem 
                                    key={item.username}
                                    account={item}
                                    accounts={accounts}
                                    setAccounts={setAccounts}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
});

const AccountSettingsItem = observer((props) => {

    const {
        account,
        accounts,
        setAccounts
    } = props;

    const _deleteAccount = async () => {
        const result = await fetch('/user/delete?username=' + account.username);
        const json = await result.json();
        if (json.ok) {
            const newAccounts = accounts.filter(a => a.username !== account.username);
            setAccounts(newAccounts);
        }
    }

    const buttonStyle = {
        marginRight: 10
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>{account.username}</div>
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <button style={buttonStyle} onClick={_deleteAccount}>Delete</button>
            </div>
        </div>
    )
});