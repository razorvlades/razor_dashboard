import React, { useState } from 'react';
import { useStores } from './stores';
import { observer } from 'mobx-react';
import './settings.css';

const views = [
    {
        name: 'Grid',
        value: 'grid'
    },
    {
        name: 'Small Grid',
        value: 'small_grid'
    }
];

const Settings = observer((props) => {

    const { globalStore } = useStores();

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

    const itemStyle = {
        backgroundColor: '#F2F3F6',
        paddingTop: 10,
        paddingBottom: 10,
        height: 40,
    }

    const tableHeaderStyle = {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 15,
        textAlign: 'left',
        backgroundColor: '#F2F3F6',
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
        <div style={settingsContainerStyle}>
            <table style={tableStyle}>
                <thead style={tableHeaderContainerStyle}>
                    <tr style={itemStyle}>
                        <th style={tableHeaderStyle}>Settings</th>
                        <th style={tableHeaderStyle}>
                            <button onClick={_saveSettings}>Save</button>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <DefaultViewSettingsItem></DefaultViewSettingsItem>
                </tbody>
            </table>
        </div>
    )
});

const DefaultViewSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const [hover, setHover] = useState(false);
    const _setHoverOn = () => setHover(true);
    const _setHoverOff = () => setHover(false);

    const itemStyle = {
        backgroundColor: hover ? '#F2F3F6' : 'white',
        paddingTop: 10,
        paddingBottom: 10,
        //cursor: 'pointer',
        height: 60
    }

    const columnStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }

    const _chooseView = async (e) => {
        globalStore.setView(e.target.value);
    }

    return (
        <tr onMouseEnter={_setHoverOn} onMouseLeave={_setHoverOff} style={itemStyle}>
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

export default Settings;