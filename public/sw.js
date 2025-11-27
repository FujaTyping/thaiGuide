importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

const imageRoute = new workbox.routing.Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'image'
}, new workbox.strategies.CacheFirst());

workbox.routing.registerRoute(imageRoute);

if (workbox) {
    console.log('Workbox loaded successfully');
} else {
    console.log('Workbox failed to load');
}