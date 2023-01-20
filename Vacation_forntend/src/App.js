import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import EventCalendar from "./components/EventCalendar";
import Login from "./components/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/calendar' element={<EventCalendar/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
