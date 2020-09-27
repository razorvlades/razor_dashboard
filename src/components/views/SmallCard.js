import React, { useState, useEffect } from 'react';
import '../../css/small_card.css';
import { observer } from 'mobx-react';
import { useStores } from '../../util/stores';
import { lightTheme, darkTheme } from '../../util/themes';
import { retrieveApiData } from '../../util/enhancedAppsController';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

export const SmallCard = observer((props) => {

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
    <a style={{ cursor: props.isDragging ? 'move' : 'pointer', backgroundColor: customColor ? color : theme.body }} className={ props.isDragging ? "smallcard_dragging" : "smallcard"} href={url} rel="noopener noreferrer" target="_blank" >
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

const SortableItem = SortableElement(({ item, isDragging }) => <SmallCard item={item} isDragging={isDragging}/>);

const SortableList = SortableContainer(({ items, isDragging }) => {
  return (
    <div style={{ cursor: isDragging ? 'move' : 'default' }} className="card_container">
      {
        items.map((app, index) => (
          <SortableItem isDragging={isDragging} key={app.id} index={index} item={app}/>
        ))
      }
    </div>
  );
});

const SmallCards = observer((props) => {
  const { globalStore } = useStores();

  const {
    apps: appList,
  } = globalStore;

  const [isDragging, setIsDragging] = useState(false);

  const saveApps = async (newApps) => {

    await fetch('/updateConfig', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apps: newApps,
            theme: globalStore.theme,
            title: globalStore.title,
            view: globalStore.view,
            refreshInterval: globalStore.refreshInterval,
            searchBarVisible: globalStore.searchBarVisible,
            defaultSearchProvider: globalStore.defaultSearchProvider
        })
    });
  }

  const onSortStart = () => {
    setIsDragging(true);
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setIsDragging(false);
    const newApps = arrayMove(appList, oldIndex, newIndex);
    globalStore.setApps(newApps);
    saveApps(newApps);
  };

  return (
      <SortableList
        items={appList}
        onSortStart={onSortStart}
        onSortEnd={onSortEnd}
        axis='xy'
        isDragging={isDragging}
        useWindowAsScrollContainer={true}
        pressDelay={200}
      />
  )
});

export default SmallCards;