import React, { useState } from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";

import { EditApplication } from './EditApplication';
import { v4 as uuidv4 } from 'uuid';

const EditApps = props => {
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <EditAppsComponent { ...props } />
            </Route>
            <Route path={`${path}/:id`}>
                <EditApplication />
            </Route>
        </Switch>
    )
}

const EditAppsComponent = observer((props) => {

    const { globalStore } = useStores();
    const appList = globalStore.apps;

    const [currentApp, setCurrentApp] = useState({});
    const [editLock, setEditLock] = useState(false);

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
        width: "100%",
        borderRadius: 10,
        overflow: 'hidden',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    }

    const addApplication = () => {
        const newApp = {
            id: uuidv4(),
            name: 'Application Name',
            url: 'https://example.com',
            icon: 'plex.png',
            editing: true,
            color: '#FFFFFF',
            customIcon: false,
            customColor: false,
            type: 'none',
            enhanced: false,
            api_key: '',
            api_password: '',
            api_username: ''
        }
        const newApps = [...globalStore.apps, newApp];
        globalStore.setApps(newApps);
    }

    return (
        <div className='editAppsContainer'>
            {/* <Preview/> */}
            <table style={tableStyle}>
                <thead style={tableHeaderContainerStyle}>
                    <tr className="settingsTableHeader">
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
                            <SettingsAppItem
                                key={app.name + index}
                                editLock={editLock}
                                setEditLock={setEditLock}
                                index={index}
                                app={app}
                                currentApp={currentApp}
                                setCurrentApp={setCurrentApp}
                            />
                        ))
                    }
                </tbody>
            </table>
                <div onClick={addApplication} className="addAppStyle">
                    <div style={{ paddingLeft: 15 }}>Add New Application</div>
                </div>
        </div>
    )
});

const SettingsAppItem = observer((props) => {

    let { path, url: route_url } = useRouteMatch();

    const {
        app,
        index,
        editLock,
        setEditLock,
        currentApp,
        setCurrentApp
    } = props;

    const [editing, setEditing] = useState(app.editing ? app.editing : false);
    const [deleting, setDeleting] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(app.icon);
    const [selectedIconValue, setSelectedIconValue] = useState(app.customIcon ? 'custom' : app.icon);
    const [selectedColor, setSelectedColor] = useState(app.color);
    const [url, setUrl] = useState(app.url);
    const [name, setName] = useState(app.name);
    const [customIcon, setCustomIcon] = useState(app.customIcon);
    const [customColor, setCustomColor] = useState(app.customColor);
    const [type, setType] = useState(app.type);
    const [enhanced, setEnhanced] = useState(app.enhanced);

    const columnStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }

    const _toggleEditing = () => {
        if (!editLock || editing) {
            if (editing) {
                saveApps();
                setEditLock(false);
            }
            else {
                setEditLock(true);
            }
            setEditing(!editing);
        }
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
                title: globalStore.title,
                view: globalStore.view,
            })
        });
    }

    const { globalStore } = useStores();

    const saveApps = async () => {
        let newApps = [...globalStore.apps];
        newApps[index] = {
            ...app,
            id: app.id,
            name: name,
            url: url,
            icon: selectedIcon,
            color: selectedColor,
            customIcon: customIcon,
            customColor: customColor,
            type: type,
            enhanced: enhanced
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
                title: globalStore.title,
                view: globalStore.view
            })
        });
    }

    const _chooseIcon = async (e) => {
        setSelectedIcon(e.target.value);
        setSelectedIconValue(e.target.value);
        setCustomIcon(false);
        const data = globalStore.appsData.find(a => a.icon === e.target.value);
        setType(data.type);
        setEnhanced(data.enhanced);
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

    const _uploadImage = async (e) => {
        const file = e.target.files[0];

        let data = new FormData();

        const imageName = Date.now() + '-' + file.name;
        data.append("imageName", imageName);
        data.append("imageData", file);

        await fetch('/upload-image', {
            method: 'POST',
            body: data
        });
        setCustomIcon(true);
        setSelectedIconValue('custom');
        setSelectedIcon(imageName);
    }

    const iconColumnStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    }

    const iconStyle = {
        alignSelf: 'center'
    }

    const uploadBtnStyle = {
        paddingLeft: 10,
        alignSelf: 'center'
    }

    const _toggleCustomColor = (e) => {
        setCustomColor(!customColor);
    }

    return (
        <tr className='settingsItem'>
            <td style={columnStyle}>
                <input className='textInput' disabled={!editing} onChange={_changeName} value={name} type="text"/>
            </td>
            <td style={columnStyle}>
                <input className='textInput' disabled={!editing} onChange={_changeUrl} value={url} type="text"/>
            </td>
            <td style={columnStyle}>
                <div style={iconColumnStyle}>
                    <img style={iconStyle} height={30} width={30} src={'/icons/' + selectedIcon}></img>
                    <input style={uploadBtnStyle} disabled={!editing} type="file" className="uploadImageBtn" onChange={_uploadImage}/>
                    <select
                        value={selectedIconValue} 
                        onChange={_chooseIcon} 
                        disabled={!editing}
                    >
                        {
                            <>
                            {
                                globalStore.appsData.map((item, index) => {
                                    return (
                                        <option key={item.icon} value={item.icon}>{item.name}</option>
                                    )
                                })
                            }
                            <option key={'Custom'} value={'custom'}>Custom</option>
                            </>
                        }
                    </select>
                </div>
            </td>
            <td style={columnStyle}>
                <input className='colorPicker' disabled={!editing} onChange={_chooseColor} value={selectedColor} id="bgcolor" type="color"/>
                <div style={{ paddingTop: 5 }}>
                    <input disabled={!editing} id="customColor" type="checkbox" name="customColor" checked={customColor} onChange={_toggleCustomColor}/>
                    <label htmlFor="customColor">Custom</label>
                </div>
            </td>
            <td style={columnStyle}>
                <button onClick={_toggleEditing}>
                    { !editing ? 'Edit' : 'Save'}
                </button>
                <Link to={`${route_url}/${app.id}`}>Edit Page</Link>
            </td>
            <td style={columnStyle}>
                <button onClick={_onDeletePress}>
                    { deleting ? 'Are you sure?' : 'Delete'}
                </button>
            </td>
        </tr>
    )
});

const uploadImage = async (image) => {
    let data = new FormData();

    data.append("imageName", 'icon-' + Date.now());
    data.append("imageData", image);

    await fetch('/upload-image', {
        method: 'POST',
        body: data
    });

    return;
}

export default EditApps;