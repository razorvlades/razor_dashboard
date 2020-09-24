import React, { useState, useEffect } from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import {
    useParams,
  } from "react-router-dom";
import '../../css/edit_app.css';

export const EditApplication = observer((props) => {

    const { globalStore } = useStores();
    let { id } = useParams();

    const [app, setApp] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    
    useEffect(() => {
        if (loading) {
            setApp(globalStore.apps.find(a => a.id === id));
            setLoading(false);
        }
    }, [globalStore, id, loading]);

    const _saveApp = async () => {
        let newApps = [...globalStore.apps];

        const index = newApps.findIndex(a => a.id === id);

        newApps[index] = {
            ...app
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

    const _deleteApp = async () => {
        if (deleting)
            deleteApp();
        else
            setDeleting(true);
    }

    const deleteApp = async () => {
        const newApps = globalStore.apps.filter((a) => a.id !== id);
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
    
    const _changeName = async (e) => {
        const name = e.target.value;
        setApp({
            ...app,
            name
        });
    }

    const _changeType = async (e) => {
        if (e.target.value === 'none') {
            setApp({
                ...app,
                type: 'none',
                enhanced: false,
                customIcon: true
            });
        }
        else {
            const data = globalStore.appsData.find(a => a.type === e.target.value);

            setApp({
                ...app,
                type: data.type,
                enhanced: data.enhanced,
                icon: data.icon,
                customIcon: false
            });
        }
    }

    const _changeURL = async (e) => {
        const url = e.target.value;
        setApp({
            ...app,
            url
        });
    }

    const _changeColor = async (e) => {
        const color = e.target.value;
        setApp({
            ...app,
            color
        });
    }

    const _changeCustomColor = async e => {
        setApp({
            ...app,
            customColor: !app.customColor
        });
    }

    const _changeEnhanced = async e => {
        setApp({
            ...app,
            enhanced: !app.enhanced
        });
    }
    
    const _changeApiKey = async e => {
        setApp({
            ...app,
            api_key: e.target.value
        });
    }

    const _changeApiPassword = async e => {
        setApp({
            ...app,
            api_password: e.target.value
        });
    }

    const _changeApiUsername = async e => {
        setApp({
            ...app,
            api_username: e.target.value
        });
    }

    const _changeApiUrl = async e => {
        setApp({
            ...app,
            api_url: e.target.value
        })
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

        setApp({
            ...app,
            customIcon: true,
            icon: imageName,
        });
    }
    
    return (
        !loading &&
        <div className='edit_app_container'>
            <Header _saveApp={_saveApp} _deleteApp={_deleteApp} deleting={deleting} />
            <Body
                app={app}
                _changeName={_changeName}
                _changeType={_changeType}
                _changeURL={_changeURL}
                _changeColor={_changeColor}
                _changeEnhanced={_changeEnhanced}
                _uploadImage={_uploadImage}
                _changeCustomColor={_changeCustomColor}
                _changeApiUsername={_changeApiUsername}
                _changeApiKey={_changeApiKey}
                _changeApiPassword={_changeApiPassword}
                _changeApiUrl={_changeApiUrl}
            />
        </div>
    )
});

const Body = observer(props => {

    const {
        app,
        _changeName,
        _changeColor,
        _changeType,
        _changeURL,
        _changeCustomColor,
        _uploadImage,
        _changeEnhanced,
        _changeApiUsername,
        _changeApiKey,
        _changeApiPassword,
        _changeApiUrl
    } = props;

    const { globalStore } = useStores();

    return (
        <div className='edit_app_body'>

            <div className='edit_app_body_row_1'>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_name">Application Name</label>
                        <input id='app_name' className='textInput' onChange={_changeName} value={app.name || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_type">Application Type</label>
                        <select
                            value={app.type} 
                            onChange={_changeType}
                            className='edit_app_select'
                        >
                            {
                                <>
                                    {
                                        globalStore.appsData.map((item, index) => {
                                            return (
                                                <option key={item.type} value={item.type}>{item.name}</option>
                                            )
                                        })
                                    }
                                    <option key={'none'} value={'none'}>Custom</option>
                                </>
                            }
                        </select>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_url">URL</label>
                        <input id='app_url' className='textInput' onChange={_changeURL} value={app.url || ''} type="text"/>
                    </div>
                </div>

            </div>

            <div className='edit_app_body_row_2'>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="bgColor">Color</label>
                        <input className='colorPicker' onChange={_changeColor} value={app.color || ''} id="bgColor" type="color"/>
                        <div style={{ flexDirection: 'row', paddingTop: 5 }}>
                            <input id="customColor" type="checkbox" checked={app.customColor || false} onChange={_changeCustomColor}/>
                            <label htmlFor="customColor">Custom</label>
                        </div>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_icon">Icon</label>
                        <img alt={`App icon: ${app.icon}`} height={30} width={30} src={'/icons/' + app.icon}/>
                        <input id="app_icon" type="file" className="uploadImageBtn" onChange={_uploadImage}/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label htmlFor="app_enhanced">Enhanced</label>
                        <input id="app_enhanced" type="checkbox" checked={app.enhanced  || false} onChange={_changeEnhanced}/>

                        <label className='edit_app_body_input_label' htmlFor="app_api_url">API URL (if different from app URL)</label>
                        <input id='app_api_url' className='textInput' onChange={_changeApiUrl} value={app.api_url || ''} type="text"/>
                    </div>
                </div>

            </div>

            <div className='edit_app_body_row_3'>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_key">API_KEY</label>
                        <input id='app_api_key' className='textInput' onChange={_changeApiKey} value={app.api_key || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_username">Username</label>
                        <input id='app_api_username' className='textInput' onChange={_changeApiUsername} value={app.api_username || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_password">Password</label>
                        <input id='app_api_password' className='textInput' onChange={_changeApiPassword} value={app.api_password || ''} type="password"/>
                    </div>
                </div>

            </div>

        </div>
    )
});

const Header = (props) => {
    const {
        _saveApp,
        _deleteApp,
        deleting
    } = props;

    return (
        <div className='edit_app_header'>
            <div className='edit_app_header_title'>
                { 'Edit Application' }
            </div>
            <div className='edit_app_header_save_button'>
                <button onClick={_saveApp}>
                    {'Save'}
                </button>
            </div>
            <div className='edit_app_header_delete_button'>
                <button onClick={_deleteApp}>
                    { deleting ? 'Are you sure?' : 'Delete'}
                </button>
            </div>
        </div>
    )
}

// const Preview = (props) => {
//     const {
//         app
//     } = props;

//     return (
//         <div>
//             <Card item={app}/>
//         </div>
//     )
// }