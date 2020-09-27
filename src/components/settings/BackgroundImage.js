import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { 
    useHistory,
    useLocation,
    useParams
} from 'react-router-dom';
import '../../css/background_image.css';

export const EditBackgroundImage = observer(props => {

    let params = useParams();
    const history = useHistory();
    const location = useLocation();

    const [file, setFile] = useState(null);

    const _saveBackgroundImage = async () => {
        if (!file)
            return;

        let data = new FormData();

        const imageName = 'background.png'
        data.append("imageName", imageName);
        data.append("imageData", file);

        await fetch('/images/upload-background', {
            method: 'POST',
            body: data
        });
    }

    return (
        <div className='edit_background_container'>
            <Header 
                _saveBackgroundImage={_saveBackgroundImage}
            />
            <Body
                file={file}
                setFile={setFile}
            />
        </div>
    )
});

const Header = props => {

    const {
        _saveBackgroundImage
    } = props;

    const history = useHistory();
    const location = useLocation();

    const _onCancel = () => {
        const { from } = location.state || { from: { pathname: "/settings" } };
        history.replace(from);
    }

    return (
        <div className='edit_background_header container_header'>
            <div className='edit_background_header_title'>
                { 'Background Image' }
            </div>
            <div className='edit_background_header_save_button'>
                <button onClick={_saveBackgroundImage}>
                    {'Save'}
                </button>
            </div>
            <div className='edit_background_cancel_edit_button'>
                <button onClick={_onCancel}>
                    { 'Cancel' }
                </button>
            </div>
        </div>
    )
}

const Body = props => {

    const {
        file,
        setFile
    } = props;

    const _uploadImage = async (e) => {
        setFile(e.target.files[0]);
    }

    return (
        <div className='edit_background_body container_background'>

            <div className='edit_background_body_row_1'>
                <img 
                    className='edit_background_image_preview'
                    src={ file ? URL.createObjectURL(file) : '/background/background.png' }
                />
            </div>

            <div className='edit_background_body_row_2'>
                <div className='edit_background_upload_btn_container'>
                    <label htmlFor="bg_image_upload" className="upload_bg_image_btn">
                        Upload Image
                    </label>
                    <input
                        onChange={_uploadImage}
                        id="bg_image_upload" 
                        style={{ visibility:"hidden", height: 0 }} 
                        type='file' 
                        accept="image/jpeg, image/png"
                    />
                    { file && <div>{file.name}</div> }
                </div>
            </div>
        </div>
    )
}