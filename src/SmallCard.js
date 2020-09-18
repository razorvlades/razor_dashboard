import React from 'react';
import './small_card.css';

const SmallCard = (props) => {
    const {
      name,
      icon,
      url,
      color
    } = props.item;
  
    return (
      <a style={{ backgroundColor: color }} className="smallcard" href={url} target="_blank" >
        <div className="smallcard_icon_container">
            <img src={'/icons/' + icon} alt={url}></img>
        </div>
        <div className="smallcard_name_container">
          {name}
        </div>
      </a>
    )
}

export default SmallCard;