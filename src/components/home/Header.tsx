import { Link } from 'react-router-dom'

function Header() {
  return (
    <div>
      <Link to="/home">Home</Link>
      <Link to="/create-activity">Create Activity</Link>
      <Link to="/dashboard">My Dashboard</Link>
      <Link to="/profile">Profile</Link>
    </div>
  )
}

export default Header
