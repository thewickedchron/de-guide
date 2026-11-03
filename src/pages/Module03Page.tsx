import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

export function Module03Page() {
  return (
    <>
      <PageHero
        module="Module 03"
        tag="ML Team — core skill"
        title={
          <>
            Registry &amp;
            <br />
            <span className="ac">Promotion.</span>
          </>
        }
        subtitle="Version models, gate promotions on RMSE, and hot-swap Production without restarting Cloud Run."
        pills={<span className="who-pill who-ml">🧠 ML Team — required</span>}
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Lifecycle</p>
          <h2 className="sec-title R">Model stages.</h2>
          <div className="lifecycle-grid">
            {[
              ['None', 'Freshly registered from a training run'],
              ['Staging', 'Under evaluation vs Production'],
              ['Production', 'Live model — API loads this stage'],
              ['Archived', 'Former Production — rollback history'],
            ].map(([stage, desc]) => (
              <div key={stage} className="lc-card R">
                <div className="lc-stage">{stage}</div>
                <p className="lc-desc">{desc}</p>
              </div>
            ))}
          </div>
          <div className="callout R" style={{ marginTop: '2rem' }}>
            <p className="callout-label">Key insight</p>
            <p>
              The API loads <strong>models:/taxi-duration-model/Production</strong> — a path, not a
              version number. Promotion updates what that path resolves to without code changes.
            </p>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The gate</p>
          <h2 className="sec-title R">
            promote_if_better()
          </h2>
          <div className="step-list">
            {[
              ['Training finishes', 'RMSE logged; new registry version N created'],
              ['Lookup Production', 'Fetch current Production run RMSE from MLflow'],
              ['Reject if worse', 'new_rmse ≥ current → print and exit; API unchanged'],
              ['Promote if better', 'Transition to Production; archive previous'],
              ['Hot-swap', 'Cloud calls POST /reload-model; next /predict uses new weights'],
            ].map(([t, b], i) => (
              <div key={t} className="step R">
                <div className="step-num">{i + 1}</div>
                <div className="step-content">
                  <div className="step-title">{t}</div>
                  <p className="step-body">{b}</p>
                </div>
              </div>
            ))}
          </div>
          <Terminal title="train.py — promote_if_better()" code={CODE.promoteIfBetter} />
          <div className="callout warn R">
            <p className="callout-label">Test the gate</p>
            <p>
              Run with <strong>n_estimators=1</strong>. Gate must print NOT promoting and leave
              Production untouched.
            </p>
          </div>
          <p className="sec-body R" style={{ marginTop: '2rem' }}>
            Full API implementation (predict, metrics, lifespan) is in{' '}
            <Link to="/06-api-backend">Module 06</Link>. Core loading pattern:
          </p>
          <Terminal title="api/main.py — load & reload (excerpt)" code={CODE.apiMain.split('\n').slice(0, 45).join('\n') + '\n# ... see Module 06 for /predict'} />
          <div className="callout tip R">
            <p className="callout-label">✓ Module 04</p>
            <p>
              Cloud team: <Link to="/04-deploy-gcp">Deploy MLflow on GCP →</Link>
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
