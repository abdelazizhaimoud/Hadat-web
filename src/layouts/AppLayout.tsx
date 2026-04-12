import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className='app-layout'>
      <header className='app-header'>
        <div className='app-header__inner'>
          <NavLink className='app-brand' to='/home'>
            Hadat
          </NavLink>
          <nav className='app-nav'>
            <NavLink
              to='/home'
              end
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to='/create-activity'
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              Create Activity
            </NavLink>
            <NavLink
              to='/dashboard'
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to='/profile'
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to='/logout'
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              Logout
            </NavLink>
          </nav>
        </div>
      </header>

      <main className='app-main'>
        <div className='app-container'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
