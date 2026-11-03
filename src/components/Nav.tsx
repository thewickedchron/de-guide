import { Link, useLocation } from 'react-router-dom'
import { COURSE_MODULES } from '../content/navigation'

export function Nav() {
  const { pathname } = useLocation()

  return (
    <nav>
      <Link className="nav-logo" to="/">
        <span className="nav-mark">+</span>
        Git Plus
      </Link>
      <ul className="nav-links">
        <li>
          <Link className={pathname === '/' ? 'active' : ''} to="/">
            <span className="nav-num">—</span>
            <span className="nav-label">Home</span>
          </Link>
        </li>
        {COURSE_MODULES.map((m) => (
          <li key={m.path}>
            <Link className={pathname === m.path ? 'active' : ''} to={m.path}>
              <span className="nav-num">{m.num}</span>
              <span className="nav-label">{m.shortName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
