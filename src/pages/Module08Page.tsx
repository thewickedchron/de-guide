import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

export function Module08Page() {
  return (
    <>
      <PageHero
        module="Module 08"
        tag="Both teams — read early"
        title={
          <>
            Repo layout
            <br />
            <span className="ac">& Git flow.</span>
          </>
        }
        subtitle="Agree on folders, environment variables, and how you merge code before anyone writes train.py or Terraform. This module is the map of the whole codebase."
        pills={
          <>
            <span className="who-pill who-ml">ML Team</span>
            <span className="who-pill who-cloud">Cloud Team</span>
          </>
        }
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Structure</p>
          <h2 className="sec-title R">Monorepo layout.</h2>
          <p className="sec-body R">
            One GitHub repository per team. ML and Cloud students commit to different paths but share
            the same CI expectations: no secrets in git, every deployable artifact traceable to a
            commit.
          </p>
          <pre className="repo-tree R">{CODE.projectTree}</pre>
          <div className="callout tip R">
            <p className="callout-label">Same Docker image</p>
            <p>
              The <strong>prediction-api</strong> Cloud Run service and the <strong>retrain-job</strong>{' '}
              Cloud Run Job use the <strong>same Dockerfile</strong>. The job overrides the command to{' '}
              <strong>python train.py</strong> instead of uvicorn.
            </p>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Configuration</p>
          <h2 className="sec-title R">Environment variables.</h2>
          <Terminal title=".env.example" code={CODE.envExample} />
          <Terminal title="requirements.txt" code={CODE.requirementsTxt} />
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Week 1 deliverable</p>
          <h2 className="sec-title R">API contract.</h2>
          <p className="sec-body R">
            Before training seriously, both teams sign off on request/response JSON. Changing field
            names later breaks the React app and integration tests.
          </p>
          <Terminal title="POST /predict contract" code={CODE.apiContract} />
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Git workflow</p>
          <h2 className="sec-title R">Branches & PRs.</h2>
          <Terminal title="git — feature branch flow" code={CODE.gitWorkflow} />
          <div className="two-col R" style={{ marginTop: '2rem' }}>
            <div className="callout warn">
              <p className="callout-label">Never commit</p>
              <p>
                .env files, GCP service account JSON, API keys, or personal access tokens. Cloud team
                stores secrets in <strong>Secret Manager</strong>; ML team uses .env locally only.
              </p>
            </div>
            <div className="callout">
              <p className="callout-label">Review rule</p>
              <p>
                Every PR needs one reviewer from the <strong>other track</strong> when touching shared
                files (Dockerfile, requirements.txt, .env.example).
              </p>
            </div>
          </div>
          <div className="callout tip R">
            <p className="callout-label">Next</p>
            <p>
              <Link to="/01-what-is-mlflow">Module 01</Link> for MLflow ·{' '}
              <Link to="/04-deploy-gcp">Module 04</Link> for GCP
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
