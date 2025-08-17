import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'

import rootReducer from './reducer/index.js'

import './index.css'
import App from './App.jsx'

const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  
)
