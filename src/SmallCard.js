import React, { useState, useEffect } from 'react';
import './small_card.css';
import { observer } from 'mobx-react';
import { useStores } from './stores';
import { lightTheme, darkTheme } from './themes';

const SmallCard = observer((props) => {

  const {
    name,
    icon,
    url,
    color,
    customColor
  } = props.item;

  const { globalStore } = useStores();
  const [theme, setTheme] = useState(globalStore.theme);

  useEffect(() => {
    const theme = globalStore.theme === 'light' ? lightTheme :
                  globalStore.theme === 'dark' ? darkTheme :
                  lightTheme;
    setTheme(theme);
  }, [globalStore.theme]);

  return (
    <a style={{ backgroundColor: customColor ? color : theme.body }} className="smallcard" href={url} target="_blank" >
      <div style={{ color: customColor ? 'white' : theme.text }} className="smallcard_icon_container">
          <img src={'/icons/' + icon} alt={url}></img>
      </div>
      <div className="smallcard_name_container">
        {name}
      </div>
    </a>
  )
});


const SmallCards = observer((props) => {
  const { globalStore } = useStores();

  const {
    apps: appList,
  } = globalStore;

  return (
    <div className="card_container">
      {
        appList.map((app, index) => (
         <SmallCard key={app.url + index} item={app}/>
        ))
      }
    </div>
  )
});

export default SmallCards;