import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './components/Main/Main';
import CreateEditNote from './components/CreateEditNote/CreateEditNote';
import Header from './components/HeaderFooter/Header';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/main' element={<Main/>} />
        <Route path='/user' element={<CreateEditNote/>} />

        <Route path='*' element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
