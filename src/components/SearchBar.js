import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../util/stores';
import '../css/searchbar.css';

export const searchProviders = [
    {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
    },
    {
        name: 'Bing',
        url: 'https://www.bing.com/search?q='
    }
];

export const SearchBar = observer(props => {

    const { globalStore } = useStores();
    
    const [searchText, setSearchText] = useState('');
    const [searchProvider, setSearchProvider] = useState(globalStore.defaultSearchProvider.url);

    const _updateSearchText = e => {
        setSearchText(e.target.value);
    }

    const _updateSearchProvider = e => {
        setSearchProvider(e.target.value);
    }

    const _onSubmit = e => {
        if (searchText.trim().startsWith('http://') || searchText.trim().startsWith('https://')) {
            window.open(searchText, "_blank"); 
        }
        window.open(searchProvider + searchText, "_blank"); 
    }

    return (
        <div className='search_bar_div'>
            <form
                onSubmit={_onSubmit}
                className='search_bar_container'
            >
                <select
                        value={searchProvider} 
                        onChange={_updateSearchProvider}
                    >
                        {
                            searchProviders.map((item) => {
                                return (
                                    <option key={item.name} value={item.url}>{item.name}</option>
                                )
                            })
                        }
                </select>
                <input
                    type="search"
                    value={searchText}
                    autoFocus='autofocus'
                    onChange={_updateSearchText}
                    placeholder='Search...'
                />
                <button>
                    Search
                </button>
            </form>
        </div>
    )
});