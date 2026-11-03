import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

export function Module01Page() {
  return (
    <>
      <PageHero
        module="Module 01"
        tag="ML Team · Cloud team should read first"
        title={
          <>
            What is
            <br />
            <span className="ac">MLflow?</span>
          </>
        }
        subtitle="You have been naming files model_v2_FINAL_actually_final.pkl. MLflow gives every run a permanent record, a comparison UI, a versioned model store, and deployment standards."
        pills={
          <>
            <span className="who-pill who-ml">🧠 ML Team — required</span>
            <span className="who-pill who-cloud">☁ Cloud — read first</span>
          </>
        }
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The problem</p>
          <h2 className="sec-title R">
            Life before
            <br />
            MLflow.
          </h2>
          <div className="prob-grid">
            {[
              [
                '01',
                "You can't reproduce your best result",
                'Hyperparameters, data version, and preprocessing live in your head or scattered notebook cells.',
              ],
              [
                '02',
                'Model files are a disaster',
                'model_final.pkl, model_v2_fixed.pkl — no idea which is deployed or best.',
              ],
              [
                '03',
                "You can't compare experiments",
                'Metrics in three notebooks; comparison means manual spreadsheets.',
              ],
              [
                '04',
                'Deployment is a mystery',
                'Great notebook model — how do other services call it reliably?',
              ],
            ].map(([n, t, b]) => (
              <div key={n} className="prob-card R">
                <div className="prob-num">{n}</div>
                <div className="prob-title">{t}</div>
                <p className="prob-body">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The solution</p>
          <h2 className="sec-title R">
            MLflow in
            <br />
            one sentence.
          </h2>
          <p className="sec-body R">
            MLflow is an open-source platform for experiment tracking, reproducible projects, model
            packaging, and a central registry with lifecycle stages — the stack you will run on GCP
            Cloud Run in Module 04.
          </p>
          <div className="callout R">
            <p className="callout-label">Think of it this way</p>
            <p>
              If Git versions your <strong>code</strong>, MLflow versions your{' '}
              <strong>experiments and models</strong>.
            </p>
          </div>
          <div className="before-after R">
            <div className="ba-col before">
              <div className="ba-label">Without MLflow</div>
              <ul className="ba-list">
                <li>Hyperparameters in comments</li>
                <li>Ad-hoc pickle filenames</li>
                <li>Manual metric copying</li>
                <li>No training data lineage</li>
                <li>Fragile manual deploys</li>
              </ul>
            </div>
            <div className="ba-col after">
              <div className="ba-label">With MLflow</div>
              <ul className="ba-list">
                <li>Every run logged automatically</li>
                <li>Registry versions with stages</li>
                <li>UI charts across all runs</li>
                <li>Artifacts and params stored together</li>
                <li>models:/ URI loads anywhere</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Architecture</p>
          <h2 className="sec-title R">
            Four
            <br />
            components.
          </h2>
          <div className="comp-grid">
            {[
              ['📊', 'Tracking', 'Params, metrics, artifacts per run'],
              ['📦', 'Projects', 'Reproducible entry points and envs'],
              ['🧩', 'Models', 'Standard format for sklearn, PyTorch, etc.'],
              ['🏛', 'Registry', 'Staging → Production promotion'],
            ].map(([icon, name, desc]) => (
              <div key={name} className="comp-card R">
                <div className="comp-icon">{icon}</div>
                <div className="comp-name">{name}</div>
                <p className="comp-desc">{desc}</p>
              </div>
            ))}
          </div>
          <div className="callout cloud R" style={{ marginTop: '2rem' }}>
            <p className="callout-label">This internship</p>
            <p>
              You use <strong>Tracking</strong>, <strong>Models</strong>, and <strong>Registry</strong>{' '}
              daily. Cloud team hosts the tracking server on <strong>Cloud Run</strong> with artifacts
              in <strong>GCS</strong> (Module 04).
            </p>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Hands on</p>
          <h2 className="sec-title R">
            First tracked
            <br />
            run.
          </h2>
          <Terminal title="terminal — install" code={CODE.pipInstall} />
          <div style={{ height: '1.5rem' }} />
          <Terminal title="first_experiment.py" code={CODE.firstExperiment} />
          <div style={{ height: '1.5rem' }} />
          <Terminal title="terminal — MLflow UI" code={CODE.mlflowUi} />
          <div className="callout tip R">
            <p className="callout-label">✓ Module 02</p>
            <p>
              Next: integrate the same pattern into real <strong>train.py</strong>.{' '}
              <Link to="/02-tracking">Module 02 — Tracking →</Link>
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
