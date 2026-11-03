import { Link, useLocation } from 'react-router-dom'
import { COURSE_MODULES } from '../content/navigation'

export function ProgressNav() {
  const { pathname } = useLocation()

  return (
    <div className="progress-nav R">
      <p className="pn-label">Course navigation — all modules</p>
      <div className="pn-grid">
        <Link className={`pn-item${pathname === '/' ? ' current' : ''}`} to="/">
          <span className="pn-num">—</span>
          <span className="pn-name">Home</span>
        </Link>
        {COURSE_MODULES.map((m) => (
          <Link
            key={m.path}
            className={`pn-item${pathname === m.path ? ' current' : ''}`}
            to={m.path}
          >
            <span className="pn-num">{m.num}</span>
            <span className="pn-name">{m.shortName}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
