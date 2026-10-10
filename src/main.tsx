import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'
import { authApi } from './modules/auth/infra/api/auth.api.ts'
import { registerSearchHistorySync } from './modules/search/infra/listeners/sync-search-history.listener.ts'
import { store } from './shared/store/index.ts'

registerSearchHistorySync()
store.dispatch(authApi.endpoints.getMe.initiate())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
