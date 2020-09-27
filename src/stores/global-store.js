import { observable, action, decorate } from 'mobx';

export default class GlobalStore {
    title = '';
    setTitle = title => this.title = title;
  
    apps = [];
    setApps = apps => this.apps = apps;
  
    theme = '';
    setTheme = theme => this.theme = theme;

    view = 'grid';
    setView = view => this.view = view;

    refreshInterval = 5000;
    setRefreshInterval = refreshInterval => this.refreshInterval = refreshInterval;

    loggedIn = false;
    setLoggedIn = loggedIn => this.loggedIn = loggedIn;

    appsData = [];
    setAppsData = appsData => this.appsData = appsData;

    headerVisible = true;
    setHeaderVisible = headerVisible => this.headerVisible = headerVisible;

    searchBarVisible = true;
    setSearchBarVisible = searchBarVisible => this.searchBarVisible = searchBarVisible;

    defaultSearchProvider = {};
    setDefaultSearchProvider = defaultSearchProvider => this.defaultSearchProvider = defaultSearchProvider;
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
  loggedIn: observable,
  setLoggedIn: action,
  appsData: observable,
  setAppsData: action,
  headerVisible: observable,
  setHeaderVisible: action,
  refreshInterval: observable,
  setRefreshInterval: action,
  searchBarVisible: observable,
  setSearchBarVisible: action,
  defaultSearchProvider: observable,
  setDefaultSearchProvider: action
});