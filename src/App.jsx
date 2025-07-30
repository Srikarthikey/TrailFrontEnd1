import { useState } from 'react'
import './index.css'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Movie from '../Pages/Movie'
import Register from '../Pages/Register'
import Login from '../Pages/Login'





function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/movie' element={<Movie/>}/>
      <Route path='/register' element={<Register/>}/>
     
    </Routes>
    </BrowserRouter>
 
    </>
  )
}

export default App
