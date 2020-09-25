import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './util/stores';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./util/globalStyles";
import { lightTheme, darkTheme } from "./util/themes";
import './css/login.css';
import './css/index.css';
import './css/settings.css';
import Login from './components/routes/Login';
import Signup from './components/routes/Signup';
import Header from './components/Header';
import Home from './components/routes/Home';
import AppSettings from './components/routes/EditApps';
import Settings from './components/routes/Settings';
import { v4 as uuidv4 } from 'uuid';

const App = observer(() => {

  const { globalStore } = useStores();

  const [configLoading, setConfigLoading] = useState(true);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    fetch('/getConfig').then(async (res) => {
      const config = await res.json();
      if (config.apps)
        globalStore.setApps(config.apps);
      if (config.title)
        globalStore.setTitle(config.title);
      if (config.theme)
        globalStore.setTheme(config.theme);
      if (config.view)
        globalStore.setView(config.view);
      if (config.refreshInterval)
        globalStore.setRefreshInterval(config.refreshInterval);

      const apps = config.apps;
      
      const new_apps = [];
      for (let i = 0; i < apps.length; i++) {
        if (!apps[i].id) {
          const id = uuidv4();
          const new_app = {
            ...apps[i],
            id,
            api_url: apps[i].api_url ? apps[i].api_url : ''
          }
          new_apps.push(new_app);
        }
        else {
          new_apps.push({
            ...apps[i],
            api_url: apps[i].api_url ? apps[i].api_url : ''
          });
        }
      }
      globalStore.setApps(new_apps);
      
      setConfigLoading(false);
    });

    fetch('/getApps').then(async (res) => {
      const appsData = await res.json();
      globalStore.setAppsData(appsData.apps);
    });

    fetch('/user/').then(async (res) => {
      const json = await res.json();
      if (json.user) {
        globalStore.setLoggedIn(true);
      }
      setCheckingLogin(false);
    });

  }, []);

  return (
    <ThemeProvider theme={globalStore.theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles/>
      {
        !configLoading && !checkingLogin && 
        <Router>
          <div className="page">
            { globalStore.loggedIn && globalStore.headerVisible &&
              <div className="header">
                  <Header />
              </div>
            }

            <Switch>
              <PrivateRoute loggedIn={globalStore.loggedIn} exact path="/">
                <Home/>
              </PrivateRoute>
              <PrivateRoute loggedIn={globalStore.loggedIn} path="/editapps">
                <AppSettings/>
              </PrivateRoute>
              <PrivateRoute loggedIn={globalStore.loggedIn} path="/settings">
                <Settings/>
              </PrivateRoute>
              <Route path="/login">
                <Login/>
              </Route>
              <Route path="/register">
                <Signup/>
              </Route>
            </Switch>

          </div>
        </Router>
      }
    </ThemeProvider>
  );
})

const PrivateRoute = ({ loggedIn, children, ...rest }) => {

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
