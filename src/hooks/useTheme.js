import React, { useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../themes';

const useTheme = (store) => {

    const [themeName, setThemeName] = useState(store.theme);

    useEffect(() => {
        setThemeName(store.theme);
    }, []);

    const theme = themeName === 'light' ? lightTheme :
                  themeName === 'dark' ? darkTheme :
                  lightTheme;

    return theme;
}

export default useTheme;