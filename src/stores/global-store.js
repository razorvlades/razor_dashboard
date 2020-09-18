import { observable, action, decorate } from 'mobx';

export default class GlobalStore {
    title = '';
    setTitle = title => this.title = title;
  
    apps = [];
    setApps = apps => this.apps = apps;
  
    theme = '';
    setTheme = theme => this.theme = theme;

    view = 'card';
    setView = view => this.view = view;
}

decorate(GlobalStore, {
  title: observable,
  setTitle: action,
  apps: observable,
  setApps: action,
  theme: observable,
  setTheme: action,
  view: observable,
  setView: action,
})