export const retrieveApiData = (type, app) => {
    let data = { data_left: {}, data_right: {} };

    switch (type) {
        case 'tautulli':
            return getTautulliStats(app.url, app.api_key);
        case 'rutorrent':
            return getRuTorrentStats(app.url, app.api_username, app.api_password);
        case 'radarr':
            return getRadarrStats(app.url, app.api_key);
        case 'jellyfin':
            return getJellyfinStats(app.url, app.api_key);
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