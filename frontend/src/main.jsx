import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "../src/components/theme-provider"
import { BrowserRouter } from 'react-router-dom'
import { store } from '../src/store/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider> 
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
)
