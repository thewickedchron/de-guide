import { PROGRAMME_WEEKS } from '../content/programme'

export function ProgrammeTimeline() {
  return (
    <div className="timeline R">
      {PROGRAMME_WEEKS.map((w) => (
        <div key={w.week} className="tl-week">
          <div className="tl-num">{w.week}</div>
          <div className="tl-content">
            <div className="tl-title">{w.title}</div>
            <div className="tl-ml">{w.ml}</div>
            <div className="tl-cloud">{w.cloud}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
