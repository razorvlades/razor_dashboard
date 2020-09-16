import React, { useState, useEffect } from 'react';
import { useStores } from './stores';
import { observer } from 'mobx-react';

const Settings = observer((props) => {

    const { globalStore } = useStores();
    const appList = globalStore.apps;

    const settingsContainerStyle = {
        alignContent: 'center',
        marginTop: 25,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
    }

    const itemStyle = {
        flexDirection: 'row',
        display: 'flex',
        backgroundColor: 'gray',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        paddingTop: 10,
    }

    const nameStyle = {
        flex: 2,
        backgroundColor: 'blue',
        paddingLeft: 15
    }
    const urlStyle = {
        flex: 5,
        backgroundColor: 'green',
        paddingLeft: 15
    }
    const editStyle = {
        flex: 1,
        backgroundColor: 'red',
        paddingLeft: 15
    }
    const deleteStyle = {
        flex: 1,
        backgroundColor: 'orange',
        paddingLeft: 15
    }

    return (
      <div style={settingsContainerStyle}>
            <div style={itemStyle}>
                <div style={nameStyle}>
                    Name
                </div>
                <div style={urlStyle}>
                    URL
                </div>
                <div style={editStyle}>
                    Edit
                </div>
                <div style={deleteStyle}>
                    Delete
                </div>
          </div>
        { 
            appList.map((app, index) => (
                <SettingsAppItem key={app.name + index} app={app}/>
            ))
        }
      </div>
    )
});

const SettingsAppItem = (props) => {

    const {
        app
    } = props;

    const itemStyle = {
        flexDirection: 'row',
        display: 'flex',
        backgroundColor: 'pink',
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10
    }

    const nameStyle = {
        flex: 2,
        backgroundColor: 'blue',
        paddingLeft: 15
    }
    const urlStyle = {
        flex: 5,
        backgroundColor: 'green',
        paddingLeft: 15
    }
    const editStyle = {
        flex: 1,
        backgroundColor: 'red',
        paddingLeft: 15
    }
    const deleteStyle = {
        flex: 1,
        backgroundColor: 'orange',
        paddingLeft: 15
    }

    return (
        <div style={itemStyle}>
            <div style={nameStyle}>
                {app.name}
            </div>
            <div style={urlStyle}>
                {app.url}
            </div>
            <div style={editStyle}>
                    Edit
            </div>
            <div style={deleteStyle}>
                Delete
            </div>
        </div>
    )
}

export default Settings;