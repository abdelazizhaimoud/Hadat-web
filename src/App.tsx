import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './components/Test'
import Login from './components/auth/Login'
import Home from './components/Home'
import './App.css'
import SignUp from './components/auth/SignUp'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Test />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/home' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
