export const retrieveApiData = (type, url) => {
    let data = { data_left: {}, data_right: {} };

    switch (type) {
        case 'tautulli':
            data = getTautulliStats(url);
            return data;
        case 'rutorrent':
            data = getRuTorrentStats(url);
            return data;
        default:
          return data;
      }
}

const getTautulliStats = async (url) => {
    const res = await fetch('/api/tautulli?url=' + url);
    const json = await res.json();

    const data_left = {
      title: json[0].section_name,
      content: json[0].count
    };

    const data_right = {
      title: json[1].section_name,
      content: json[1].count
    };

    return { data_left, data_right }
}

const getRuTorrentStats = async (url) => {
    const res = await fetch('/api/rutorrent?url=' + url);
    const json = await res.json();
    
    console.log(json);
    
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