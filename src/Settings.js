import React, { useState, useRef } from 'react';
import { useStores } from './stores';
import { observer } from 'mobx-react';
import Icons from './config/icons.json';

const Settings = observer((props) => {

    const { globalStore } = useStores();
    const appList = globalStore.apps;

    const settingsContainerStyle = {
        alignContent: 'center',
        marginTop: 25,
        marginLeft: 150,
        marginRight: 150,
        borderRadius: 10,
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

    const [hover, setHover] = useState(false);
    const _toggleHover = () => setHover(!hover);

    const addAppStyle = {
        backgroundColor: hover ? '#F2F3F6' : 'white',
        cursor: 'pointer',
        height: 40,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15
    }

    const addApplication = () => {
        const newApp = {
            name: 'Application Name',
            url: 'https://example.com',
            icon: './assets/icons/plex.png',
            editing: true,
            color: '#FFFFFF'
        }
        const newApps = [...globalStore.apps, newApp];
        globalStore.setApps(newApps);
    }

    return (
        <div style={settingsContainerStyle}>
            <table style={tableStyle}>
                <thead style={tableHeaderContainerStyle}>
                    <tr style={itemStyle}>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>URL</th>
                        <th style={tableHeaderStyle}>Icon</th>
                        <th style={tableHeaderStyle}>Color</th>
                        <th style={tableHeaderStyle}>Edit</th>
                        <th style={tableHeaderStyle}>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        appList.map((app, index) => (
                            <SettingsAppItem key={app.name + index} index={index} app={app}/>
                        ))
                    }
                </tbody>
            </table>
                <div onClick={addApplication} onMouseEnter={_toggleHover} onMouseLeave={_toggleHover} style={addAppStyle}>
                    <div>Add New Application</div>
                </div>
        </div>
    )
});

const SettingsAppItem = observer((props) => {

    const {
        app,
        index
    } = props;

    const [editing, setEditing] = useState(app.editing ? app.editing : false);
    const [deleting, setDeleting] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(app.icon);
    const [selectedColor, setSelectedColor] = useState(app.color);
    const [url, setUrl] = useState(app.url);
    const [name, setName] = useState(app.name);

    const [hover, setHover] = useState(false);

    const _toggleHover = () => setHover(!hover);

    const itemStyle = {
        backgroundColor: hover ? '#F2F3F6' : 'white',
        paddingTop: 10,
        paddingBottom: 10,
        cursor: 'pointer',
        height: 60
    }

    const columnStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }

    const _toggleEditing = () => {
        if (editing) {
            saveApps();
        }
        setEditing(!editing);
    }

    const _onDeletePress = () => {
        if (deleting) {
            deleteApp();
        }
        else {
            setDeleting(true);
        }
    }

    const deleteApp = async () => {
        const newApps = globalStore.apps.filter((a, i) => {
            return i !== index
        });

        globalStore.setApps(newApps);

        await fetch('/updateConfig', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apps: newApps,
                theme: globalStore.theme,
                title: globalStore.title
            })
        });
    }

    const { globalStore } = useStores();

    const saveApps = async () => {
        let newApps = [...globalStore.apps];
        newApps[index] = {
            name: name,
            url: url,
            icon: selectedIcon,
            color: selectedColor
        }
        globalStore.setApps(newApps);

        await fetch('/updateConfig', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apps: newApps,
                theme: globalStore.theme,
                title: globalStore.title
            })
        });
    }

    const _chooseIcon = async (e) => {
        setSelectedIcon(e.target.value);
    }

    const _chooseColor = async (e) => {
        setSelectedColor(e.target.value);
    }

    const _changeUrl = async (e) => {
        setUrl(e.target.value);
    }

    const _changeName = async (e) => {
        setName(e.target.value);
    }

    return (
        <tr onMouseEnter={_toggleHover} onMouseLeave={_toggleHover} style={itemStyle}>
            <td style={columnStyle}>
                <input disabled={!editing} onChange={_changeName} value={name} id="nameText" type="text"/>
            </td>
            <td style={columnStyle}>
                <input disabled={!editing} onChange={_changeUrl} value={url} id="urlText" type="text"/>
            </td>
            <td style={columnStyle}>
                <select
                    value={selectedIcon} 
                    onChange={_chooseIcon} 
                    defaultValue={selectedIcon}
                    disabled={!editing}
                >
                    {
                        Icons.icons.map((item, index) => {
                            return (
                                <option key={item.icon} value={item.icon}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </td>
            <td style={columnStyle}>
                <input disabled={!editing} onChange={_chooseColor} value={selectedColor} id="bgcolor" type="color"/>
            </td>
            <td style={columnStyle}>
                <button onClick={_toggleEditing}>
                    { !editing ? 'Edit' : 'Save'}
                </button>
            </td>
            <td style={columnStyle}>
                <button onClick={_onDeletePress}>
                    { deleting ? 'Are you sure?' : 'Delete'}
                </button>
            </td>
        </tr>
    )
});

export default Settings;