import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './components/Test'
import Login from './components/auth/Login'
import Home from './components/home/Home'
import './App.css'
import SignUp from './components/auth/SignUp'
import CreateActivity from './components/activity/CreateActivity'
import Dashboard from './components/dashboard/Dashboard'
import Logout from './components/Logout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Test />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/create-activity' element={<CreateActivity />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
