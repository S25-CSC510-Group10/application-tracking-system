self.addEventListener('push', function (event) {
    console.log('Push noti recievied. Processing.')
    const data = event.data?.json() || {};
    const title = data.title || 'New Notification';
    const options = {
        body: data.body || '',
        icon: '/favicon.ico',
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('install', e => {
    console.log('Instaling sw...');
});

self.addEventListener('activate', e => {
    console.log('Activating sw...');
});