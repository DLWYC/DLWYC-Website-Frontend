import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

/**
 * Drop this once inside your <Router>, above your <Routes>.
 * It scrolls the window to the top every time the route (pathname) changes,
 * so navigating to a new page (e.g. clicking a footer link) always opens
 * at the top instead of wherever you were scrolled to on the previous page.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
