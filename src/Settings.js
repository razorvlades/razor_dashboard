import React, { useState } from 'react';
import './settings.css';

const Settings = (props) => {

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

    return (
        <div style={settingsContainerStyle}>
            <table style={tableStyle}>
                <thead style={tableHeaderContainerStyle}>
                    <tr style={itemStyle}>
                        <th style={tableHeaderStyle}>Settings</th>
                    </tr>
                </thead>

                <tbody>
                    <DefaultViewSettingsItem></DefaultViewSettingsItem>
                </tbody>
            </table>
        </div>
    )
}

const DefaultViewSettingsItem = props => {

    // const itemStyle = {
    //     backgroundColor: hover ? '#F2F3F6' : 'white',
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     //cursor: 'pointer',
    //     height: 60
    // }

    // const columnStyle = {
    //     paddingLeft: 15,
    //     overflow:'wrap',
    // }

    return null

    // return (
    //     <tr onMouseEnter={_setHoverOn} onMouseLeave={_setHoverOff} style={itemStyle}>
    //         <td style={columnStyle}>
    //             <input className='textInput' onChange={_changeName} value={name} type="text"/>
    //         </td>
    //         <td style={columnStyle}>
    //             <input className='textInput' onChange={_changeUrl} value={url} type="text"/>
    //         </td>
    //         <td style={columnStyle}>
    //             <input className='colorPicker' onChange={_chooseColor} value={selectedColor} id="bgcolor" type="color"/>
    //         </td>
    //     </tr>
    // )
}

export default Settings;