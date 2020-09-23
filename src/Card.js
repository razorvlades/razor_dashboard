import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores';
import { lightTheme, darkTheme } from './themes';

const Card = observer((props) => {
    const {
      name,
      icon,
      url,
      color,
      customColor
    } = props.item;
  
    const imageStyle = {
      marginBottom: 25,
    }

    const { globalStore } = useStores();
    const [theme, setTheme] = useState(globalStore.theme);
  
    useEffect(() => {
      const theme = globalStore.theme === 'light' ? lightTheme :
                    globalStore.theme === 'dark' ? darkTheme :
                    lightTheme;
      setTheme(theme);
    }, [globalStore.theme]);
  
    return (
      <a style={{ backgroundColor: customColor ? color : theme.body }} className="card" href={url} target="_blank" >
        <div style={imageStyle}>
          <img src={'/icons/' + icon} alt={url}></img>
        </div>
        <div style={{ color: customColor ? 'white' : theme.text }}>
          {name}
        </div>
      </a>
    )
});

const Cards = observer((props) => {
  const { globalStore } = useStores();

  const {
    apps: appList,
  } = globalStore;

  return (
    <div className="card_container">
      {
        appList.map((app, index) => (
         <Card key={app.url + index} item={app}/>
        ))
      }
    </div>
  )
});

export default Cards;