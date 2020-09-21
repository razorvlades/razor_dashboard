import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import AppSettings from './EditApps';
import Settings from './Settings';
import './index.css';
import Card from './Card';
import SmallCard from './SmallCard';
import Login from './Login';
import Signup from './Signup';

global.iconPath = __dirname + 'src/assets/icons/';

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

    fetch('/getIcons').then(async (res) => {
      const icons = await res.json();
      globalStore.setIcons(icons.icons);
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
    !configLoading && !checkingLogin && 
    <Router>
      <div className="page">
        <div className="header">
            <Header />
        </div>

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
  );
})

const Header = observer(() => {

  const { globalStore } = useStores();

  const _onLogout = async () => {
    globalStore.setLoggedIn(false);
    const res = await fetch('/logout');
    const json = await res.json();
  }

  return (
    <div className="hd">
        {globalStore.title}
        <div className="menu">
            <Link className="menu_button" to="/">Home</Link>
            <Link className="menu_button" to="/appsettings">Edit Apps</Link>
            <Link className="menu_button" to="/settings">Settings</Link>
            <a className="menu_button" onClick={_onLogout} >{'Logout'}</a>
        </div>
    </div>
    );
});

const Home = observer((props) => {

  const { globalStore } = useStores();

  const {
    apps: appList,
    view
  } = globalStore;

  return (
    <div className="card_container">
      {
        appList.map((app, index) => (
          view === 'grid' ? 
            <Card key={app.url + index} item={app}/>
          :
            <SmallCard key={app.url + index} item={app}/>
        ))
      }
    </div>
  )
});

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
