import React from 'react'
import ReactDOM from 'react-dom'
import './static/index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCKdPPK-ah8cNjprjAK-_wfp_qW57oIyq4",
  authDomain: "j-tracker-d5491.firebaseapp.com",
  projectId: "j-tracker-d5491",
  storageBucket: "j-tracker-d5491.firebasestorage.app",
  messagingSenderId: "335387470365",
  appId: "1:335387470365:web:c646350173e0b26a1c34f4"
};

const app = initializeApp(firebaseConfig);

import { getMessaging, getToken } from "firebase/messaging"

const messaging = getMessaging();
getToken(messaging, { vapidKey: "BG6xUARVeN2ecAI7VHskkyrfWi3j85Gpr0lRgOHyf1Wq-nrabMD2Nik2kDlkLFE__lZJLPfjGigkV-BDcITMcf8" }).then((currentToken) => {
  if (currentToken) {
    console.log('Current tok:', currentToken)
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
