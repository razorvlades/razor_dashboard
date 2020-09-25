export const retrieveApiData = (type, app, i) => {
    let data = { data_left: {}, data_right: {} };
    const url = app.api_url === '' ? app.url : app.api_url;
    
    switch (type) {
        case 'tautulli':
            return getTautulliStats(url, app.api_key);
        case 'rutorrent':
            return getRuTorrentStats(url, app.api_username, app.api_password);
        case 'radarr':
            return getRadarrStats(url, app.api_key);
        case 'jellyfin':
            return getJellyfinStats(url, app.api_key);
        case 'netdata':
            return getNetdataStats(url);
        case 'shoko':
            return getShokoStats(url, app.api_username, app.api_password);
        case 'plex':
            return getPlexStats(url, app.api_key, i);
        default:
          return data;
    }
}

const getTautulliStats = async (url, api_key) => {
    const res = await fetch('/api/tautulli?url=' + url + '&api_key=' + api_key);
    const json = await res.json();

    const data_left = {
      title: json[0].section_name,
      content: json[0].count
    };

    const data_right = {
      title: json[1].section_name,
      content: json[1].count
    };

    return { data_left, data_right };
}

const getRuTorrentStats = async (url, username, password) => {
    if (!username || !password) {
        return { data_left: {}, data_right: {} };
    }

    const res = await fetch('/api/rutorrent?url=' + url + '&username=' + username + '&password=' + password);
    const json = await res.json();

    if (json.ok) {
        const data_left = {
            title: "DL Speed",
            content: json.data_left.toFixed(2) + ' MB/s'
        };
      
        const data_right = {
            title: "UL Speed",
            content: json.data_right.toFixed(2) + ' MB/s'
        };

        return { data_left, data_right };
    }
    else {
        return { data_left: {}, data_right: {} };
    }
}
    


    

const getRadarrStats = async (url, api_key) => {
    const res = await fetch('/api/radarr?url=' + url + '&api_key=' + api_key);
    const json = await res.json();
    
    const data_left = {
        title: "Missing",
        content: json.missing_count
    };
  
    const data_right = {
        title: "Queue",
        content: json.queue_length
    };

    return { data_left, data_right };
}

const getJellyfinStats = async (url, api_key) => {
    const res = await fetch('/api/jellyfin?url=' + url + '&api_key=' + api_key);
    const json = await res.json();
    
    const data_left = {
        title: "Series",
        content: json.SeriesCount
    };
  
    const data_right = {
        title: "Movies",
        content: json.MovieCount
    };

    return { data_left, data_right };
}

const getNetdataStats = async (url) => {
    const res = await fetch('/api/netdata?url=' + url);
    const json = await res.json();

    const data_left = {
        title: "Warning",
        content: json.alarms.warning
    };

    const data_right = {
        title: 'Critical',
        content: json.alarms.critical
    }

    return { data_left, data_right };
}

const getShokoStats = async (url, username, password) => {
    if (!username || !password) {
        return { data_left: {}, data_right: {} };
    }

    const res = await fetch('/api/shoko?url=' + url + '&username=' + username + '&password=' + password);

    const json = await res.json();

    const data_left = {
        title: "Series",
        content: json.series_count
    };

    const data_right = {
        title: 'Files',
        content: json.files_count
    };

    return { data_left, data_right };
}

const getPlexStats = async (url, api_key, i) => {
    if (!api_key) {
        return { data_left: {}, data_right: {} };
    }

    const res = await fetch('/api/plex?url=' + url + '&api_key=' + api_key);

    const json = await res.json();
    const libs = json.libraries;

    const index_1 = i % libs.length;
    const index_2 = (i + 1) % libs.length;

    const data_left = {
        title: libs[index_1].title,
        content: libs[index_1].size
    };

    const data_right = {
        title: libs[index_2].title,
        content: libs[index_2].size
    };

    return { data_left, data_right };
}