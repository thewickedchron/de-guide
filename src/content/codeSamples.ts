export const CODE = {
  pipInstall: `# Install once (Python 3.10+ recommended)
pip install "mlflow>=2.17" scikit-learn pandas numpy python-dotenv`,

  firstExperiment: `import mlflow
import mlflow.sklearn
from sklearn.linear_model import LinearRegression
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import numpy as np

# Local dev: mlflow ui (see below). Production: Cloud Run URL from your cloud partner.
mlflow.set_tracking_uri("http://127.0.0.1:5000")
mlflow.set_experiment("my-first-experiment")

X, y = make_regression(n_samples=1000, n_features=10, noise=0.1)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

with mlflow.start_run(run_name="baseline-linear") as run:
    mlflow.log_param("model_type", "LinearRegression")
    mlflow.log_param("test_size", 0.2)

    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))

    mlflow.log_metric("rmse", rmse)
    mlflow.sklearn.log_model(model, "model")

    print(f"Run ID: {run.info.run_id}")
    print(f"RMSE:   {rmse:.4f}")`,

  mlflowUi: `# Start the MLflow UI locally (keep this terminal open)
mlflow server --host 127.0.0.1 --port 5000

# Open http://127.0.0.1:5000`,

  trainPy: `import os
import mlflow
import mlflow.sklearn
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from dotenv import load_dotenv
from src.features import clean, engineer, get_feature_columns

load_dotenv()

MLFLOW_URI = os.getenv("MLFLOW_TRACKING_URI", "http://127.0.0.1:5000")
EXPERIMENT_NAME = os.getenv("MLFLOW_EXPERIMENT_NAME", "taxi-duration")
DATA_PATH = os.getenv("DATA_PATH", "data/train.csv")
MODEL_NAME = os.getenv("MLFLOW_MODEL_NAME", "taxi-duration-model")
N_ESTIMATORS = int(os.getenv("N_ESTIMATORS", "100"))
MAX_DEPTH_RAW = os.getenv("MAX_DEPTH", "10")
MAX_DEPTH = None if MAX_DEPTH_RAW in ("None", "", "null") else int(MAX_DEPTH_RAW)

mlflow.set_tracking_uri(MLFLOW_URI)
mlflow.set_experiment(EXPERIMENT_NAME)


def train() -> None:
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    df = clean(df)
    df = engineer(df)

    features = get_feature_columns()
    X = df[features]
    y = df["trip_duration"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training on {len(X_train):,} rows")

    with mlflow.start_run() as run:
        mlflow.log_param("model_type", "RandomForestRegressor")
        mlflow.log_param("n_estimators", N_ESTIMATORS)
        mlflow.log_param("max_depth", MAX_DEPTH)
        mlflow.log_param("features", str(features))
        mlflow.log_param("train_rows", len(X_train))

        model = RandomForestRegressor(
            n_estimators=N_ESTIMATORS,
            max_depth=MAX_DEPTH,
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        print(f"RMSE: {rmse:.2f} seconds")

        mlflow.log_metric("rmse", rmse)
        mlflow.sklearn.log_model(
            model, "model", registered_model_name=MODEL_NAME
        )

        promote_if_better(run.info.run_id, rmse)


if __name__ == "__main__":
    train()`,

  promoteIfBetter: `def promote_if_better(run_id: str, new_rmse: float) -> None:
    """Only promote to Production if this model beats the current one."""
    client = mlflow.tracking.MlflowClient()

    try:
        prod_versions = client.get_latest_versions(
            MODEL_NAME, stages=["Production"]
        )
        if prod_versions:
            prod_run = client.get_run(prod_versions[0].run_id)
            current_rmse = prod_run.data.metrics["rmse"]
            if new_rmse >= current_rmse:
                print(
                    f"New RMSE {new_rmse:.2f} >= current {current_rmse:.2f}. "
                    "NOT promoting."
                )
                return
            print(f"New RMSE {new_rmse:.2f} < current {current_rmse:.2f}. Promoting.")
    except Exception:
        print("No Production model found. Promoting first version automatically.")

    all_versions = client.search_model_versions(f"name='{MODEL_NAME}'")
    latest = sorted(all_versions, key=lambda v: int(v.version))[-1]

    client.transition_model_version_stage(
        name=MODEL_NAME,
        version=latest.version,
        stage="Production",
        archive_existing_versions=True,
    )
    print(f"Promoted version {latest.version} to Production (RMSE: {new_rmse:.2f})")`,

  apiMain: `import os
from contextlib import asynccontextmanager

import mlflow
import mlflow.sklearn
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from src.features import clean, engineer, get_feature_columns

MODEL_NAME = os.getenv("MLFLOW_MODEL_NAME", "taxi-duration-model")

model_state: dict = {
    "model": None,
    "version": None,
    "rmse": None,
    "trained_at": None,
}


def load_production_model() -> None:
    mlflow.set_tracking_uri(os.environ["MLFLOW_TRACKING_URI"])
    client = mlflow.tracking.MlflowClient()
    versions = client.get_latest_versions(MODEL_NAME, stages=["Production"])
    if not versions:
        raise RuntimeError("No Production model in MLflow Registry")

    v = versions[0]
    model_state["model"] = mlflow.sklearn.load_model(
        f"models:/{MODEL_NAME}/Production"
    )
    model_state["version"] = v.version
    run = client.get_run(v.run_id)
    model_state["rmse"] = run.data.metrics.get("rmse")
    model_state["trained_at"] = v.last_updated_timestamp
    print(f"Loaded model v{v.version} (RMSE: {model_state['rmse']})")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_production_model()
    yield


app = FastAPI(title="Taxi Duration API", lifespan=lifespan)


class PredictRequest(BaseModel):
    pickup_latitude: float
    pickup_longitude: float
    dropoff_latitude: float
    dropoff_longitude: float
    passenger_count: int = Field(ge=1, le=6)


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model_state["model"] is not None}


@app.get("/model-info")
def model_info():
    return {
        "model_version": model_state["version"],
        "rmse": model_state["rmse"],
        "trained_at": model_state["trained_at"],
    }


@app.post("/reload-model")
def reload_model():
    load_production_model()
    return {"status": "reloaded", "new_version": str(model_state["version"])}


@app.post("/predict")
def predict(body: PredictRequest):
    if model_state["model"] is None:
        raise HTTPException(503, "Model not loaded")

    row = pd.DataFrame([body.model_dump()])
    row = clean(row)
    row = engineer(row)
    features = get_feature_columns()
    X = row[features]
    prediction = float(model_state["model"].predict(X)[0])
    return {"trip_duration_seconds": prediction, "model_version": model_state["version"]}`,

  gcloudAuth: `# Install: https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud projects describe YOUR_PROJECT_ID`,

  gcloudEnable: `gcloud services enable \\
  run.googleapis.com \\
  storage.googleapis.com \\
  firestore.googleapis.com \\
  cloudscheduler.googleapis.com \\
  artifactregistry.googleapis.com \\
  sqladmin.googleapis.com \\
  cloudbuild.googleapis.com \\
  secretmanager.googleapis.com`,

  gcsSetup: `# Use gcloud storage (gsutil is legacy — do not use in new projects)
export PROJECT_ID="your-project-id"
export GROUP_NAME="group-a1"
export REGION="us-central1"
export BUCKET_NAME="\${PROJECT_ID}-\${GROUP_NAME}-artifacts"

gcloud storage buckets create "gs://\${BUCKET_NAME}" \\
  --location="\${REGION}" \\
  --uniform-bucket-level-access

# Optional prefix markers (GCS is a flat namespace; these help your team find paths)
printf 'keep' | gcloud storage cp - "gs://\${BUCKET_NAME}/data/.keep"
printf 'keep' | gcloud storage cp - "gs://\${BUCKET_NAME}/mlflow-artifacts/.keep"

gcloud storage cp data/train.csv "gs://\${BUCKET_NAME}/data/train.csv"

gcloud storage ls "gs://\${BUCKET_NAME}/**"

echo "DATA_PATH=gs://\${BUCKET_NAME}/data/train.csv"`,

  mlflowDockerfile: `# infra/mlflow/Dockerfile — persistent backend (not sqlite on Cloud Run)
FROM ghcr.io/mlflow/mlflow:v2.17.2

# Cloud Run sets PORT; MLflow listens on 5000 in container
ENV PORT=5000
CMD mlflow server \\
  --host 0.0.0.0 \\
  --port 5000 \\
  --backend-store-uri \${MLFLOW_BACKEND_STORE_URI} \\
  --default-artifact-root \${MLFLOW_DEFAULT_ARTIFACT_ROOT} \\
  --serve-artifacts`,

  mlflowDeploy: `# 1) Create Cloud SQL PostgreSQL (db-f1-micro fits free trial credits)
gcloud sql instances create mlflow-db \\
  --database-version=POSTGRES_15 \\
  --tier=db-f1-micro \\
  --region=\${REGION}

gcloud sql databases create mlflow --instance=mlflow-db
gcloud sql users create mlflow \\
  --instance=mlflow-db \\
  --password='CHOOSE_A_STRONG_PASSWORD'

# Store password in Secret Manager (never commit it)
echo -n 'CHOOSE_A_STRONG_PASSWORD' | gcloud secrets create mlflow-db-password --data-file=-

# 2) Build & deploy MLflow tracking server to Cloud Run (serverless)
gcloud builds submit infra/mlflow --tag \${REGION}-docker.pkg.dev/\${PROJECT_ID}/ml-images/mlflow:latest

gcloud run deploy mlflow-server \\
  --image \${REGION}-docker.pkg.dev/\${PROJECT_ID}/ml-images/mlflow:latest \\
  --region \${REGION} \\
  --allow-unauthenticated \\
  --port 5000 \\
  --memory 2Gi \\
  --add-cloudsql-instances \${PROJECT_ID}:\${REGION}:mlflow-db \\
  --set-env-vars MLFLOW_DEFAULT_ARTIFACT_ROOT=gs://\${BUCKET_NAME}/mlflow-artifacts \\
  --set-env-vars MLFLOW_BACKEND_STORE_URI=postgresql+psycopg2://mlflow:PASSWORD@/mlflow?host=/cloudsql/\${PROJECT_ID}:\${REGION}:mlflow-db \\
  --set-secrets MLFLOW_BACKEND_STORE_URI=mlflow-db-uri:latest

# Share the Service URL as MLFLOW_TRACKING_URI with your ML team`,

  apiDeploy: `gcloud artifacts repositories create ml-images \\
  --repository-format=docker \\
  --location=\${REGION}

gcloud auth configure-docker \${REGION}-docker.pkg.dev

docker build -t prediction-api .
docker tag prediction-api \\
  \${REGION}-docker.pkg.dev/\${PROJECT_ID}/ml-images/prediction-api:latest
docker push \\
  \${REGION}-docker.pkg.dev/\${PROJECT_ID}/ml-images/prediction-api:latest

gcloud run deploy prediction-api \\
  --image \${REGION}-docker.pkg.dev/\${PROJECT_ID}/ml-images/prediction-api:latest \\
  --region \${REGION} \\
  --allow-unauthenticated \\
  --port 8080 \\
  --memory 2Gi \\
  --set-env-vars MLFLOW_TRACKING_URI=https://mlflow-server-xxxxx-\${REGION}.run.app \\
  --set-env-vars MLFLOW_MODEL_NAME=taxi-duration-model

curl https://YOUR_API_URL/health`,

  retrainJob: `gcloud run jobs create retrain-job \\
  --image \${REGION}-docker.pkg.dev/\${PROJECT_ID}/ml-images/prediction-api:latest \\
  --region \${REGION} \\
  --command python \\
  --args train.py \\
  --memory 4Gi \\
  --task-timeout 3600 \\
  --set-env-vars MLFLOW_TRACKING_URI=https://mlflow-server-xxxxx-\${REGION}.run.app \\
  --set-env-vars DATA_PATH=gs://\${BUCKET_NAME}/data/train.csv \\
  --set-env-vars N_ESTIMATORS=100

gcloud run jobs execute retrain-job --region \${REGION} --wait

# Schedule weekly retrain (Cloud Scheduler → Cloud Run Jobs v2 run endpoint)
gcloud scheduler jobs create http retrain-weekly \\
  --location \${REGION} \\
  --schedule="0 0 * * 0" \\
  --uri="https://run.googleapis.com/v2/projects/\${PROJECT_ID}/locations/\${REGION}/jobs/retrain-job:run" \\
  --http-method POST \\
  --oauth-service-account-email="\${PROJECT_ID}@appspot.gserviceaccount.com" \\
  --oauth-token-scope="https://www.googleapis.com/auth/cloud-platform"

curl -X POST https://YOUR_API_URL/reload-model`,

  gitClone: `# After accepting the org invitation email:
git clone git@github.com:git-plus/your-team-repo.git
cd your-team-repo
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
# Fill MLFLOW_TRACKING_URI once Cloud team shares the Cloud Run URL`,

  gitWorkflow: `# Daily workflow — both tracks
git checkout -b feature/your-name-short-description
# edit files, then:
git status
git add src/features.py train.py   # never git add .env or *.json keys
git commit -m "Add feature engineering for trip distance"
git push -u origin feature/your-name-short-description
# Open a Pull Request on GitHub; teammate reviews; merge to main`,

  projectTree: `your-team-repo/
├── .env.example          # committed — documents required env vars
├── .gitignore              # .env, __pycache__, .venv, *.json keys
├── requirements.txt
├── train.py                # ML — entry point for training + gate
├── Dockerfile              # ML — same image for API + Cloud Run Job
├── model_card.md           # ML — model purpose, metrics, limits
├── api/
│   └── main.py             # FastAPI app
├── src/
│   └── features.py         # clean(), engineer(), get_feature_columns()
├── infra/                  # Cloud — scripts & deploy notes
│   ├── mlflow/Dockerfile
│   └── scheduler.md
├── data/                   # local only — sample CSV (or download script)
│   └── train.csv
└── frontend/               # optional React app (Module 07)`,

  envExample: `# .env.example — copy to .env (never commit .env)
MLFLOW_TRACKING_URI=http://127.0.0.1:5000
MLFLOW_EXPERIMENT_NAME=taxi-duration-group-a1
MLFLOW_MODEL_NAME=taxi-duration-model
DATA_PATH=data/train.csv
N_ESTIMATORS=100
MAX_DEPTH=10
# Production (Cloud Run / Job):
# MLFLOW_TRACKING_URI=https://mlflow-server-xxxxx-uc.a.run.app
# DATA_PATH=gs://YOUR_BUCKET/data/train.csv`,

  requirementsTxt: `# requirements.txt — pin major versions for reproducibility
mlflow>=2.17,<3
scikit-learn>=1.4
pandas>=2.0
numpy>=1.26
python-dotenv>=1.0
fastapi>=0.110
uvicorn[standard]>=0.27
pydantic>=2.0
gcsfs>=2024.2.0
google-cloud-firestore>=2.14
httpx>=0.27`,

  featuresPy: `# src/features.py — shared by train.py and api/main.py
import numpy as np
import pandas as pd

REQUIRED_RAW = [
    "pickup_latitude", "pickup_longitude",
    "dropoff_latitude", "dropoff_longitude",
    "passenger_count", "trip_duration",
]


def clean(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    missing = [c for c in REQUIRED_RAW if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    df = df.dropna(subset=REQUIRED_RAW)
    df = df[df["passenger_count"].between(1, 6)]
    df = df[df["trip_duration"] > 0]
    return df


def engineer(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["haversine_km"] = _haversine(
        df["pickup_latitude"], df["pickup_longitude"],
        df["dropoff_latitude"], df["dropoff_longitude"],
    )
    df["log_passengers"] = np.log1p(df["passenger_count"])
    return df


def get_feature_columns() -> list[str]:
    return ["haversine_km", "log_passengers", "passenger_count"]


def _haversine(lat1, lon1, lat2, lon2) -> pd.Series:
    r = 6371.0
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = np.radians(lat2 - lat1)
    dl = np.radians(lon2 - lon1)
    a = np.sin(dphi / 2) ** 2 + np.cos(phi1) * np.cos(phi2) * np.sin(dl / 2) ** 2
    return 2 * r * np.arcsin(np.sqrt(a))`,

  loadDataHelper: `# Add to train.py — read local CSV or GCS via pandas + gcsfs
import pandas as pd

def load_table(path: str) -> pd.DataFrame:
    if path.startswith("gs://"):
        return pd.read_csv(path, storage_options={"token": "cloud"})
    return pd.read_csv(path)

# In train(): df = load_table(DATA_PATH)`,

  logArtifacts: `# Inside mlflow.start_run() after training — optional but recommended
import matplotlib.pyplot as plt

fi = pd.Series(model.feature_importances_, index=features)
fi.sort_values(ascending=True).tail(15).plot(kind="barh")
plt.tight_layout()
plt.savefig("feature_importance.png")
mlflow.log_artifact("feature_importance.png")
plt.close()`,

  apiContract: `# API contract (agree in Week 1) — POST /predict body:
{
  "pickup_latitude": 40.75,
  "pickup_longitude": -73.98,
  "dropoff_latitude": 40.68,
  "dropoff_longitude": -73.95,
  "passenger_count": 2
}

# Response:
{
  "trip_duration_seconds": 612.4,
  "model_version": "3"
}`,

  dockerfileApi: `# Dockerfile — used for prediction-api AND retrain-job (same image)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY train.py model_card.md ./
COPY src/ src/
COPY api/ api/
ENV PYTHONUNBUFFERED=1
EXPOSE 8080
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8080"]`,

  mlflowMetricsRoute: `# Add to api/main.py — surface MLflow experiment metrics
import os
import mlflow
from mlflow.tracking import MlflowClient

@app.get("/experiments/runs")
def list_recent_runs(limit: int = 10):
    mlflow.set_tracking_uri(os.environ["MLFLOW_TRACKING_URI"])
    exp_name = os.getenv("MLFLOW_EXPERIMENT_NAME", "taxi-duration")
    client = MlflowClient()
    exp = client.get_experiment_by_name(exp_name)
    if exp is None:
        return {"runs": []}
    runs = client.search_runs(
        experiment_ids=[exp.experiment_id],
        order_by=["attributes.start_time DESC"],
        max_results=limit,
    )
    return {
        "runs": [
            {
                "run_id": r.info.run_id,
                "status": r.info.status,
                "rmse": r.data.metrics.get("rmse"),
                "params": dict(r.data.params),
            }
            for r in runs
        ]
    }`,

  firestoreLog: `# api/logging.py — call from /predict
from google.cloud import firestore
import os
from datetime import datetime, timezone

def log_prediction(payload: dict, response: dict) -> None:
    if os.getenv("ENABLE_FIRESTORE_LOG", "0") != "1":
        return
    db = firestore.Client(project=os.environ["GCP_PROJECT_ID"])
    db.collection("predictions").add({
        "ts": datetime.now(timezone.utc).isoformat(),
        "input": payload,
        "output": response,
    })`,

  firestoreSetup: `# One-time Firestore (Native mode) — Cloud team
gcloud firestore databases create --location=\${REGION} --type=firestore-native

# Grant Cloud Run service account data access if needed:
# roles/datastore.user on the project`,

  billingBudget: `# Console: Billing → Budgets & alerts → Create budget
# Recommended: budget amount = expected cap (e.g. $25), alerts at 50%, 90%, 100%
# Add team email + Slack if available`,

  cloudSqlSecret: `# Build MLFLOW_BACKEND_STORE_URI without putting password in shell history
DB_PASS="$(gcloud secrets versions access latest --secret=mlflow-db-password)"
export MLFLOW_BACKEND_STORE_URI="postgresql+psycopg2://mlflow:\${DB_PASS}@/mlflow?host=/cloudsql/\${PROJECT_ID}:\${REGION}:mlflow-db"

# Deploy with:
# gcloud run deploy mlflow-server ... --set-env-vars MLFLOW_BACKEND_STORE_URI=\${MLFLOW_BACKEND_STORE_URI}`,

  serviceAccount: `# Dedicated runtime SA (recommended over default compute SA)
gcloud iam service-accounts create mlflow-run \\
  --display-name="MLflow Cloud Run"

gcloud projects add-iam-policy-binding \${PROJECT_ID} \\
  --member="serviceAccount:mlflow-run@\${PROJECT_ID}.iam.gserviceaccount.com" \\
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding \${PROJECT_ID} \\
  --member="serviceAccount:mlflow-run@\${PROJECT_ID}.iam.gserviceaccount.com" \\
  --role="roles/storage.objectAdmin"

# Pass to deploy: --service-account=mlflow-run@\${PROJECT_ID}.iam.gserviceaccount.com`,

  reactAppFull: `// frontend/src/App.tsx — full minimal UI
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL as string;

type ModelInfo = { model_version: string; rmse: number | null };

export default function App() {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(\`\${API}/model-info\`).then(r => r.json()).then(setInfo);
  }, []);

  async function predict(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch(\`\${API}/predict\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    const data = await res.json();
    setSeconds(data.trip_duration_seconds);
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Git Plus — Trip predictor</h1>
      {info && <p>Model v{info.model_version} · RMSE {info.rmse?.toFixed(1)}</p>}
      <form onSubmit={predict}>
        {["pickup_latitude","pickup_longitude","dropoff_latitude","dropoff_longitude","passenger_count"].map(name => (
          <label key={name} style={{ display: "block", marginBottom: 8 }}>
            {name}
            <input name={name} required style={{ width: "100%" }} />
          </label>
        ))}
        <button type="submit">Predict</button>
      </form>
      {seconds != null && <p>Estimated duration: {Math.round(seconds)} sec</p>}
      {error && <pre style={{ color: "crimson" }}>{error}</pre>}
    </main>
  );
}`,

  reactApp: `// frontend/src/App.tsx — calls your Cloud Run API
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const res = await fetch(\`\${API_URL}/predict\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setResult(data.trip_duration_seconds);
    setLoading(false);
  }

  return (
    <main>
      <h1>Taxi duration predictor</h1>
      <form onSubmit={onSubmit}>{/* lat/lon fields */}</form>
      {loading ? <p>Predicting…</p> : result != null && <p>{result.toFixed(0)} sec</p>}
    </main>
  );
}`,
} as const
