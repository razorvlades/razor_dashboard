import React, { useState, useEffect } from 'react';
import '../../css/small_card.css';
import { observer } from 'mobx-react';
import { useStores } from '../../util/stores';
import { lightTheme, darkTheme } from '../../util/themes';
import { retrieveApiData } from '../../util/enhancedAppsController';

export const SmallCard = observer((props) => {

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
      getApiDataInterval = setInterval(getApiData, 5000);
    }

    return () => {
      clearInterval(getApiDataInterval);
    }
  }, []);

  return (
    <a style={{ backgroundColor: customColor ? color : theme.body }} className="smallcard" href={url} rel="noopener noreferrer" target="_blank" >
      <div style={{ color: customColor ? 'white' : theme.text }} className="smallcard_icon_container">
          <img src={'/icons/' + icon} alt={url}></img>
      </div>
      <div className='smallcard_data_container'>
        <div style={{ alignItems: enhanced ? 'flex-start' : 'center' }} className="smallcard_name_container">
          {name}
        </div>
        { enhanced &&
          <div className='smallcard_api_data'>
            { dataLeft &&
              <div className="smallcard_data_left">
                <div className="smallcard_data_left_title">
                  {dataLeft.title}
                </div>
                <div className="smallcard_data_left_content">
                  {dataLeft.content}
                </div>
              </div>
            }
            { dataRight &&
              <div className="smallcard_data_right">
                <div className="smallcard_data_right_title">
                  {dataRight.title}
                </div>
                <div className="smallcard_data_right_content">
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