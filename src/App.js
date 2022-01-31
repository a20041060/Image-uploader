import './App.css';
import DropFileUpload from './components/DropFileInput/DropFileUpload'



function App() {
  const onFileChange = (files)=>{
    console.log(files)
  }
  return (
    <div className='container'>
      <div className="box">
        <h2 className="header">
          Drag & Drop Files Here
        </h2>
        <DropFileUpload
          onFileChange ={(files)=>onFileChange(files)}
        />
      </div>

    </div>
  );
}

export default App;
