import React from 'react';

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
          <img src={'/icons/' + icon} alt={url}></img>
        </div>
        <div>
          {name}
        </div>
      </a>
    )
}

export default Card;