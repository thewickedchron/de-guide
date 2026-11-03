export type CourseModule = {
  num: string
  slug: string
  path: string
  shortName: string
  title: string
  audience: 'ml' | 'cloud' | 'both' | 'setup'
}

export const COURSE_MODULES: CourseModule[] = [
  {
    num: '00',
    slug: 'github-setup',
    path: '/github-setup',
    shortName: 'GitHub',
    title: 'GitHub Setup',
    audience: 'setup',
  },
  {
    num: '01',
    slug: 'what-is-mlflow',
    path: '/01-what-is-mlflow',
    shortName: 'MLflow',
    title: 'What is MLflow?',
    audience: 'ml',
  },
  {
    num: '02',
    slug: 'tracking',
    path: '/02-tracking',
    shortName: 'Tracking',
    title: 'Tracking & Experiments',
    audience: 'ml',
  },
  {
    num: '03',
    slug: 'registry',
    path: '/03-registry',
    shortName: 'Registry',
    title: 'Model Registry',
    audience: 'ml',
  },
  {
    num: '04',
    slug: 'deploy-gcp',
    path: '/04-deploy-gcp',
    shortName: 'GCP',
    title: 'Deploy on GCP',
    audience: 'cloud',
  },
  {
    num: '05',
    slug: 'full-loop',
    path: '/05-full-loop',
    shortName: 'Loop',
    title: 'Full Retraining Loop',
    audience: 'both',
  },
  {
    num: '06',
    slug: 'api-backend',
    path: '/06-api-backend',
    shortName: 'API',
    title: 'FastAPI Backend',
    audience: 'ml',
  },
  {
    num: '07',
    slug: 'react-frontend',
    path: '/07-react-frontend',
    shortName: 'React',
    title: 'React Frontend',
    audience: 'both',
  },
]

export const ORG_REPO = 'git-plus'
export const GROUP_REPO = `${ORG_REPO}/your-team-repo`
