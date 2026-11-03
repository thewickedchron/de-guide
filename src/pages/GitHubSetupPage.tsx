import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ProgressNav } from '../components/ProgressNav'
import { Terminal } from '../components/Terminal'
import { GROUP_REPO, ORG_REPO } from '../content/navigation'
import { CODE } from '../content/codeSamples'

function StepCard({
  num,
  tone,
  title,
  titleClass,
  children,
}: {
  num: number
  tone: string
  title: string
  titleClass: string
  children: ReactNode
}) {
  return (
    <div className="step-card R">
      <div className="step-header">
        <div className={`step-card-num ${tone}`}>{num}</div>
        <div className="step-card-body">
          <div className={`step-card-title ${titleClass}`}>{title}</div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function GitHubSetupPage() {
  return (
    <>
      <PageHero
        module="Module 00"
        tag="Required before Week 1 · All students"
        title={
          <>
            Create your
            <br />
            <span className="ac">GitHub account.</span>
          </>
        }
        subtitle="GitHub holds your training scripts, FastAPI, infra configs, and Dockerfiles. ML and Cloud students push to the same group repo. Complete this module before you start Module 01."
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
          <div className="track-split R">
            <div className="track-card track-card-ml">
              <div className="tc-label">ML Team</div>
              <div className="tc-title">Machine Learning Track</div>
              <div className="tc-item">
                You will push <strong>features.py, train.py, api/main.py</strong> to your group repo
              </div>
              <div className="tc-item">
                Training runs log to MLflow — hosted serverlessly on GCP by your Cloud partner
              </div>
              <div className="tc-item">Commit after every session — GitHub is your source of truth</div>
            </div>
            <div className="track-card track-card-cloud">
              <div className="tc-label">Cloud Team</div>
              <div className="tc-title">Cloud Architecture Track</div>
              <div className="tc-item">
                You will push <strong>infra/, Cloud Run configs, scheduler YAML</strong>
              </div>
              <div className="tc-item">Your infra enables the ML team to train and serve models</div>
              <div className="tc-item">Version-control every gcloud change — no click-ops only</div>
            </div>
          </div>

          <p className="sec-label R">Step-by-step setup</p>

          <StepCard num={1} tone="s-ml" titleClass="t-ml" title="Go to GitHub">
            <p className="step-card-desc">
              Open <strong>github.com</strong> and click <strong>Sign up</strong> in the top right.
            </p>
            <div className="screen-hint">
              <span>🌐</span>
              <span className="screen-hint-text">github.com → Sign up</span>
            </div>
          </StepCard>

          <StepCard num={2} tone="s-cloud" titleClass="t-cloud" title="Enter your details">
            <p className="step-card-desc">GitHub asks for three things:</p>
            <div className="instr-list">
              <div className="instr-item">
                <span className="instr-num">→</span>
                <span>
                  <strong>Email</strong> — personal or student; you must verify it
                </span>
              </div>
              <div className="instr-item">
                <span className="instr-num">→</span>
                <span>
                  <strong>Password</strong> — at least 15 characters
                </span>
              </div>
              <div className="instr-item">
                <span className="instr-num">→</span>
                <span>
                  <strong>Username</strong> — public forever; choose professionally
                </span>
              </div>
            </div>
            <div className="callout warn">
              <p className="callout-label">⚠ Username is permanent</p>
              <p>
                Use your real name or a professional handle — <strong>john-mensah</strong>,{' '}
                <strong>jmensah-dev</strong>. This appears on your CV and every commit.
              </p>
            </div>
          </StepCard>

          <StepCard num={3} tone="s-blue" titleClass="t-blue" title="Verify email and create the account">
            <div className="instr-list">
              <div className="instr-item">
                <span className="instr-num">1.</span>
                <span>Complete GitHub&apos;s verification puzzle</span>
              </div>
              <div className="instr-item">
                <span className="instr-num">2.</span>
                <span>
                  Click <strong>Create account</strong>
                </span>
              </div>
              <div className="instr-item">
                <span className="instr-num">3.</span>
                <span>
                  Enter the <strong>6-digit code</strong> from noreply@github.com
                </span>
              </div>
            </div>
            <div className="callout tip">
              <p className="callout-label">✓ Email not arriving?</p>
              <p>
                Check spam. Without verification you <strong>cannot accept repo invitations</strong>.
              </p>
            </div>
          </StepCard>

          <StepCard num={4} tone="s-navy" titleClass="t-navy" title="Free plan — skip personalisation">
            <p className="step-card-desc">
              Choose <strong>Continue for free</strong>. Skip optional personalisation questions.
            </p>
          </StepCard>

          <StepCard num={5} tone="s-ml" titleClass="t-ml" title="Dashboard ready — accept repo invite">
            <p className="step-card-desc">
              Your dashboard will look empty — that is normal. Your Git Plus facilitator invites you to{' '}
              <strong>{GROUP_REPO}</strong>. Accept the email invitation or you cannot push code.
            </p>
            <div className="callout">
              <p className="callout-label">Inbox checklist</p>
              <p>
                <strong>1.</strong> GitHub email verification · <strong>2.</strong> Repository invitation
                from {ORG_REPO}
              </p>
            </div>
          </StepCard>

          <div className="username-box R">
            <p className="sec-label">Find your username</p>
            <h2 className="sec-title" style={{ fontSize: '2rem' }}>
              Signed in as @your-username
            </h2>
            <div className="instr-list">
              <div className="instr-item">
                <span className="instr-num">1</span>
                <span>Profile menu → top right on github.com</span>
              </div>
              <div className="instr-item">
                <span className="instr-num">2</span>
                <span>
                  First line: <strong>Signed in as @username</strong>
                </span>
              </div>
              <div className="instr-item">
                <span className="instr-num">3</span>
                <span>Share your username <strong>without @</strong> with your team when asked</span>
              </div>
            </div>
          </div>

          <p className="sec-label R" style={{ marginTop: '3rem' }}>
            Clone the starter repo
          </p>
          <p className="sec-body R">
            After accepting the invitation, clone the group repository and copy environment templates.
            Never commit <strong>.env</strong> or GCP keys — they stay in <strong>.gitignore</strong>.
          </p>
          <Terminal title="terminal — clone & local setup" code={CODE.gitClone} />

          <div className="big-warning R">
            <div className="bw-title">Common mistakes</div>
            <div className="bw-item">One GitHub account per person — never share passwords</div>
            <div className="bw-item">Do not commit credentials, API keys, or .env files</div>
            <div className="bw-item">Cloud team: never commit GCP service account JSON</div>
            <div className="bw-item">Accept the repository invitation — required to push</div>
            <div className="bw-item">Verify email before anything else</div>
          </div>

          <div className="callout tip R">
            <p className="callout-label">✓ Next step</p>
            <p>
              Continue to <Link to="/01-what-is-mlflow">Module 01 — What is MLflow?</Link> once your
              repo clone works and <strong>git status</strong> runs cleanly.
            </p>
          </div>

          <ProgressNav />
        </div>
      </section>
    </>
  )
}
