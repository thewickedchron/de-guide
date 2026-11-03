export const PROGRAMME_WEEKS = [
  {
    week: 'W1',
    title: 'Setup and agreements',
    ml: 'ML → EDA, agree API contract (JSON schema), confirm MLflow connection plan',
    cloud: 'Cloud → GCP project, billing budget alert, bucket + data uploaded via gcloud storage',
  },
  {
    week: 'W2',
    title: 'First model + MLflow live',
    ml: 'ML → features.py, baseline train.py, first MLflow run visible in UI',
    cloud: 'Cloud → MLflow on Cloud Run + Cloud SQL, share MLFLOW_TRACKING_URI',
  },
  {
    week: 'W3',
    title: 'Improving the model',
    ml: 'ML → Random Forest, evaluation gate, compare runs in MLflow UI',
    cloud: 'Cloud → Firestore for logs, confirm artifacts land in GCS not container disk',
  },
  {
    week: 'W4',
    title: 'API + container',
    ml: 'ML → FastAPI endpoints, Dockerfile, local docker run + Cloud Run deploy',
    cloud: 'Cloud → prediction-api on Cloud Run, IAM for MLflow/GCS access',
  },
  {
    week: 'W5',
    title: 'Full loop working',
    ml: 'ML → Gate rejects bad model on purpose; /reload-model verified',
    cloud: 'Cloud → retrain-job + Scheduler; post-job reload documented or automated',
  },
  {
    week: 'W6',
    title: 'Polish',
    ml: 'ML → model_card.md, React UI or improved API docs, dry-run demo',
    cloud: 'Cloud → Monitoring charts, cost report, backup/rollback story',
  },
  {
    week: 'W7',
    title: 'Final demo',
    ml: 'ML → Live predict + explain loop end-to-end',
    cloud: 'Cloud → Live infra walkthrough, show scheduler + spend',
  },
] as const

export const DEMO_ML_CHECKLIST = [
  'train.py runs with one command: python train.py',
  'Every run in MLflow UI shows params, metrics, and registered model version',
  'Evaluation gate rejects n_estimators=1 (or similar bad config)',
  'Evaluation gate promotes when RMSE improves',
  'GET /health, /model-info, POST /predict, POST /reload-model all work',
  '/model-info version matches MLflow Production in the UI',
  'docker build && docker run succeed locally',
  'model_card.md documents metrics and limitations',
  'No hardcoded secrets, paths, or credentials in git',
]

export const DEMO_CLOUD_CHECKLIST = [
  'MLflow UI loads at the Cloud Run URL',
  'Training runs from ML team appear in that UI',
  'Artifacts visible under gs://…/mlflow-artifacts in gcloud storage ls',
  'Prediction API /health returns 200 on public URL',
  'Firestore documents created after /predict (if logging enabled)',
  'gcloud run jobs execute retrain-job completes successfully',
  'Scheduler shows next run time in console',
  'At least one Monitoring chart uses live Cloud Run metrics',
  'Billing budget alert configured; team knows current spend',
]

export const NON_NEGOTIABLES = [
  'API contract signed by both teams before Week 2 — field names and types frozen.',
  'MLflow server live by end of Week 2 — ML team is blocked without MLFLOW_TRACKING_URI.',
  'Full loop demonstrated in Week 5: schedule → train → gate → promote → reload without manual promotion clicks.',
]
