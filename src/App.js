import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorPage from "./Pages/EditorPage";
import Home from './Pages/Home';
import './App.css'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              theme: {
                primary: 'greenyellow'
              }
            }
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={< Home />}></Route>
          <Route path='/editor/:roomId' element={<EditorPage />}></Route>
        </Routes>

      </BrowserRouter>

    </>
  );
}

export default App;
