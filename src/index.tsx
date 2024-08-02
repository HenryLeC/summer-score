import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ScoreBoard from './pages/ScoreBoard';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ScoreFormPage from './pages/ScoreFormPage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ScoreIndex from './pages/ScoreIndex';

const firebaseConfig = {
  apiKey: 'AIzaSyDmxkCcHdEBmFzXRrpyDp_g1oauaPoiOLQ',
  authDomain: 'summer-score.firebaseapp.com',
  projectId: 'summer-score',
  storageBucket: 'summer-score.appspot.com',
  messagingSenderId: '431339571694',
  appId: '1:431339571694:web:77b4bcf8def369626126ff',
  measurementId: 'G-NJLG3P5BRJ',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<ScoreBoard />} />
      <Route path="/score" element={<ScoreIndex />} />
      <Route path="/score/:teamColor" element={<ScoreFormPage />} />
      {/* <Route path="/score/:teamColor/hp" element={<HPCountForm />} /> */}
    </>
  )
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
