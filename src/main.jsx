// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import store from './redux/store.js'
// import { Provider } from 'react-redux';
// // import store from './store';
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//      <App />
//     </Provider>
    
//   </StrictMode>,
// )
// src/main.jsx
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import Dashboard from './components/Dashboard.jsx'; // <- Add this
// import store from './redux/store.js'
// import { Provider } from 'react-redux'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   </StrictMode>
// )
// src/main.jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import store from './redux/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
