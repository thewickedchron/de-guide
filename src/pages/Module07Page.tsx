import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

export function Module07Page() {
  return (
    <>
      <PageHero
        module="Module 07"
        tag="Both teams — stretch & demo polish"
        title={
          <>
            React
            <br />
            <span className="ac">Frontend.</span>
          </>
        }
        subtitle="A separate React (Vite) app calls your Cloud Run API — show live predictions, model version, and RMSE from /model-info for stakeholders."
        pills={
          <>
            <span className="who-pill who-ml">🧠 ML Team UI</span>
            <span className="who-pill who-cloud">☁ CORS & deploy</span>
          </>
        }
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Project setup</p>
          <h2 className="sec-title R">New Vite app.</h2>
          <Terminal
            title="terminal — create frontend"
            code={`npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
echo "VITE_API_URL=https://prediction-api-xxxxx-uc.a.run.app" > .env.local`}
          />
          <div className="step-list R">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">Fetch model metadata</div>
                <p className="step-body">
                  On load, <strong>GET {`$\{VITE_API_URL\}/model-info`}</strong> — display version and
                  RMSE in the header.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-content">
                <div className="step-title">Prediction form</div>
                <p className="step-body">
                  Collect lat/lon and passenger count; POST to <strong>/predict</strong>; show trip
                  duration in seconds.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-content">
                <div className="step-title">CORS on FastAPI</div>
                <p className="step-body">
                  Cloud team: add CORSMiddleware with your Netlify or Firebase Hosting origin, or serve
                  the React build from the same Cloud Run service behind a path prefix.
                </p>
              </div>
            </div>
          </div>
          <Terminal title="frontend/src/App.tsx — starter" code={CODE.reactApp} />
          <Terminal
            title="FastAPI — CORS snippet"
            code={`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-team.netlify.app"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)`}
          />
          <div className="callout tip R">
            <p className="callout-label">Deploy frontend</p>
            <p>
              Push to GitHub → connect <strong>Netlify</strong> or <strong>Firebase Hosting</strong>{' '}
              (free tier). Set <strong>VITE_API_URL</strong> in the host&apos;s environment UI. Match
              the visual language of this course site for demo day polish.
            </p>
          </div>
          <div className="callout R">
            <p className="callout-label">Course complete</p>
            <p>
              You started at <Link to="/github-setup">GitHub setup</Link> and ended with MLflow on GCP,
              scheduled retraining, promotion gates, FastAPI, and React. Return to{' '}
              <Link to="/">home</Link> anytime.
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
