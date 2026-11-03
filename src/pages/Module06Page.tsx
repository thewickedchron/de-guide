import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

export function Module06Page() {
  return (
    <>
      <PageHero
        module="Module 06"
        tag="ML Team · FastAPI (Flask alternative noted)"
        title={
          <>
            Prediction
            <br />
            <span className="ac">API.</span>
          </>
        }
        subtitle="Expose MLflow metrics, serve /predict from the Production registry model, and reload after each scheduled retrain — using FastAPI lifespan hooks (modern replacement for on_event)."
        pills={<span className="who-pill who-ml">🧠 ML Team — required</span>}
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Endpoints</p>
          <h2 className="sec-title R">What you ship.</h2>
          <div className="three-col R">
            <div className="card">
              <div className="card-title">GET /health</div>
              <p className="card-body">Load balancer & Cloud Run probes — confirms process is up.</p>
            </div>
            <div className="card">
              <div className="card-title">GET /model-info</div>
              <p className="card-body">
                Live registry version, RMSE, trained_at — backed by MLflow metadata, not hardcoded.
              </p>
            </div>
            <div className="card">
              <div className="card-title">POST /predict</div>
              <p className="card-body">
                JSON features → prediction; uses same features.py transforms as train.py.
              </p>
            </div>
          </div>
          <div className="card R" style={{ marginTop: '1.5rem' }}>
            <div className="card-title">POST /reload-model</div>
            <p className="card-body">
              Called by Cloud Scheduler or Cloud Workflows after retrain-job succeeds. Reloads{' '}
              <strong>models:/MODEL_NAME/Production</strong> without restarting the container.
            </p>
          </div>
          <div className="callout R">
            <p className="callout-label">Flask instead?</p>
            <p>
              The internship standard is <strong>FastAPI</strong> for automatic OpenAPI docs at{' '}
              <strong>/docs</strong>. Flask works with the same MLflow load logic — swap routing
              decorators and use an app factory; keep <strong>load_production_model()</strong>{' '}
              identical.
            </p>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Implementation</p>
          <h2 className="sec-title R">api/main.py</h2>
          <Terminal title="FastAPI — full example" code={CODE.apiMain} />
          <div className="callout warn R">
            <p className="callout-label">Docker</p>
            <p>
              Cloud Run expects port <strong>8080</strong>. Run uvicorn with{' '}
              <strong>uvicorn api.main:app --host 0.0.0.0 --port 8080</strong> in your Dockerfile CMD.
            </p>
          </div>
          <Terminal title="Dockerfile" code={CODE.dockerfileApi} />
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">MLflow from the API</p>
          <h2 className="sec-title R">Experiment metrics route.</h2>
          <p className="sec-body R">
            Expose recent runs so the React dashboard (Module 07) or Grafana can chart RMSE over time
            without scraping the MLflow UI.
          </p>
          <Terminal title="GET /experiments/runs" code={CODE.mlflowMetricsRoute} />
          <Terminal title="Firestore prediction log" code={CODE.firestoreLog} />
          <div className="callout cloud R">
            <p className="callout-label">Firestore</p>
            <p>
              Set <strong>ENABLE_FIRESTORE_LOG=1</strong> and <strong>GCP_PROJECT_ID</strong> on Cloud
              Run. Cloud team creates Firestore in Module 04.
            </p>
          </div>
          <p className="sec-label R" style={{ marginTop: '2rem' }}>
            Manual test
          </p>
          <Terminal
            title="curl — smoke test"
            code={`curl -s https://YOUR_API/health | jq
curl -s https://YOUR_API/model-info | jq
curl -s -X POST https://YOUR_API/predict \\
  -H "Content-Type: application/json" \\
  -d '{"pickup_latitude":40.75,"pickup_longitude":-73.98,"dropoff_latitude":40.68,"dropoff_longitude":-73.95,"passenger_count":2}' | jq`}
          />
          <div className="callout tip R">
            <p className="callout-label">✓ Module 07</p>
            <p>
              <Link to="/07-react-frontend">Build the React consumer →</Link>
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
