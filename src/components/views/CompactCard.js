import React, { useState, useEffect } from 'react';
import '../../css/compact_card.css';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';
import { lightTheme, darkTheme } from '../../themes';

const CompactCard = observer((props) => {

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
    <a style={{ backgroundColor: customColor ? color : theme.body }} className="compact_card" href={url} target="_blank" >
      <div style={{ color: customColor ? 'white' : theme.text }} className="compact_card_icon_container">
          <img src={'/icons/' + icon} alt={url}></img>
      </div>
      <div className="compact_card_name_container">
        {name}
      </div>
    </a>
  )
});

const CompactCards = observer((props) => {
  const { globalStore } = useStores();

  const {
    apps: appList,
  } = globalStore;

  return (
    <div className="compact_card_container">
      {
        appList.map((app, index) => (
         <CompactCard key={app.url + index} item={app}/>
        ))
      }
    </div>
  )
});

export default CompactCards;