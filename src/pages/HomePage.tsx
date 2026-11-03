import { Link } from 'react-router-dom'
import { ProgrammeTimeline } from '../components/ProgrammeTimeline'
import { ProgressNav } from '../components/ProgressNav'

const modules = [
  {
    path: '/github-setup',
    num: 'Module 00',
    title: 'GitHub Setup',
    desc: 'Create your account, verify email, and accept your Git Plus team repository invitation.',
    className: 'c-both',
    pills: (
      <>
        <span className="pill badge-ml">ML Team</span>
        <span className="pill badge-cloud">Cloud Team</span>
      </>
    ),
  },
  {
    path: '/01-what-is-mlflow',
    num: 'Module 01',
    title: 'What is MLflow?',
    desc: 'The notebook problem, MLflow’s four components, and your first tracked experiment.',
    className: 'c-ml',
    pills: (
      <>
        <span className="pill badge-ml">ML Team</span>
        <span className="pill badge-both">Cloud — read first</span>
      </>
    ),
  },
  {
    path: '/02-tracking',
    num: 'Module 02',
    title: 'Tracking & Experiments',
    desc: 'Six API calls, train.py integration, and reading the MLflow UI like a professional.',
    className: 'c-ml',
    pills: <span className="pill badge-ml">ML Team</span>,
  },
  {
    path: '/03-registry',
    num: 'Module 03',
    title: 'Model Registry & Promotion',
    desc: 'Version models, build the evaluation gate, and hot-swap Production without downtime.',
    className: 'c-ml',
    pills: <span className="pill badge-ml">ML Team</span>,
  },
  {
    path: '/04-deploy-gcp',
    num: 'Module 04',
    title: 'Deploy MLflow on GCP',
    desc: 'Free-tier GCP project, GCS artifacts, Cloud Run serverless MLflow, and the prediction API.',
    className: 'c-cloud',
    pills: <span className="pill badge-cloud">Cloud Team</span>,
  },
  {
    path: '/05-full-loop',
    num: 'Module 05',
    title: 'The Full Retraining Loop',
    desc: 'Cloud Scheduler → train.py → evaluation gate → promotion → /reload-model. Zero manual clicks.',
    className: 'c-both',
    pills: (
      <>
        <span className="pill badge-ml">ML Team</span>
        <span className="pill badge-cloud">Cloud Team</span>
      </>
    ),
  },
  {
    path: '/06-api-backend',
    num: 'Module 06',
    title: 'FastAPI Backend',
    desc: 'Metrics from MLflow, /predict, /model-info, and Firestore logging for production observability.',
    className: 'c-ml',
    pills: <span className="pill badge-ml">ML Team</span>,
  },
  {
    path: '/07-react-frontend',
    num: 'Module 07',
    title: 'React Frontend',
    desc: 'A student-facing React app that calls your deployed API and visualizes live model metadata.',
    className: 'c-both',
    pills: (
      <>
        <span className="pill badge-ml">ML Team</span>
        <span className="pill badge-cloud">Cloud Team</span>
      </>
    ),
  },
  {
    path: '/08-project-structure',
    num: 'Module 08',
    title: 'Project Structure & Git',
    desc: 'Monorepo layout, .env contract, API schema, branch/PR workflow, and Docker conventions.',
    className: 'c-both',
    pills: (
      <>
        <span className="pill badge-ml">ML Team</span>
        <span className="pill badge-cloud">Cloud Team</span>
      </>
    ),
  },
]

export function HomePage() {
  return (
    <>
      <section className="hero-index">
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="wrap hero-content">
          <div className="course-chip">Git Plus · Self-paced MLOps</div>
          <h1 className="index-title">
            Git<span className="ac">Plus</span>
          </h1>
          <p className="index-sub">
            One guide from GitHub signup to a self-improving ML system on GCP — MLflow tracking,
            model promotion, scheduled retraining, FastAPI, and React.
          </p>
          <div className="who-row">
            <span className="who-pill who-ml">ML Team</span>
            <span className="who-pill who-cloud">Cloud Team</span>
            <span className="who-pill who-both">Both tracks</span>
          </div>
          <div className="cta-row">
            <Link className="btn-primary" to="/github-setup">
              Start with GitHub setup
            </Link>
            <Link className="btn-ghost" to="/04-deploy-gcp">
              Jump to GCP deploy
            </Link>
          </div>
        </div>
      </section>

      <div className="rule" />

      <section className="sec">
        <div className="wrap">
          <p className="sec-label R">The Course</p>
          <h2 className="sec-title R">
            Nine modules.
            <br />
            One working system.
          </h2>
          <p className="sec-body R">
            A Git Plus course from first commit to a self-improving ML system on GCP — MLflow 2.x,
            Cloud Run, Cloud SQL, scheduled retraining with accuracy-based promotion, FastAPI, and
            React.
          </p>

          <div className="module-grid">
            {modules.map((m) => (
              <Link key={m.path} className={`module-card ${m.className} R`} to={m.path}>
                <div className="mc-num">{m.num}</div>
                <div className="mc-title">{m.title}</div>
                <div className="mc-desc">{m.desc}</div>
                <div className="mc-who">{m.pills}</div>
                <span className="mc-arrow">→</span>
              </Link>
            ))}
            <div
              className="module-card R"
              style={{
                background: 'var(--panel-elevated)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                borderStyle: 'dashed',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: '0.8rem',
                }}
              >
                Git Plus
              </div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: 'var(--cyan)',
                  lineHeight: 1.1,
                }}
              >
                Version control
                <br />
                meets MLOps
              </div>
            </div>
          </div>

          <p className="sec-label R" style={{ marginTop: '4rem' }}>
            7-week roadmap
          </p>
          <h2 className="sec-title R">Integration timeline.</h2>
          <p className="sec-body R">
            Full week-by-week ML vs Cloud deliverables, demo checklists, and non-negotiables live in{' '}
            <Link to="/05-full-loop">Module 05</Link>. Preview:
          </p>
          <ProgrammeTimeline />

          <div className="prereq-box R">
            <p className="prereq-title">⚡ What you need before you start</p>
            <div className="prereq-grid">
              <div>
                <p className="prereq-col-title ml">ML Team</p>
                <ul className="prereq-list">
                  <li>Python 3.10+ and basic pandas / scikit-learn</li>
                  <li>GitHub account (Module 00) and group repo access</li>
                  <li>pip install mlflow — expanded in Module 01</li>
                  <li>Partner with Cloud team for MLFLOW_TRACKING_URI by Week 2</li>
                </ul>
              </div>
              <div>
                <p className="prereq-col-title cloud">Cloud Team</p>
                <ul className="prereq-list">
                  <li>Google account — GCP free trial / credits</li>
                  <li>Read Module 01 so you know what you are hosting</li>
                  <li>Module 04 is your home base — AWS experience maps cleanly to GCP</li>
                  <li>Never commit service account JSON keys to GitHub</li>
                </ul>
              </div>
            </div>
          </div>

          <ProgressNav />
        </div>
      </section>
    </>
  )
}
