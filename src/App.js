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
            <a href='./about.html' className="menu_button">
                {'About Me'}
            </a>
            <Link className="menu_button" to="/settings">Settings</Link>
        </div>
    </div>
    );
});

const Home = observer(() => {

  const { globalStore } = useStores();

  const appList = globalStore.apps;

  return (
    <div className="card_container">
      {
        appList.map((app, index) => (
          <Card key={app.url + index} item={app}/>
        ))
      }
    </div>
  )
})

const Card = (props) => {

  const {
    name,
    icon,
    url,
    color
  } = props.item;

  const imageStyle = {
    marginBottom: 25,
  }

  return (
    <a style={{ backgroundColor: color }} className="card" href={url} target="_blank" >
      <div style={imageStyle}>
        <img src={require(`${icon}`)} alt={url}></img>
      </div>
      <div>
        {name}
      </div>
    </a>
  )
}

export default App;
