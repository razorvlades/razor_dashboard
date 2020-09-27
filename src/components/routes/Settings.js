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
import { Accounts } from '../settings/Accounts';
import { EditUser } from '../settings/EditUser';
import { EditBackgroundImage } from '../settings/BackgroundImage';
import { searchProviders } from '../SearchBar';

const views = [
    {
        name: 'Grid',
        value: 'grid'
    },
    {
        name: 'Small Grid',
        value: 'small_grid'
    },
    {
        name: 'Compact Grid',
        value: 'compact_grid'
    }
];

const themes = [
    {
        name: 'Light',
        value: 'light'
    },
    {
        name: 'Dark',
        value: 'dark'
    }
];

const Settings = (props) => {

    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <SettingsComponent { ...props } />
            </Route>
            <Route path={`${path}/:username`}>
                <EditUser />
            </Route>
        </Switch>
    )
}

const SettingsComponent = observer((props) => {

    const { globalStore } = useStores();
    const history = useHistory();

    const [refreshInterval, setRefreshInterval] = useState(globalStore.refreshInterval);

    const tableHeaderStyle = {
        alignSelf: 'center',
        justifySelf: 'center',
        textAlign: 'left',
        flex: 1,
        paddingLeft: 20,
        fontWeight: 'bold'
    }

    const saveButtonStyle = {
        textAlign: 'right',
        flex: 1,
        paddingRight: 20,
        alignSelf: 'center',
        justifySelf: 'center'
    }

    const tableHeaderContainerStyle = {
        width: '100%'
    }

    const tableStyle = {
        textAlign: "left",
        borderCollapse: "collapse",
        width: "100%"
    }

    const _saveSettings = async () => {
        globalStore.setRefreshInterval(refreshInterval);
        
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
                view: globalStore.view,
                refreshInterval: refreshInterval,
                searchBarVisible: globalStore.searchBarVisible,
                defaultSearchProvider: globalStore.defaultSearchProvider
            })
        });

        history.replace({ pathname: "/" });
    }

    return (
        <>
            <div className='settingsContainer'>
                <div style={tableStyle}>
                    <div style={tableHeaderContainerStyle}>
                        <div className="settingsTableHeader">
                            <div style={tableHeaderStyle}>Settings</div>
                            <div style={saveButtonStyle}>
                                <button onClick={_saveSettings}>Save</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <DefaultViewSettingsItem />
                        <TitleTextSettingsItem />
                        <ThemeSettingsItem />
                        <RefreshIntervalSettingsItem refreshInterval={refreshInterval} setRefreshInterval={setRefreshInterval} />
                        <BackgroundImageSettingsItem />
                        <SearchBarVisibleSettingsItem />
                        <SearchProviderSettingsItem />
                    </div>
                </div>
            </div>

            <Accounts/>
        </>
    )
});

const DefaultViewSettingsItem = observer(() => {

    const { globalStore } = useStores();

    const _chooseView = async (e) => {
        globalStore.setView(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Default View</div>
            </div>
            <div className='settings_item_input_container'>
                <select
                    value={globalStore.view} 
                    onChange={_chooseView}
                    className='settings_item_select'
                >
                    {
                        views.map((item) => {
                            return (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
});

const TitleTextSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const _changeTitle = async (e) => {
        globalStore.setTitle(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Title</div>
            </div>
            <div className='settings_item_input_container'>
                <input style={{ width: '69%'}} className='textInput' onChange={_changeTitle} value={globalStore.title} type="text"/>
            </div>
        </div>
    )
});

const ThemeSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const _chooseTheme = async (e) => {
        globalStore.setTheme(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>App Theme</div>
            </div>
            <div className='settings_item_input_container'>
                <select
                    value={globalStore.theme} 
                    onChange={_chooseTheme}
                    className='settings_item_select'
                >
                    {
                        themes.map((item, index) => {
                            return (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
});

const RefreshIntervalSettingsItem = (props) => {

   const {
       refreshInterval,
       setRefreshInterval
   } = props;

    const _changeRefreshInterval = async (e) => {
        setRefreshInterval(e.target.value);
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>API Refresh Interval (ms)</div>
            </div>
            <div className='settings_item_input_container'>
                <input style={{ width: '69%'}} className='textInput' onChange={_changeRefreshInterval} value={refreshInterval} type="text"/>
            </div>
        </div>
    )
}

const BackgroundImageSettingsItem = (props) => {
 
    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Background Image</div>
            </div>
            <div className='settings_item_input_container'>
                <Link className='edit_background_link' to={`/edit_background`}>Edit Background</Link>
            </div>
        </div>
    )
}

const SearchProviderSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const _updateSearchProvider = async (e) => {
        globalStore.setDefaultSearchProvider(searchProviders.find(item => item.name === e.target.value));
    }

    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Default Search Provider</div>
            </div>
            <div className='settings_item_input_container'>
                <select
                    value={globalStore.defaultSearchProvider.name} 
                    onChange={_updateSearchProvider}
                    className='settings_item_select'
                >
                    {
                        searchProviders.map((item) => {
                            return (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
});

const enabled_enum = [
    {
        text: 'Enabled',
        value: true
    },
    {
        text: 'Disabled',
        value: false
    }
]

const SearchBarVisibleSettingsItem = observer((props) => {

    const { globalStore } = useStores();

    const _updateSearchBarVisible = e => {
        console.log(enabled_enum.find(item => String(item.value) === e.target.value).value);
        globalStore.setSearchBarVisible(enabled_enum.find(item => String(item.value) === e.target.value).value);
    }
    
    React.useEffect(() => {
        console.log(globalStore.searchBarVisible);
    }, []);
 
    return (
        <div className="settingsItem">
            <div className="settings_item_title_container">
                <div className='settingsOptionTitle'>Search Bar</div>
            </div>
            <div className='settings_item_input_container'>
                <select
                    value={globalStore.searchBarVisible} 
                    onChange={_updateSearchBarVisible}
                    className='settings_item_select'
                >
                    {
                        enabled_enum.map((item) => {
                            return (
                                <option key={item.text} value={item.value}>{item.text}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
});

export default Settings;