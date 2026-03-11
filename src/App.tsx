import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './components/Test'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Test />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
