import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

const apiRows = [
  ['mlflow.set_experiment(name)', 'Groups runs under one experiment — call once at top of train.py'],
  ['mlflow.start_run(run_name=...)', 'Opens a run; everything in the with block is logged'],
  ['mlflow.log_param(key, value)', 'Configuration choices: model type, hyperparameters'],
  ['mlflow.log_metric(key, value)', 'Quality numbers: RMSE, F1 — used by the evaluation gate'],
  ['mlflow.log_artifact(path)', 'Plots, CSVs, reports stored with the run'],
  ['mlflow.sklearn.log_model(...)', 'Saves model + optional registered_model_name for Registry'],
]

export function Module02Page() {
  return (
    <>
      <PageHero
        module="Module 02"
        tag="ML Team — core skill"
        title={
          <>
            Tracking &amp;
            <br />
            <span className="ac">Experiments.</span>
          </>
        }
        subtitle="Six functions cover the Tracking API for this project. Integrate them into train.py and features.py, then read the MLflow UI to compare runs."
        pills={<span className="who-pill who-ml">🧠 ML Team — required</span>}
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The API</p>
          <h2 className="sec-title R">
            Six functions.
            <br />
            That is all.
          </h2>
          <div className="step-list">
            {apiRows.map(([title, body], i) => (
              <div key={title} className="step R">
                <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-content">
                  <div className="step-title">{title}</div>
                  <p className="step-body">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Integration</p>
          <h2 className="sec-title R">
            Complete
            <br />
            train.py.
          </h2>
          <Terminal title="train.py — tracking integration" code={CODE.trainPy} />
          <div className="callout warn R">
            <p className="callout-label">⚠ Environment variables</p>
            <p>
              <strong>DATA_PATH</strong>, <strong>MLFLOW_TRACKING_URI</strong>, and{' '}
              <strong>N_ESTIMATORS</strong> must come from the environment — never hardcoded — so Cloud
              Run Jobs can retrain without code changes. Use <strong>.env</strong> locally (gitignored).
            </p>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The UI</p>
          <h2 className="sec-title R">
            Reading the
            <br />
            dashboard.
          </h2>
          <div className="ui-callout R">
            <div className="ui-bar">
              <div className="ui-bar-dot" />
              <span className="ui-bar-title">MLflow UI — taxi-duration — 2 runs</span>
            </div>
            <div className="ui-body">
              <div className="ui-row">
                <span className="ui-label">run</span>
                <span className="ui-val">rf-100trees</span>
                <span className="ui-badge fin">FINISHED</span>
                <span className="ui-label">n_estimators</span>
                <span className="ui-val">100</span>
                <span className="ui-label">rmse</span>
                <span className="ui-metric">423.71</span>
              </div>
              <div className="ui-row">
                <span className="ui-label">run</span>
                <span className="ui-val">rf-200trees</span>
                <span className="ui-badge fin">FINISHED</span>
                <span className="ui-label">n_estimators</span>
                <span className="ui-val">200</span>
                <span className="ui-label">rmse</span>
                <span className="ui-metric" style={{ color: 'var(--gold)' }}>
                  398.44
                </span>
              </div>
            </div>
          </div>
          <div className="three-col R" style={{ marginTop: '2rem' }}>
            <div className="card">
              <div className="card-icon">🔵</div>
              <div className="card-title">Parameters</div>
              <p className="card-body">Sort by column headers. Lower RMSE wins when n_estimators increases.</p>
            </div>
            <div className="card">
              <div className="card-icon">🟡</div>
              <div className="card-title">Metrics</div>
              <p className="card-body">The evaluation gate compares RMSE against current Production.</p>
            </div>
            <div className="card">
              <div className="card-icon">📊</div>
              <div className="card-title">Compare</div>
              <p className="card-body">Select runs → Compare for side-by-side charts.</p>
            </div>
          </div>
          <div className="two-col R" style={{ marginTop: '2rem' }}>
            <div className="callout tip">
              <p className="callout-label">Always log</p>
              <p>
                model_type, hyperparameters, feature list, train row count, primary metric, and{' '}
                log_model once per run.
              </p>
            </div>
            <div className="callout warn">
              <p className="callout-label">Avoid</p>
              <p>
                Tracking only in notebooks, unclosed runs (always use with), logging the model twice.
              </p>
            </div>
          </div>
          <div className="callout tip R">
            <p className="callout-label">✓ Module 03</p>
            <p>
              <Link to="/03-registry">Registry & promotion →</Link>
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
