import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import axiosInstance from '../utils/axiosClient'

function AppLayout() {
  const location = useLocation()
  const navRef = useRef<HTMLElement | null>(null)
  const logoutWrapRef = useRef<HTMLDivElement | null>(null)
  const logoutPopoverRef = useRef<HTMLDivElement | null>(null)

  const [navSlider, setNavSlider] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  })

  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const measureActiveNav = useCallback(() => {
    const navEl = navRef.current
    if (!navEl) return

    const activeLink = navEl.querySelector<HTMLElement>(
      '.app-nav__link.is-active'
    )
    if (!activeLink) {
      setNavSlider((prev) => (prev.visible ? { ...prev, visible: false } : prev))
      return
    }

    const navRect = navEl.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()

    setNavSlider({
      x: linkRect.left - navRect.left,
      y: linkRect.top - navRect.top,
      width: linkRect.width,
      height: linkRect.height,
      visible: true,
    })
  }, [])

  useLayoutEffect(() => {
    const raf = window.requestAnimationFrame(measureActiveNav)
    return () => window.cancelAnimationFrame(raf)
  }, [location.pathname, measureActiveNav])

  useEffect(() => {
    const onResize = () => measureActiveNav()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measureActiveNav])

  useEffect(() => {
    if (!isLogoutOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (isLoggingOut) return
      if (e.key === 'Escape') setIsLogoutOpen(false)
    }
    const onMouseDown = (e: MouseEvent) => {
      if (isLoggingOut) return
      const target = e.target as Node | null
      if (!target) return
      if (logoutPopoverRef.current?.contains(target)) return
      if (logoutWrapRef.current?.contains(target)) return
      setIsLogoutOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [isLogoutOpen, isLoggingOut])

  useEffect(() => {
    setIsLogoutOpen(false)
  }, [location.pathname])

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await axiosInstance.post('/logout')
    } catch (error) {
      console.log(error)
    } finally {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('unauthorized'))
      setIsLoggingOut(false)
      setIsLogoutOpen(false)
    }
  }

  return (
    <div className='app-layout'>
      <header className='app-header'>
        <div className='app-header__inner'>
          <NavLink className='app-brand' to='/home'>
            Hadat
          </NavLink>
          <nav className='app-nav' ref={navRef}>
            <span
              className='app-nav__slider'
              aria-hidden
              style={{
                transform: `translate3d(${navSlider.x}px, ${navSlider.y}px, 0)`,
                width: `${navSlider.width}px`,
                height: `${navSlider.height}px`,
                opacity: navSlider.visible ? 1 : 0,
              }}
            />
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
            <div className='app-nav__item app-nav__item--logout' ref={logoutWrapRef}>
              <button
                type='button'
                className='app-nav__link app-nav__link--button'
                onClick={() => setIsLogoutOpen((prev) => !prev)}
              >
                Logout
              </button>
              {isLogoutOpen && (
                <div
                  className='app-popover'
                  ref={logoutPopoverRef}
                  role='dialog'
                  aria-label='Logout confirmation'
                >
                  <div className='app-popover__title'>Log out from Hadat?</div>
                  <div className='app-popover__actions'>
                    <button
                      className='app-button app-button--danger'
                      type='button'
                      onClick={handleConfirmLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Logging out…' : 'Confirm'}
                    </button>
                    <button
                      className='app-button app-button--ghost'
                      type='button'
                      onClick={() => setIsLogoutOpen(false)}
                      disabled={isLoggingOut}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
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
