import React  from "react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import  Login from './pages/Login.jsx'
import  Signup from './pages/Signup.jsx'

import  Home  from './pages/Home.jsx'


function App() {
  return (
    <>
     <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />

          

          
        </Routes>
      </Router>
    </>
  )
}

export default App
