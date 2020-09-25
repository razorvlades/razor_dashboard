import React, { useState } from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useHistory,
    useLocation,
  } from "react-router-dom";

import { EditApplication } from './EditApplication';
import { v4 as uuidv4 } from 'uuid';

const EditApps = props => {
    
    let { path } = useRouteMatch();

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
    const history = useHistory();
    const location = useLocation();

    const [editLock, setEditLock] = useState(false);
    const [editing, setEditing] = useState(false);
    const [appsCopy, setAppsCopy] = useState(globalStore.apps);

    const _toggleEditing = () => {
        if (!editLock || editing) {
            if (editing) {
                saveApps(appsCopy);
                setEditLock(false);
            }
            else {
                setEditLock(true);
            }
            setEditing(!editing);
        }
    }

    const saveApps = async (newApps) => {
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

    const addApplication = async () => {
        const newApp = {
            id: uuidv4(),
            name: 'Application Name',
            url: 'https://example.com',
            icon: 'plex.png',
            color: '#FFFFFF',
            customIcon: false,
            customColor: false,
            type: 'none',
            enhanced: false,
            api_key: '',
            api_password: '',
            api_username: '',
            api_url: '',
            new: true,
        }
        const newApps = [...appsCopy, newApp];
        setAppsCopy(newApps);
        globalStore.setApps(newApps);
        const { from } = location.state || { from: { pathname: "/editapps/" + newApp.id } };
        history.replace(from);
    }

    return (
        <div className='editAppsContainer'>
            <div className='editAppsTable'>
                <div className="settingsTableHeader">
                    <div className='table_header_name'>Name</div>
                    <div className='table_header_url'>URL</div>
                    <div className='table_header_edit'>
                        <button onClick={_toggleEditing}>{ !editing ? 'Quick Edit' : 'Save'}</button>
                    </div>
                    <div className='table_header_delete'>Delete</div>
                </div>

                <div className="edit_apps_body">
                    {
                        appsCopy.map((app, index) => (
                            <SettingsAppItem
                                key={app.name + index}
                                app={app}
                                editing={editing}
                                appsCopy={appsCopy}
                                setAppsCopy={setAppsCopy}
                            />
                        ))
                    }
                </div>
            </div>
                <div onClick={addApplication} className="addAppStyle">
                    <div style={{ paddingLeft: 15 }}>Add New Application</div>
                </div>
        </div>
    )
});

const SettingsAppItem = observer((props) => {

    let { url: route_url } = useRouteMatch();

    const {
        app,
        editing,
        appsCopy,
        setAppsCopy
    } = props;

    const [deleting, setDeleting] = useState(false);
    const [url, setUrl] = useState(app.url);
    const [name, setName] = useState(app.name);

    const saveApp = async (name, url) => {
        let newApps = [...appsCopy];
        const index = newApps.findIndex(a => a.id === app.id)
        newApps[index] = {
            ...app,
            name: name,
            url: url
        }
        setAppsCopy(newApps);
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
        const newApps = appsCopy.filter(a => a.id !== app.id);
        setAppsCopy(newApps);
    }

    const _changeUrl = async (e) => {
        setUrl(e.target.value);
        saveApp(name, e.target.value);
    }

    const _changeName = async (e) => {
        setName(e.target.value);
        saveApp(e.target.value, url);
    }

    return (
        <div className='settingsItem'>
            <div className='settings_item_name_container'>
                <img alt={`App icon: ${app.icon}`} className='settings_item_icon' height={40} width={40} src={'/icons/' + app.icon}/>
                <input className='settings_item_name_input settings_item_textinput' disabled={!editing} onChange={_changeName} value={name} type="text"/>
            </div>
            <div className='settings_item_url_container'>
                <input className='settings_item_name_input settings_item_textinput' disabled={!editing} onChange={_changeUrl} value={url} type="text"/>
            </div>
            <div className='edit_apps_edit_button_container'>
                <Link className='edit_page_link' to={`${route_url}/${app.id}`}>Edit App</Link>
            </div>
            <div className='edit_apps_delete_button_container'>
                <button disabled={!editing} onClick={_onDeletePress}>
                    { deleting ? 'Are you sure?' : 'Delete'}
                </button>
            </div>
        </div>
    )
});

export default EditApps;