import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './components/Test'
import Login from './components/auth/Login'
import Home from './components/home/Home'
import './App.css'
import SignUp from './components/auth/SignUp'
import CreateActivity from './components/activity/CreateActivity'
import ActivityDetails from './components/activity/ActivityDetails'
import Dashboard from './components/dashboard/Dashboard'
import Logout from './components/auth/Logout'
import Profile from './components/profile/Profile'
import EditActivity from './components/activity/EditActivity'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Map from './components/map/Map'
import AuthLayout from './layouts/AuthLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Test />}></Route>
        <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
        </Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/create-activity' element={<CreateActivity />}></Route>
          <Route path='/activity/:id' element={<ActivityDetails />}></Route>
          <Route path='/activity/:id/edit' element={<EditActivity />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/map' element={<Map />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
