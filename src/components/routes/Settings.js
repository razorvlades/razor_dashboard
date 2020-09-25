import React from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import {
    useHistory,
} from "react-router-dom";
import { Accounts } from '../settings/Accounts';

const views = [
    {
        name: 'Grid',
        value: 'grid'
    },
    {
        name: 'Small Grid',
        value: 'small_grid'
    },
    {
        name: 'Compact Grid',
        value: 'compact_grid'
    }
];

const themes = [
    {
        name: 'Light',
        value: 'light'
    },
    {
        name: 'Dark',
        value: 'dark'
    }
];

const Settings = observer(() => {

    const { globalStore } = useStores();
    const history = useHistory();

    const tableHeaderStyle = {
        alignSelf: 'center',
        justifySelf: 'center',
        textAlign: 'left',
        flex: 1,
        paddingLeft: 20,
        fontWeight: 'bold'
    }

    const saveButtonStyle = {
        textAlign: 'right',
        flex: 1,
        paddingRight: 20,
        alignSelf: 'center',
        justifySelf: 'center'
    }

    const tableHeaderContainerStyle = {
        width: '100%'
    }

    const tableStyle = {
        textAlign: "left",
        borderCollapse: "collapse",
        width: "100%"
    }

    const _saveSettings = async () => {
        await fetch('/updateConfig', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apps: globalStore.apps,
                theme: globalStore.theme,
                title: globalStore.title,
                view: globalStore.view
            })
        });

        history.replace({ pathname: "/" });
    }

    return (
        <>
            <div className='settingsContainer'>
                <div style={tableStyle}>
                    <div style={tableHeaderContainerStyle}>
                        <div className="settingsTableHeader">
                            <div style={tableHeaderStyle}>Settings</div>
                            <div style={saveButtonStyle}>
                                <button onClick={_saveSettings}>Save</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <DefaultViewSettingsItem/>
                        <TitleTextSettingsItem/>
                        <ThemeSettingsItem/>
                    </div>
                </div>
            </div>

            <Accounts/>
        </>
    )
});

const DefaultViewSettingsItem = observer(() => {

    const { globalStore } = useStores();

    const _chooseView = async (e) => {
        globalStore.setView(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Default View</div>
            </div>
            <div className='settings_item_input_container'>
                <select
                    value={globalStore.view} 
                    onChange={_chooseView}
                    className='settings_item_select'
                >
                    {
                        views.map((item) => {
                            return (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
});

const TitleTextSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const _changeTitle = async (e) => {
        globalStore.setTitle(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Title</div>
            </div>
            <div className='settings_item_input_container'>
                <input style={{ width: '69%'}} className='textInput' onChange={_changeTitle} value={globalStore.title} type="text"/>
            </div>
        </div>
    )
});

const ThemeSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const _chooseTheme = async (e) => {
        globalStore.setTheme(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>App Theme</div>
            </div>
            <div className='settings_item_input_container'>
                <select
                    value={globalStore.theme} 
                    onChange={_chooseTheme}
                    className='settings_item_select'
                >
                    {
                        themes.map((item, index) => {
                            return (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
});

export default Settings;