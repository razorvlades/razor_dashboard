import React, { useState, useEffect, useRef } from 'react';
import { useStores } from './stores';
import { observer } from 'mobx-react';
import ContentEditable from 'react-contenteditable'

const Settings = observer((props) => {

    const { globalStore } = useStores();
    const appList = globalStore.apps;

    const settingsContainerStyle = {
        alignContent: 'center',
        marginTop: 25,
        marginLeft: 200,
        marginRight: 200,
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

    const nameStyle = {
        flex: 2,
        paddingLeft: 15
    }
    const urlStyle = {
        flex: 5,
        paddingLeft: 15
    }
    const editStyle = {
        flex: 1,
        paddingLeft: 15
    }
    const deleteStyle = {
        flex: 1,
        paddingLeft: 15
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

    return (
        <div style={settingsContainerStyle}>
            <table style={tableStyle}>
                <thead style={tableHeaderContainerStyle}>
                    <tr style={itemStyle}>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>URL</th>
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
        </div>
    )
});

const SettingsAppItem = observer((props) => {

    const {
        app,
        index
    } = props;

    const name = useRef(app.name);
    const url = useRef(app.url);
    const [editing, setEditing] = useState(false);

    const [hover, setHover] = useState(false);

    const _toggleHover = () => setHover(!hover);

    const itemStyle = {
        backgroundColor: hover ? '#F2F3F6' : 'white',
        paddingTop: 10,
        paddingBottom: 10,
        cursor: 'pointer',
        height: 40
    }

    const nameStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }
    const urlStyle = {
        paddingLeft: 15,
        overflow:'wrap',
    }
    const editStyle = {
        overflow:'wrap',
        paddingLeft: 15,
    }
    const deleteStyle = {
        overflow:'wrap',
        paddingLeft: 15,
    }

    const handleChange = evt => {
        name.current = evt.target.value;
    };
    
    const handleBlur = () => {
        console.log(name.current);
    };

    const _handleURLChange = evt => {
        url.current = evt.target.value;
    };
    
    const _handleURLBlur = () => {
        console.log(url.current);
    };

    const _toggleEditing = () => {
        if (editing) {
            saveApps();
        }
        setEditing(!editing);
    }

    const { globalStore } = useStores();

    const saveApps = () => {
        let newApps = [...globalStore.apps];
        newApps[index] = {
            name: name.current,
            url: url.current,
            icon: newApps[index].icon
        }
        globalStore.setApps(newApps);
    }

    return (
        <tr onMouseEnter={_toggleHover} onMouseLeave={_toggleHover} style={itemStyle}>
            <td style={nameStyle}>
                <ContentEditable disabled={!editing} html={name.current} onBlur={handleBlur} onChange={handleChange} />
            </td>
            <td style={urlStyle}>
                <ContentEditable disabled={!editing} html={url.current} onBlur={_handleURLBlur} onChange={_handleURLChange} />
            </td>
            <td style={editStyle}>
                <button onClick={_toggleEditing}>
                    { !editing ? 'Edit' : 'Save'}
                </button>
            </td>
            <td style={deleteStyle}>Delete</td>
        </tr>
    )
});

export default Settings;