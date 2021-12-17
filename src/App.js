import './App.css';
import DropFileInput from './components/DropFileInput/DropFileInput';

function App() {
  const onFileChange = (files)=>{
    console.log(files)
  }
  return (
    <div className="box">
      <h2 className="header">
          Drop files here
      </h2>
      <DropFileInput 
        onFileChange ={(files)=>onFileChange(files)}
      />
    </div>
  );
}

export default App;
