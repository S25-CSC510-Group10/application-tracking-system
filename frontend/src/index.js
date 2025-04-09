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

const publicVapidKey = 'BFzhADCx0ap9hQzsZD9qZ_bEKLh9eFZSFmljL5o5HTdY-whZ80yGTBlaKev9warqy58ZRJtWpRreTG9n_e2xg7Y';

async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    // register the service worker if necessary
    await navigator.serviceWorker.register('/service-worker.js');
    console.log('SW registered if needed.')

    // wait for the service worker to be ready before subscribing/continuing
    const swRegistration = await navigator.serviceWorker.ready;
    console.log('SW ready.')

    // request notification permission if needed
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Push notification permission denied');
      return;
    }

    // check if the current user is subscribed
    const response = await fetch('http://localhost:5000/subscribe', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        userid: localStorage.getItem('userId'),
        Authorization: `Bearer ${localStorage.getItem('userId')}`
      },
    })

    if (response.ok) {
      const data = await response.json();
      console.log("data:", data)

      if (!data.subscribed) {
        const subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        console.log('User not subscribed. Subscription generated.')

        // Send to backend
        await fetch('http://localhost:5000/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json',
            userid: localStorage.getItem('userId'),
            Authorization: `Bearer ${localStorage.getItem('userId')}`
          },

        });
        console.log('Subscription sent to backend.')
      }
    }
  }
}

subscribeUser();

// Helper function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
