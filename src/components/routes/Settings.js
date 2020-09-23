import React, { useState } from 'react';
import { useStores } from '../../stores';
import { observer } from 'mobx-react';

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

const Settings = observer((props) => {

    const { globalStore } = useStores();

    const tableHeaderStyle = {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 15,
        textAlign: 'left',
    }

    const tableHeaderContainerStyle = {
        width: '100%',
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
    }

    return (
        <div className='settingsContainer'>
            <table style={tableStyle}>
                <thead style={tableHeaderContainerStyle}>
                    <tr className="settingsTableHeader">
                        <th style={tableHeaderStyle}>Settings</th>
                        <th style={tableHeaderStyle}>
                            <button onClick={_saveSettings}>Save</button>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <DefaultViewSettingsItem/>
                    <TitleTextSettingsItem/>
                    <ThemeSettingsItem/>
                </tbody>
            </table>
        </div>
    )
});

const DefaultViewSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const columnStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }

    const _chooseView = async (e) => {
        globalStore.setView(e.target.value);
    }

    return (
        <tr className="settingsItem">
            <td style={columnStyle}>
                <div className='settingsOptionTitle'>Default View</div>
            </td>
            <td style={columnStyle}>
                <select
                    value={globalStore.view} 
                    onChange={_chooseView}
                >
                    {
                        views.map((item, index) => {
                            return (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </td>
        </tr>
    )
});

const TitleTextSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const columnStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }

    const _changeTitle = async (e) => {
        globalStore.setTitle(e.target.value);
    }

    return (
        <tr className="settingsItem">
            <td style={columnStyle}>
                <div className='settingsOptionTitle'>Title</div>
            </td>
            <td style={columnStyle}>
                <input className='textInput' onChange={_changeTitle} value={globalStore.title} type="text"/>
            </td>
        </tr>
    )
});

const ThemeSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const columnStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }

    const _chooseTheme = async (e) => {
        globalStore.setTheme(e.target.value);
    }

    return (
        <tr className="settingsItem">
            <td style={columnStyle}>
                <div className='settingsOptionTitle'>App Theme</div>
            </td>
            <td style={columnStyle}>
                <select
                    value={globalStore.theme} 
                    onChange={_chooseTheme}
                >
                    {
                        themes.map((item, index) => {
                            return (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </td>
        </tr>
    )
});

export default Settings;