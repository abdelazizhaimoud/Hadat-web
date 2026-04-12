import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className='auth-layout'>
      <main className='auth-shell'>
        <div className='auth-card'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
