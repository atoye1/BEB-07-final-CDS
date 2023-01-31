// module
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

// components
import Header from './components/Header';
import AcceptedCardType2 from './components/AcceptedCardType2';

// pages
import Main from './pages/Main';
import Create from './pages/Create';
import Accept from './pages/Accept';
import Detail from './pages/Detail';
import Mypage from './pages/Mypage';
import MakeTest from './pages/MakeTest';
import AcceptTest from './pages/AcceptTest';
import OracleTest from './pages/OracleTest';

// css
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<Create />} />
        <Route path="/accept/:swapId" element={<Accept />} />
        <Route path="/detail/:swapId" element={<Detail />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/createTest" element={<MakeTest />} />
        <Route path="/acceptTest/:swapId" element={<AcceptTest />} />
        <Route path="/oracleTest" element={<OracleTest />} />
      </Routes>
    </div>
  );
}

export default App;
