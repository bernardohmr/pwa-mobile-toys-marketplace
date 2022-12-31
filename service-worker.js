'use strict';

const CACHE_NAME = "brinquedo-app-estatico";

const FILES_TO_CACHE = [
    'css/bootstrap.min.css',
    'css/styles.css',
    'icons/favicon.ico',
    'icons/152.png',
    'imgs/logo.png',
    'imgs/bg001.jpg',
    'imgs/bg002.jpg',
    'imgs/cat_icon.jpg',
    'imgs/offline.png',
    'js/app.js',
    'js/bootstrap.min.js',
    'offline.html'
];

// instalação service worker
self.addEventListener('install', (event) => {
    console.log('Service worker em instalação')

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Service worker está adicionando o cache estático')

            return cache.addAll(FILES_TO_CACHE)
        })
    );

    self.skipWaiting();
});

// ativando service worker
self.addEventListener('activate', event => {
    console.log("Service worker em ativação");

    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key)
                }
            }))
        })
    );

    self.clients.claim();
})

// responder página offline
self.addEventListener('fetch', event => {
    if (event.request.mode !== 'navigate') {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.open(CACHE_NAME).then(cache => cache.match('offline.html'))
        })
    )
});
