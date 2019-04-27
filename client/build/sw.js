if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    console.log("Workbox is loaded");

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "b0a62e24a25f319ba0422d6537abf010"
  },
  {
    "url": "precache-manifest.fe21f69698f8157451db982b05acb120.js",
    "revision": "fe21f69698f8157451db982b05acb120"
  },
  {
    "url": "service-worker.js",
    "revision": "1de43a4b733bab4bc7cf0608e904e0b3"
  },
  {
    "url": "static/css/main.627c13a9.chunk.css",
    "revision": "3fa07bcc971272eef3efee5084f31c91"
  },
  {
    "url": "static/js/2.5d5384f6.chunk.js",
    "revision": "873c98447fa6bb8617bd235cd801c576"
  },
  {
    "url": "static/js/main.88baded0.chunk.js",
    "revision": "84aa744c8dbc53d5e38526c9ec9c2869"
  },
  {
    "url": "static/js/runtime~main.a8a9905a.js",
    "revision": "238c9148d722c1b6291779bd879837a1"
  }
]);

    /* custom cache rules*/
    workbox.routing.registerNavigationRoute("/index.html", {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/]
    });

    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          })
        ]
      })
    );
  } else {
    console.log("Workbox could not be loaded. No Offline support");
  }
}
