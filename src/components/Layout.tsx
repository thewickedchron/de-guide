import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Nav } from './Nav'
import { Footer } from './Footer'

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const prog = document.getElementById('prog')

    const onScroll = () => {
      if (!prog) return
      const p =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      prog.style.width = `${Math.min(100, Math.max(0, p))}%`
    }

    window.addEventListener('scroll', onScroll)
    onScroll()

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    document.querySelectorAll('.R').forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = `${(i % 5) * 0.06}s`
      obs.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [location.pathname])

  return (
    <>
      <div id="prog" />
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}
