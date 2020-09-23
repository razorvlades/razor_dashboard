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

const App = observer(() => {

  const { globalStore } = useStores();

  const [configLoading, setConfigLoading] = useState(true);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {

    fetch('/getConfig').then(async (res) => {
      const config = await res.json();
      globalStore.setApps(config.apps);
      globalStore.setTitle(config.title);
      globalStore.setTheme(config.theme);
      globalStore.setView(config.view);
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
            { globalStore.loggedIn &&
              <div className="header">
                  <Header />
              </div>
            }

            <Switch>
              <PrivateRoute loggedIn={globalStore.loggedIn} exact path="/">
                <Home/>
              </PrivateRoute>
              <PrivateRoute loggedIn={globalStore.loggedIn} path="/appsettings">
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
