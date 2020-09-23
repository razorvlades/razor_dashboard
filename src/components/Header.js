import React from 'react';
import { useStores } from '../util/stores';
import { observer } from 'mobx-react';
import { Link } from "react-router-dom";

const Header = observer(() => {

    const { globalStore } = useStores();
  
    const _onLogout = async () => {
      globalStore.setLoggedIn(false);
      await fetch('/logout');
    }
  
    return (
      <div className='globalTitle'>
          {globalStore.title}
          <div className="menu">
              <Link className="menu_button" to="/">Home</Link>
              <Link className="menu_button" to="/appsettings">Edit Apps</Link>
              <Link className="menu_button" to="/settings">Settings</Link>
              <a className="menu_button" onClick={_onLogout} >{'Logout'}</a>
          </div>
      </div>
      );
});

export default Header;