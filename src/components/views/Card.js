import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../../util/stores';
import { lightTheme, darkTheme } from '../../util/themes';
import { retrieveApiData } from '../../util/enhancedAppsController';
import '../../css/card.css';

const Card = observer((props) => {
    const {
      name,
      icon,
      url,
      color,
      customColor,
      type,
      enhanced
    } = props.item;

    const { globalStore } = useStores();
    const [theme, setTheme] = useState(globalStore.theme);
    const [dataLeft, setDataLeft] = useState();
    const [dataRight, setDataRight] = useState();
  
    useEffect(() => {
      const theme = globalStore.theme === 'light' ? lightTheme :
                    globalStore.theme === 'dark' ? darkTheme :
                    lightTheme;
      setTheme(theme);
    }, [globalStore.theme]);

    useEffect(() => {
      let i = 0;
      const getApiData = async () => {
        const {
          data_left,
          data_right
        } = await retrieveApiData(type, props.item, i++);
        setDataLeft(data_left);
        setDataRight(data_right);
      }
  
      let getApiDataInterval;
      if (enhanced) {
        getApiData();
        getApiDataInterval = setInterval(getApiData, globalStore.refreshInterval);
      }
  
      return () => {
        clearInterval(getApiDataInterval);
      }
    }, []);
  
    return (
      <a style={{ backgroundColor: customColor ? color : theme.body }} className="card" href={url} rel="noopener noreferrer" target="_blank" >
          <div style={{ fontWeight: 'bold', textAlign: 'left', color: customColor ? 'white' : theme.text }}>
            {name}
          </div>
        <div style={{ color: customColor ? 'white' : theme.text }} className="card_icon_container">
          <img src={'/icons/' + icon} alt={url}></img>
        </div>
        <div className='card_data_container'>
          { enhanced &&
            <div className='card_api_data'>
              { dataLeft &&
                <div className="card_data_left">
                  <div className="card_data_left_title">
                    {dataLeft.title}
                  </div>
                  <div className="card_data_left_content">
                    {dataLeft.content}
                  </div>
                </div>
              }
              { dataRight &&
                <div className="card_data_right">
                  <div className="card_data_right_title">
                    {dataRight.title}
                  </div>
                  <div className="card_data_right_content">
                    {dataRight.content}
                  </div>
                </div>
              }
            </div>
          }
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