import React, { useState, useEffect } from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import {
    useParams,
    useHistory,
    useLocation,
  } from "react-router-dom";
import '../../css/edit_app.css';
import { SmallCard } from '../views/SmallCard';
import { ChromePicker } from 'react-color';

export const EditApplication = observer((props) => {

    const { globalStore } = useStores();
    let { id } = useParams();

    const history = useHistory();
    const location = useLocation();

    const [app, setApp] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [enhanced, setEnhanced] = useState(false);

    const [apiConfig, setApiConfig] = useState({
        id: app.id,
        api_key: '',
        api_url: '',
        api_username: '',
        api_password: '',
    });

    const [colorPickerVisible, setColorPickerVisible] = useState(false);

    const _showColorPicker = () => setColorPickerVisible(true);
    const _hideColorPicker = () => setColorPickerVisible(false);
    const _setColorPickerVisible = () => {
        setColorPickerVisible(!colorPickerVisible);
    }

    useEffect(() => {
        if (loading) {
            const foundApp = globalStore.apps.find(a => a.id === id)
            setApp(foundApp);

            const getApiConfig = async () => {
                const res = await fetch('/api/auth?id=' + id);
                const json = await res.json();
                setApiConfig(json.api_config);
            }
            getApiConfig();

            setLoading(false);
        }
    }, [globalStore, id, loading]);

    useEffect(() => {
        if (!loading) {
            const appInfo = globalStore.appsData.find(a => a.type === app.type);

            if (appInfo && appInfo.enhanced) {
                setEnhanced(true);
            } else {
                setEnhanced(false);
            }
        }
    }, [app, loading]);

    const _saveApp = async () => {
        let newApps = [...globalStore.apps];

        const index = newApps.findIndex(a => a.id === id);

        newApps[index] = {
            ...app,
            new: false
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

        await fetch('/api/updateauth', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...apiConfig,
                id: app.id
            })
        });

        const { from } = location.state || { from: { pathname: "/editapps" } };
        history.replace(from);
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

        await fetch('/api/deleteAuth?id=' + id, {
            method: 'DELETE'
        });

        const { from } = location.state || { from: { pathname: "/editapps" } };
        history.replace(from);
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

    const _changeColor = async (color) => {
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
        setApiConfig({
            ...apiConfig,
            api_key: e.target.value
        });
    }

    const _changeApiPassword = async e => {
        setApiConfig({
            ...apiConfig,
            api_password: e.target.value
        });
    }

    const _changeApiUsername = async e => {
        setApiConfig({
            ...apiConfig,
            api_username: e.target.value
        });
    }

    const _changeApiUrl = async e => {
        setApiConfig({
            ...apiConfig,
            api_url: e.target.value
        });
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
            <Header app={app} _saveApp={_saveApp} _deleteApp={_deleteApp} deleting={deleting} />
            <Body
                app={app}
                apiConfig={apiConfig}
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
                _setColorPickerVisible={_setColorPickerVisible}
                colorPickerVisible={colorPickerVisible}
                _showColorPicker={_showColorPicker}
                _hideColorPicker={_hideColorPicker}
                enhancedEnabled={enhanced}
            />
        </div>
    )
});

const Body = observer(props => {

    const {
        app,
        apiConfig,
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
        _changeApiUrl,
        _setColorPickerVisible,
        colorPickerVisible,
        _showColorPicker,
        _hideColorPicker,
        enhancedEnabled
    } = props;

    const { globalStore } = useStores();

    const [color, setColor] = useState(app.color);

    const _handleColorChange = (c, event) => {
        setColor(c.hex);
        _changeColor(c.hex);
    }

    const _handleColorChangeComplete = (c, event) => {
        setColor(c.hex);
        _changeColor(c.hex);
    }

    const _updateColor = async (e) => {
        setColor(e.target.value);
        _changeColor(e.target.value);
    }

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }
    const cover = {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }

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
                        <label className='edit_app_body_input_label' htmlFor="app_icon">Icon</label>
                        <img style={{ paddingBottom: 30 }} alt={`App icon: ${app.icon}`} height={100} width={100} src={'/icons/' + app.icon}/>
                        <input id="app_icon" type="file" className="uploadImageBtn" onChange={_uploadImage}/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="bgColor">Color</label>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <input id='app_color' className='textInput' onClick={ _setColorPickerVisible } onChange={_updateColor} value={color} type="text"/>
                            { colorPickerVisible ? <div style={ popover }>
                            <div style={ cover } onClick={ _hideColorPicker }/>
                            <ChromePicker onChangeComplete={_handleColorChangeComplete} onChange={_handleColorChange} color={color} />
                            </div> : null }
                        </div>
                        <div style={{ flexDirection: 'row', paddingTop: 5 }}>
                            <input id="customColor" type="checkbox" checked={app.customColor || false} onChange={_changeCustomColor}/>
                            <label htmlFor="customColor">Enabled</label>
                        </div>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <Preview app={app} />
                </div>

            </div>

            <SubHeader enhancedEnabled={enhancedEnabled} _changeEnhanced={_changeEnhanced} app={app} />

            <div className='edit_app_body_row_3'>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_url">API URL (if different from above)</label>
                        <input id='app_api_url' className='textInput' disabled={!enhancedEnabled} onChange={_changeApiUrl} value={apiConfig.api_url || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_key">API_KEY</label>
                        <input id='app_api_key' className='textInput' disabled={!enhancedEnabled} onChange={_changeApiKey} value={apiConfig.api_key || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_username">Username</label>
                        <input id='app_api_username' className='textInput' disabled={!enhancedEnabled} onChange={_changeApiUsername} value={apiConfig.api_username || ''} type="text"/>
                    </div>
                </div>

                <div className='edit_app_body_item_container'>
                    <div className='edit_body_app_item'>
                        <label className='edit_app_body_input_label' htmlFor="app_api_password">Password</label>
                        <input id='app_api_password' className='textInput' disabled={!enhancedEnabled} onChange={_changeApiPassword} value={apiConfig.api_password || ''} type="password"/>
                    </div>
                </div>

            </div>

        </div>
    )
});

const Header = observer((props) => {
    const {
        _saveApp,
        _deleteApp,
        deleting,
        app
    } = props;

    const history = useHistory();
    const location = useLocation();

    const { globalStore } = useStores();

    const _onCancel = () => {
        if (app.new) {
            const newApps = globalStore.apps.filter(a => a.id !== app.id);
            globalStore.setApps(newApps);
        }
        const { from } = location.state || { from: { pathname: "/editapps" } };
        history.replace(from);
    }

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
            <div className='edit_app_header_delete_button'>
                <button onClick={_onCancel}>
                    { 'Cancel' }
                </button>
            </div>
        </div>
    )
});

const SubHeader = (props) => {

    const {
        app,
        _changeEnhanced,
        enhancedEnabled
    } = props;

    return (
        <div className='edit_app_header'>
            <div className='edit_app_header_title'>
                { 'Enhanced Application Settings' }
            </div>
            <div className='enhanced_checkbox_div'>
                <div>
                    <label style={{ paddingRight: 10 }} htmlFor="app_enhanced">Enhanced</label>
                    <input disabled={!enhancedEnabled} id="app_enhanced" type="checkbox" checked={app.enhanced  || false} onChange={_changeEnhanced}/>
                </div>
            </div>
        </div>
    )
}

const Preview = (props) => {
    const {
        app
    } = props;

    return (
        <div className="edit_app_preview">
            <div className='edit_app_body_input_label'>{'Preview'}</div>
            <SmallCard item={app}/>
        </div>
    )
}