import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

const awsGcp = [
  ['Compute', 'EC2 / Lambda', 'Cloud Run (serverless containers)'],
  ['Object storage', 'S3', 'Cloud Storage (GCS)'],
  ['IAM', 'IAM roles & policies', 'IAM — same idea, different console'],
  ['CLI', 'AWS CLI', 'gcloud CLI'],
  ['CI/CD', 'CodeBuild / CodePipeline', 'Cloud Build'],
  ['Scheduler', 'EventBridge', 'Cloud Scheduler'],
  ['NoSQL logs', 'DynamoDB', 'Firestore'],
]

export function Module04Page() {
  return (
    <>
      <PageHero
        module="Module 04"
        tag="Cloud Team — your module"
        title={
          <>
            Deploy
            <br />
            <span className="ac">MLflow on GCP.</span>
          </>
        }
        subtitle="Host MLflow serverlessly on Cloud Run with GCS artifacts and Cloud SQL for a persistent tracking backend — updated from the old sqlite-on-Cloud-Run pattern that lost data on every deploy."
        pills={<span className="who-pill who-cloud">☁ Cloud Team</span>}
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">AWS → GCP</p>
          <h2 className="sec-title R">Translation guide.</h2>
          <table className="aws-gcp-table R">
            <thead>
              <tr>
                <th>Concept</th>
                <th className="aws">AWS</th>
                <th className="gcp">GCP (this course)</th>
              </tr>
            </thead>
            <tbody>
              {awsGcp.map(([what, aws, gcp]) => (
                <tr key={what}>
                  <td>{what}</td>
                  <td className="aws">{aws}</td>
                  <td className="gcp">{gcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="callout cloud R">
            <p className="callout-label">Four services you operate</p>
            <p>
              <strong>Cloud Run</strong> — MLflow tracking UI + prediction API ·{' '}
              <strong>GCS</strong> — data & artifacts · <strong>Cloud Scheduler</strong> — retrain
              cron · <strong>Firestore</strong> — optional prediction request logs
            </p>
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Architecture</p>
          <h2 className="sec-title R">What you build.</h2>
          <div className="arch-diagram R">
            <div className="arch-node">
              <div className="arch-node-title">MLflow Server</div>
              <div className="arch-node-sub">Cloud Run · port 5000</div>
            </div>
            <div className="arch-node">
              <div className="arch-node-title">Artifact store</div>
              <div className="arch-node-sub">gs://…/mlflow-artifacts</div>
            </div>
            <div className="arch-node">
              <div className="arch-node-title">Backend store</div>
              <div className="arch-node-sub">Cloud SQL PostgreSQL</div>
            </div>
          </div>
          <div className="step-list" style={{ marginTop: '3rem' }}>
            <div className="step R">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">Create GCP project</div>
                <p className="step-body">
                  console.cloud.google.com → New Project → name{' '}
                  <strong>git-plus-your-team</strong>. Note the Project ID.
                </p>
              </div>
            </div>
            <div className="step R">
              <div className="step-num">2</div>
              <div className="step-content">
                <div className="step-title">gcloud auth & APIs</div>
                <Terminal title="gcloud setup" code={CODE.gcloudAuth} />
                <div style={{ height: '1rem' }} />
                <Terminal title="enable APIs" code={CODE.gcloudEnable} />
              </div>
            </div>
            <div className="step R">
              <div className="step-num">3</div>
              <div className="step-content">
                <div className="step-title">GCS bucket & training data</div>
                <p className="step-body" style={{ marginBottom: '1rem' }}>
                  Use the <strong>gcloud storage</strong> command group for all bucket and object
                  operations. The older <strong>gsutil</strong> tool still ships with the SDK but is
                  no longer recommended for new work.
                </p>
                <Terminal title="gcloud storage — bucket layout" code={CODE.gcsSetup} />
              </div>
            </div>
            <div className="step R">
              <div className="step-num">4</div>
              <div className="step-content">
                <div className="step-title">MLflow on Cloud Run (serverless)</div>
                <Terminal title="infra/mlflow/Dockerfile" code={CODE.mlflowDockerfile} />
                <div style={{ height: '1rem' }} />
                <Terminal title="deploy mlflow-server" code={CODE.mlflowDeploy} />
                <div className="callout warn" style={{ marginTop: '1rem' }}>
                  <p className="callout-label">Why not sqlite?</p>
                  <p>
                    Cloud Run filesystems are ephemeral. Use <strong>PostgreSQL on Cloud SQL</strong>{' '}
                    (or another managed DB) for <strong>MLFLOW_BACKEND_STORE_URI</strong>. Store DB
                    passwords in <strong>Secret Manager</strong>, not in git.
                  </p>
                </div>
              </div>
            </div>
            <div className="step R">
              <div className="step-num">5</div>
              <div className="step-content">
                <div className="step-title">Share MLFLOW_TRACKING_URI</div>
                <p className="step-body">
                  ML team sets <strong>MLFLOW_TRACKING_URI=https://mlflow-server-….run.app</strong> in{' '}
                  <strong>.env</strong> and <strong>.env.example</strong>. Confirm a test run appears in
                  the UI before Week 3 training.
                </p>
              </div>
            </div>
            <div className="step R">
              <div className="step-num">6</div>
              <div className="step-content">
                <div className="step-title">Deploy prediction API (Week 4)</div>
                <Terminal title="Cloud Run — prediction-api" code={CODE.apiDeploy} />
              </div>
            </div>
          </div>
          <div className="callout tip R">
            <p className="callout-label">✓ Module 05</p>
            <p>
              <Link to="/05-full-loop">Automated retraining loop →</Link>
            </p>
          </div>
          <ProgressNav />
        </div>
      </section>
    </>
  )
}
