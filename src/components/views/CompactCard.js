import React, { useState, useEffect } from 'react';
import '../../css/compact_card.css';
import { observer } from 'mobx-react';
import { useStores } from '../../util/stores';
import { lightTheme, darkTheme } from '../../util/themes';
import { retrieveApiData } from '../../util/enhancedAppsController';

export const CompactCard = observer((props) => {

  const {
    name,
    icon,
    url,
    color,
    customColor,
    type,
    enhanced,
    id
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

    const getApiConfig = async () => {
      const res = await fetch('/api/auth?id=' + id);
      const json = await res.json();
      return json.api_config;
    }
    getApiConfig().then(apiConfig => {
      let i = 0;
      const getApiData = async () => {
        const {
          data_left,
          data_right
        } = await retrieveApiData(type, props.item, apiConfig, i++);
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
    });
  }, []);

  return (
    <a style={{ backgroundColor: customColor ? color : theme.body }} className="compact_card" href={url} rel="noopener noreferrer" target="_blank" >
      <div style={{ color: customColor ? 'white' : theme.text }} className="compact_card_icon_container">
          <img src={'/icons/' + icon} alt={url}></img>
      </div>
      <div className='compactcard_data_container'>
        <div className="compact_card_name_container">
          <div style={{ display: 'flex', alignItems: !enhanced ? 'center' : 'flex-start', flex: 1 }}>{name}</div>
        </div>

          { enhanced &&
            <div className='compactcard_api_data'>
              { dataLeft &&
                <div className="compactcard_data_left">
                  <div className="compactcard_data_left_title">
                    {dataLeft.title}
                  </div>
                  <div className="compactcard_data_left_content">
                    {dataLeft.content}
                  </div>
                </div>
              }
              { dataRight &&
                <div className="compactcard_data_right">
                  <div className="compactcard_data_right_title">
                    {dataRight.title}
                  </div>
                  <div className="compactcard_data_right_content">
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