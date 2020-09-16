import { observable, action, decorate } from 'mobx';
import config from '../config/config.json';

export default class GlobalStore {
    title = config.title;
    setTitle = title => this.title = title;
  
    apps = config.apps;
    setApps = apps => this.apps = apps;
  
    theme = config.theme;
    setTheme = theme => this.theme = theme;
}

decorate(GlobalStore, {
  title: observable,
  setTitle: action,
  apps: observable,
  setApps: action,
  theme: observable,
  setTheme: action
})