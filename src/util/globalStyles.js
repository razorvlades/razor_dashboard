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

    .edit_app_container {
        background-color: ${({ theme }) => theme.body};
    }

    .edit_app_header {
        background-color: ${({ theme }) => theme.hover};
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

    .wrap-login {
        background: ${({ theme }) => theme.body};
    }

    .login-form-btn {
        background: ${({ theme }) => theme.button_hover};
        color: ${({ theme }) => theme.body};
    }

    .login-form-btn::before {
        background-color: ${({ theme }) => theme.button};
        color: ${({ theme }) => theme.body};
    }

    .login-form-btn:hover {
        background: ${({ theme }) => theme.button_hover};
        color: ${({ theme }) => theme.accent};
    }

    .login-form-title {
        color: ${({ theme }) => theme.accent};
    }

    .input {
        color: ${({ theme }) => theme.accent};
    }

    .focus-input::before {
        background: ${({ theme }) => theme.accent};
    }

    .focus-input::after {
        color: ${({ theme }) => theme.accent};
    }

    input::-webkit-input-placeholder { color: ${({ theme }) => theme.accent}; }
    input:-moz-placeholder { color: ${({ theme }) => theme.accent}; }
    input::-moz-placeholder { color: ${({ theme }) => theme.accent}; }
    input:-ms-input-placeholder { color: ${({ theme }) => theme.accent}; }

    textarea::-webkit-input-placeholder { color: ${({ theme }) => theme.accent}; }
    textarea:-moz-placeholder { color: ${({ theme }) => theme.accent}; }
    textarea::-moz-placeholder { color: ${({ theme }) => theme.accent}; }
    textarea:-ms-input-placeholder { color: ${({ theme }) => theme.accent}; }

    .wrap-input {
        border-bottom: 2px solid ${({ theme }) => theme.text_input_underline};;
    }

    .label-checkbox {
        color: ${({ theme }) => theme.accent}
    }
  `