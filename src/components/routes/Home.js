import React from 'react';
import { useStores } from '../../util/stores';
import { observer } from 'mobx-react';
import Cards from '../views/Card';
import SmallCards from '../views/SmallCard';
import CompactCards from '../views/CompactCard';
import { SearchBar } from '../SearchBar';

const Home = observer((props) => {

    const { globalStore } = useStores();
  
    const {
      view
    } = globalStore;
  
    return (
      <>
        { globalStore.searchBarVisible && <SearchBar /> }
        {
          view === 'grid' ? 
            <Cards />
          : view === 'small_grid' ?
            <SmallCards />
          : <CompactCards />
        }
      </>
      )
});

export default Home;