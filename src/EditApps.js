import React, { useState } from 'react';
import { useStores } from './stores';
import { observer } from 'mobx-react';
import './settings.css';
import Card from './Card';

const EditApps = observer((props) => {

    const { globalStore } = useStores();
    const appList = globalStore.apps;

    const [currentApp, setCurrentApp] = useState({});
    const [editLock, setEditLock] = useState(false);

    const settingsContainerStyle = {
        alignContent: 'center',
        marginTop: 25,
        marginLeft: 150,
        marginRight: 150,
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
            icon: 'plex.png',
            editing: true,
            color: '#FFFFFF',
            customIcon: false
        }
        const newApps = [...globalStore.apps, newApp];
        globalStore.setApps(newApps);
    }

    return (
        <div style={settingsContainerStyle}>
            {/* <Preview/> */}
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
                <div onClick={addApplication} onMouseEnter={_toggleHover} onMouseLeave={_toggleHover} style={addAppStyle}>
                    <div>Add New Application</div>
                </div>
        </div>
    )
});

const SettingsAppItem = observer((props) => {

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
            name: name,
            url: url,
            icon: selectedIcon,
            color: selectedColor,
            customIcon: customIcon
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

    React.useEffect(() => {
        console.log(selectedIcon);
    }, [selectedIcon]);

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

    return (
        <tr onMouseEnter={_setHoverOn} onMouseLeave={_setHoverOff} style={itemStyle}>
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
                                globalStore.icons.map((item, index) => {
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

const Preview = (props) => {
    const {
        app
    } = props;

    return (
        <div>
            <Card item={app}/>
        </div>
    )
}

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