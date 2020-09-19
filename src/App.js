import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Settings from './Settings';
import './index.css';
import Card from './Card';
import SmallCard from './SmallCard';

global.iconPath = __dirname + 'src/assets/icons/';

const App = observer(() => {

  const { globalStore } = useStores();

  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {

  fetch('/getConfig').then(async (res) => {
    const config = await res.json();
    globalStore.setApps(config.apps);
    globalStore.setTitle(config.title);
    globalStore.setTheme(config.theme);
    setConfigLoading(false);
  });

  fetch('/getIcons').then(async (res) => {
    const icons = await res.json();
    globalStore.setIcons(icons.icons);
  });

  }, []);

  return (
    !configLoading && 
    <Router>
      <div className="page">
        <div className="header">
            <Header />
        </div>

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/settings" component={Settings}/>
        </Switch>

      </div>
    </Router>
  );
})

const Header = observer(() => {

  const { globalStore } = useStores();
  
  const _toggleView = () => {
    if (globalStore.view === 'card') {
      globalStore.setView('smallcard');
    }
    else {
      globalStore.setView('card');
    }
  }

  return (
    <div className="hd">
        {globalStore.title}
        <div className="menu">
            <Link className="menu_button" to="/">Home</Link>
            <a href='https://myanimelist.net/animelist/razorvlades' className="menu_button">
                {'Anime'}
            </a>
            <a href='https://gitlab.com/razorvlades' className="menu_button">
                {'Programming'}
            </a>
            <a onClick={_toggleView} style={{ cursor: 'pointer' }} className="menu_button">{'Change View'}</a>
            <Link className="menu_button" to="/settings">Settings</Link>
        </div>
    </div>
    );
});

const Home = observer((props) => {

  const { globalStore } = useStores();
  const appList = globalStore.apps;
  const view = globalStore.view;

  return (
    <div className="card_container">
      {
        appList.map((app, index) => (
          view === 'card' ? 
            <Card key={app.url + index} item={app}/>
          :
            <SmallCard key={app.url + index} item={app}/>
        ))
      }
    </div>
  )
})

export default App;
