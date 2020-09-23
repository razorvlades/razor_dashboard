import { createGlobalStyle} from "styled-components"
export const GlobalStyles = createGlobalStyle`
    body {
        ${'' /* background: ${({ theme }) => theme.body}; */}
        color: ${({ theme }) => theme.text};
        font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    }

    div {
        color: ${({ theme }) => theme.text};
        font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    }
    
    .globalTitle {
        color: ${({ theme }) => theme.titleText};
    }

    .menu_button {
        font: 14px "Century Gothic", Futura, sans-serif;
        padding: 20px;
        border: none;
        background: none;
        color: ${({ theme }) => theme.titleText};
        text-align: center;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        text-decoration: none;
    }

    .menu_button:hover {
        color: ${({ theme }) => theme.dark ? "white" : "black"};
        cursor: pointer;
    }

    .settingsItem {
        padding-top: 10px;
        padding-bottom: 10px;
        height: 60px;
        background-color: ${({ theme }) => theme.body};
    }

    .settingsItem:hover {
        background-color: ${({ theme }) => theme.hover};
    }

    .settingsTableHeader {
        padding-top: 10px;
        padding-bottom: 10px;
        height: 40px;
        background-color: ${({ theme }) => theme.hover};
    }

    .addAppStyle {
        background-color: ${({ theme }) => theme.body};
    }
    
    .addAppStyle:hover {
        background-color: ${({ theme }) => theme.hover};
    }
  `