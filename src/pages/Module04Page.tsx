import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { CODE } from '../content/codeSamples'

const awsGcp = [
  ['Object / blob storage', 'S3', 'Cloud Storage (GCS)'],
  ['Containers without servers', 'Fargate / App Runner', 'Cloud Run'],
  ['Virtual machines', 'EC2', 'Compute Engine'],
  ['Kubernetes', 'EKS', 'GKE'],
  ['NoSQL documents', 'DynamoDB', 'Firestore'],
  ['Relational DB', 'RDS', 'Cloud SQL'],
  ['Functions', 'Lambda', 'Cloud Functions'],
  ['Container registry', 'ECR', 'Artifact Registry'],
  ['Cron / schedules', 'EventBridge Scheduler', 'Cloud Scheduler'],
  ['Monitoring', 'CloudWatch', 'Cloud Monitoring'],
  ['IAM', 'IAM roles', 'IAM (same idea)'],
  ['CLI', 'AWS CLI', 'gcloud CLI'],
  ['Build CI', 'CodeBuild', 'Cloud Build'],
  ['Messaging', 'SQS / SNS', 'Pub/Sub'],
]

const archServices = [
  ['🧪', 'MLflow Server', 'Cloud Run'],
  ['🗄️', 'Artifacts + data', 'GCS'],
  ['🚀', 'Prediction API', 'Cloud Run'],
  ['📝', 'Request logs', 'Firestore'],
  ['⏰', 'Retrain trigger', 'Cloud Scheduler'],
  ['📊', 'Metrics', 'Cloud Monitoring'],
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
        subtitle="From empty GCP project to a shareable MLFLOW_TRACKING_URI: billing guardrails, gcloud storage, Cloud SQL backend, MLflow and API on Cloud Run, IAM, and Firestore."
        pills={<span className="who-pill who-cloud">☁ Cloud Team</span>}
      />
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">AWS → GCP</p>
          <h2 className="sec-title R">Full service map.</h2>
          <p className="sec-body R">
            If you know AWS, GCP is the same ideas with different product names. You will touch the
            rows marked in the right column every week.
          </p>
          <table className="aws-gcp-table R">
            <thead>
              <tr>
                <th>What it does</th>
                <th className="aws">AWS</th>
                <th className="gcp">GCP</th>
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
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Architecture</p>
          <h2 className="sec-title R">Six moving parts.</h2>
          <div className="arch-diagram-wide R">
            {archServices.map(([icon, name, svc]) => (
              <div key={name} className="arch-box">
                <div className="arch-icon">{icon}</div>
                <div className="arch-name">{name}</div>
                <div className="arch-svc">{svc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="rule" />
      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">Step by step</p>
          <h2 className="sec-title R">Zero to live URL.</h2>
          <p className="sec-body R">
            Do not skip verification between steps. If bucket permissions are wrong, MLflow runs will
            fail silently or artifacts will land on ephemeral disk.
          </p>
          <div className="step-list">
            <div className="step R">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">Project + billing alert</div>
                <p className="step-body">
                  Create project <strong>git-plus-your-team</strong>. Set a budget alert before enabling
                  APIs — free trial credits still need guardrails.
                </p>
                <Terminal title="Billing (console checklist)" code={CODE.billingBudget} />
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
                <div className="step-title">GCS via gcloud storage</div>
                <p className="step-body" style={{ marginBottom: '1rem' }}>
                  Use <strong>gcloud storage</strong>, not gsutil. Bucket holds training CSV and MLflow
                  artifact prefix.
                </p>
                <Terminal title="gcloud storage — bucket layout" code={CODE.gcsSetup} />
              </div>
            </div>
            <div className="step R">
              <div className="step-num">4</div>
              <div className="step-content">
                <div className="step-title">Service account & IAM</div>
                <Terminal title="IAM for Cloud Run → Cloud SQL + GCS" code={CODE.serviceAccount} />
              </div>
            </div>
            <div className="step R">
              <div className="step-num">5</div>
              <div className="step-content">
                <div className="step-title">MLflow on Cloud Run</div>
                <Terminal title="infra/mlflow/Dockerfile" code={CODE.mlflowDockerfile} />
                <div style={{ height: '1rem' }} />
                <Terminal title="Cloud SQL + deploy" code={CODE.mlflowDeploy} />
                <div style={{ height: '1rem' }} />
                <Terminal title="Secret-safe DB URI" code={CODE.cloudSqlSecret} />
                <div className="callout warn" style={{ marginTop: '1rem' }}>
                  <p className="callout-label">Why not sqlite?</p>
                  <p>
                    Cloud Run disks are ephemeral. Tracking metadata belongs in{' '}
                    <strong>Cloud SQL PostgreSQL</strong>; large artifacts belong in{' '}
                    <strong>GCS</strong> via <strong>MLFLOW_DEFAULT_ARTIFACT_ROOT</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className="step R">
              <div className="step-num">6</div>
              <div className="step-content">
                <div className="step-title">Share MLFLOW_TRACKING_URI</div>
                <p className="step-body">
                  Paste the Cloud Run URL into <strong>.env.example</strong>. ML team runs a one-line
                  test script and confirms a run appears in the Experiments tab.
                </p>
              </div>
            </div>
            <div className="step R">
              <div className="step-num">7</div>
              <div className="step-content">
                <div className="step-title">Firestore (Week 3+)</div>
                <Terminal title="Firestore Native" code={CODE.firestoreSetup} />
              </div>
            </div>
            <div className="step R">
              <div className="step-num">8</div>
              <div className="step-content">
                <div className="step-title">Deploy prediction API</div>
                <Terminal title="Cloud Run — prediction-api" code={CODE.apiDeploy} />
              </div>
            </div>
          </div>
          <p className="sec-label R" style={{ marginTop: '3rem' }}>
            Troubleshooting
          </p>
          <div className="trouble-grid R">
            <div className="trouble-item">
              <div className="trouble-q">MLflow UI 503 or empty experiments</div>
              <p className="trouble-a">
                Check Cloud Run logs. Verify <strong>MLFLOW_BACKEND_STORE_URI</strong> and Cloud SQL
                connection name. Confirm APIs enabled.
              </p>
            </div>
            <div className="trouble-item">
              <div className="trouble-q">Artifact upload failed</div>
              <p className="trouble-a">
                Service account needs <strong>storage.objectAdmin</strong> on the bucket. Confirm{' '}
                <strong>gs://…/mlflow-artifacts</strong> exists via gcloud storage ls.
              </p>
            </div>
            <div className="trouble-item">
              <div className="trouble-q">ML team cannot reach tracking URI</div>
              <p className="trouble-a">
                For internal training use <strong>--allow-unauthenticated</strong> on MLflow only in
                dev; for production restrict with IAM + Identity-Aware Proxy or VPN lab setup.
              </p>
            </div>
            <div className="trouble-item">
              <div className="trouble-q">Costs climbing</div>
              <p className="trouble-a">
                Cloud SQL always-on instance dominates spend. Stop instances in dev when not demoing;
                use budget alerts from step 1.
              </p>
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
