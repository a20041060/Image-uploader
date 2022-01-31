import React,{useRef,useState} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './drop-file-upload.css'
import { imgConfig } from '../../config/imgConfig'
import uploadImg from '../../assets/img/cloud-upload-regular-240.png'


const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);

    // const [selectedFile, setSelectedFile] = useState([]);
 
    const onDragEnter = ()=>wrapperRef.current.classList.add('dragover');

    const onDragLeave = ()=>wrapperRef.current.classList.remove('dragover');

    const onDrop = ()=>wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) =>{
        const newFile = e.target.files[0];
        if(newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList)
            // setSelectedFile(newFile)
            props.onFileChange(updatedList);
        try{
            const data = new FormData();
            data.append("file",newFile);
            const config = {
                headers: { 'content-type': 'multipart/form-data','Access-Control-Allow-Origin': '*'}
               }
            axios.post('http://localhost:5000/upload/',data ,config)
            .then(res=>{
                console.log("Image Upload Suceeded")
            })
            }
            catch(err){
                console.log(err)
            }
        }
    }


    const fileRemove = (file)=>{
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file),1)
        setFileList(updatedList);
        // setSelectedFile(file);
        props.onFileChange(updatedList);
        }

    return (
        <>
        <div 
            ref={wrapperRef} 
            className="drop-file-input"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            >
            <div className="drop-file-input__label">
                <img src={uploadImg} alt="" />
                <p>Drag & Drop Files Here</p>
            </div>
            <input type="file" value="" onChange={onFileDrop} />
        </div>
        {
            fileList.length> 0 ? (<div className='drop-file-preview'>
                <div className='drop-file-preview'>
                    <p className='drop-file-preview__title'>
                        Files Uploaded Below
                    </p>
                    {fileList.map((item,index)=>(
                        <div key={index} className='drop-file-preview__item'>
                            <img src={imgConfig[item.type.split('/')[1]] || imgConfig['default']} alt='' />
                            <div className='drop-file-preview__item__info'>
                                <p>{item.name}</p>
                                <p>{item.size}B</p>
                            </div>
                            <span className='drop-file-preview__item__del' onClick={()=>fileRemove(item)}>x</span>
                           
                        </div>
                        
                    ))}
                     
                </div>
            </div>) :null
        }
        </>
    )
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput
