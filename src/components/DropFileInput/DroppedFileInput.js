import React,{useRef,useState} from 'react'
import axios from 'axios'
import './drop-file-input.css'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import { imgConfig } from '../../config/imgConfig'
import uploadImg from '../../assets/img/cloud-upload-regular-240.png'


const DroppedFileInput = props => {

    const deleteHandler = {

    }

    const wrapperRef = useRef(null);

    return (
        <>
        <div 
            ref={wrapperRef}
            className="drop-file-input"
            >
            <div className="drop-file-input__label">
                <img src={uploadImg} alt="" />
                <p>Drag & Drop Files Here</p>
            </div>
        </div>
        </>
    )
}

export default DroppedFileInput