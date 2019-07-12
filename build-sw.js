const glob = require ('glob');
const fs = require ('fs');

const dest = 'dist/sw.js';
const staticAssetsCacheName = 'todo-assets';
const dynamicCacheName = 'todo-dynamic';

let staticAssetsCacheFiles = glob
  .sync ('dist/**/*')
  .map (path => {
    return path.slice (5);
  })
  .filter (file => {
    if (/\.gz$/.test (file)) return false;
    if (/sw\.js$/.test (file)) return false;
    if (!/\.+/.test (file)) return false;
    return true;
  });

const stringFileCachesArray = JSON.stringify (staticAssetsCacheFiles);

const serviceWorkScript = `
    var staticAssetsCacheName = '${staticAssetsCacheName}';
    var dynamicCacheName = '${dynamicCacheName}';

    self.addEventListener('install', function (event) {
        self.skipWaiting();
        event.waitUntil(
          caches.open(staticAssetsCacheName).then(function (cache) {
            cache.addAll([
                '/',
                ${stringFileCachesArray.slice (1, stringFileCachesArray.length - 1)}
            ]
            );
          }).catch((error) => {
            console.log('Error caching static assets:', error);
          })
        );
      });
    
      self.addEventListener('activate', function (event) {
        if (self.clients && clients.claim) {
          clients.claim();
        }
        event.waitUntil(
          caches.keys().then(function (cacheNames) {
            return Promise.all(
              cacheNames.filter(function (cacheName) {
                return (cacheName.startsWith('todo-')) && cacheName !== staticAssetsCacheName;
              })
              .map(function (cacheName) {
                return caches.delete(cacheName);
              })
            ).catch((error) => {
                console.log('Some error occurred while removing existing cache:', error);
            });
          }).catch((error) => {
            console.log('Some error occurred while removing existing cache:', error);
        }));
      });
    
      self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request).then((response) => {
            return response || fetch(event.request)
              .then((fetchResponse) => {
                  return cacheDynamicRequestData(dynamicCacheName, event.request.url, fetchResponse.clone());
              }).catch((error) => {
                console.log(error);
              });
          }).catch((error) => {
            console.log(error);
          })
        );
      });
    
      function cacheDynamicRequestData(dynamicCacheName, url, fetchResponse) {
        return caches.open(dynamicCacheName)
          .then((cache) => {
            cache.put(url, fetchResponse.clone());
            return fetchResponse;
          }).catch((error) => {
            console.log(error);
          });
      }
  `;

fs.writeFile (dest, serviceWorkScript, function (error) {
  if (error) {
    console.error (error);
    return;
  }
  console.log ('Service work write success');
});
