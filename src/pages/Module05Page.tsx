import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { Checklist } from '../components/Checklist'
import { ProgrammeTimeline } from '../components/ProgrammeTimeline'
import { CODE } from '../content/codeSamples'
import { DEMO_CLOUD_CHECKLIST, DEMO_ML_CHECKLIST, NON_NEGOTIABLES } from '../content/programme'

const loopSteps = [
  ['AUTO', 'auto', 'Scheduler fires', 'Cloud Scheduler POST triggers the Cloud Run Job on cron (e.g. Sunday midnight).'],
  ['CLOUD', 'cloud', 'Job starts', 'Container runs python train.py with MLFLOW_TRACKING_URI and DATA_PATH from env.'],
  ['ML', 'ml', 'Data from GCS', 'train.py reads gs://BUCKET/data/train.csv via pandas / gcsfs.'],
  ['ML', 'ml', 'features.py', 'clean() and engineer() — same code path as the API (no train-serve skew).'],
  ['ML', 'ml', 'Train & log', 'Metrics and model hit MLflow on Cloud Run; artifacts land in GCS.'],
  ['AUTO', 'auto', 'Evaluation gate', 'promote_if_better() compares RMSE; worse models stop here.'],
  ['AUTO', 'auto', 'Promotion', 'Better model → Production; previous → Archived.'],
  ['CLOUD', 'cloud', '/reload-model', 'Post-job hook POSTs to the prediction API Cloud Run service.'],
  ['ML', 'ml', 'Hot-swap', 'API reloads models:/…/Production — zero downtime.'],
  ['AUTO', 'auto', 'Repeat', 'Next cron tick; optional Firestore logs enrich future training data.'],
]

export function Module05Page() {
  return (
    <>
      <PageHero
        module="Module 05"
        tag="Both teams — capstone"
        title={
          <>
            Full
            <br />
            <span className="ac">Retraining Loop.</span>
          </>
        }
        subtitle="Scheduler → train.py → gate → promotion → reload. After setup, nobody clicks promote — accuracy improves only when the new model beats Production."
        pills={
          <>
            <span className="who-pill who-ml">🧠 ML Team</span>
            <span className="who-pill who-cloud">☁ Cloud Team</span>
          </>
        }
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The loop</p>
          <h2 className="sec-title R">
            Ten steps.
            <br />
            Zero clicks.
          </h2>
          <div className="loop-diagram R">
            {loopSteps.map(([badge, cls, title, text]) => (
              <div key={title} className="loop-step">
                <div className={`loop-badge ${cls}`}>{badge}</div>
                <div className="loop-content">
                  <div className="ld-title">{title}</div>
                  <p className="ld-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Cloud team — Week 5</p>
          <h2 className="sec-title R">Scheduler setup.</h2>
          <Terminal title="Cloud Run Job + Cloud Scheduler" code={CODE.retrainJob} />
          <div className="callout cloud R">
            <p className="callout-label">OAuth for Scheduler</p>
            <p>
              The scheduler calls the <strong>Run Jobs v2 :run</strong> URL. Grant the service account{' '}
              <strong>Cloud Run Invoker</strong> on <strong>retrain-job</strong> (role{' '}
              <strong>roles/run.invoker</strong>) if you see 403 responses.
            </p>
          </div>
          <div className="three-col R" style={{ marginTop: '2rem' }}>
            <div className="card">
              <div className="card-title">Demo checklist</div>
              <p className="card-body">
                Manual job run → new MLflow run · gate message in logs · Production version bumps only
                when RMSE improves · /model-info updates after reload.
              </p>
            </div>
            <div className="card">
              <div className="card-title">ML team owns</div>
              <p className="card-body">train.py, gate logic, features.py parity with API preprocessing.</p>
            </div>
            <div className="card">
              <div className="card-title">Cloud team owns</div>
              <p className="card-body">Job image, env vars, schedule, post-train reload curl / Workflow.</p>
            </div>
          </div>
          <div className="callout cloud R">
            <p className="callout-label">Automate /reload-model</p>
            <p>
              After <strong>retrain-job</strong> succeeds, call <strong>POST /reload-model</strong>{' '}
              automatically — second Scheduler job, Cloud Workflows step, or Eventarc on job completion.
              Manual curl is fine for Week 5; full automation is the stretch goal.
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Programme timeline</p>
          <h2 className="sec-title R">What to ship each week.</h2>
          <p className="sec-body R">
            Use this with your teammate to spot blockers early. If Week 2 MLflow is not live, stop
            feature work and fix infrastructure first.
          </p>
          <ProgrammeTimeline />
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Demo day</p>
          <h2 className="sec-title R">Final checklist.</h2>
          <div className="checkpoint-grid">
            <Checklist title="ML team" variant="ml" items={[...DEMO_ML_CHECKLIST]} />
            <Checklist title="Cloud team" variant="cloud" items={[...DEMO_CLOUD_CHECKLIST]} />
          </div>
          <div className="callout warn R">
            <p className="callout-label">Non-negotiables</p>
            <p>
              {NON_NEGOTIABLES.map((n, i) => (
                <span key={n}>
                  <strong>{i + 1}.</strong> {n}
                  <br />
                </span>
              ))}
            </p>
          </div>
          <div className="callout tip R">
            <p className="callout-label">You built it</p>
            <p>
              Extend with <Link to="/06-api-backend">Module 06 (API)</Link> and{' '}
              <Link to="/07-react-frontend">Module 07 (React)</Link>.
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
