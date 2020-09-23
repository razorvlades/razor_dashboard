import React, { useState, useEffect } from 'react';
import '../../css/small_card.css';
import { observer } from 'mobx-react';
import { useStores } from '../../util/stores';
import { lightTheme, darkTheme } from '../../util/themes';

const SmallCard = observer((props) => {

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
    const getTautulliStats = async () => {
      const res = await fetch('/api/tautulli?url=' + url);
      const json = await res.json();
      const data_left = {
        title: json[0].section_name,
        content: json[0].count
      }
      const data_right = {
        title: json[1].section_name,
        content: json[1].count
      }
      setDataLeft(data_left);
      setDataRight(data_right);
    }
    
    if (type === 'tautulli') {
      getTautulliStats();
    }
  }, []);

  

  return (
    <a style={{ backgroundColor: customColor ? color : theme.body }} className="smallcard" href={url} target="_blank" >
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