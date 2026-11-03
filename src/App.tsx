import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { GitHubSetupPage } from './pages/GitHubSetupPage'
import { HomePage } from './pages/HomePage'
import { Module01Page } from './pages/Module01Page'
import { Module02Page } from './pages/Module02Page'
import { Module03Page } from './pages/Module03Page'
import { Module04Page } from './pages/Module04Page'
import { Module05Page } from './pages/Module05Page'
import { Module06Page } from './pages/Module06Page'
import { Module07Page } from './pages/Module07Page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="github-setup" element={<GitHubSetupPage />} />
          <Route path="01-what-is-mlflow" element={<Module01Page />} />
          <Route path="02-tracking" element={<Module02Page />} />
          <Route path="03-registry" element={<Module03Page />} />
          <Route path="04-deploy-gcp" element={<Module04Page />} />
          <Route path="05-full-loop" element={<Module05Page />} />
          <Route path="06-api-backend" element={<Module06Page />} />
          <Route path="07-react-frontend" element={<Module07Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
