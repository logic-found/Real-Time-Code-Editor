import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './../src/pages/HomePage/HomePage'
import EditorPage from './../src/pages/EditorPage/EditorPage'
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <div>
      <Toaster 
      position='top-right'
      toastOptions={{
        success:{
          theme: {
            primary: '#4aed88'
          },
        },
      }}>
      </Toaster>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage/>}/>
          <Route exact path="/editor/:roomId" element={<EditorPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
