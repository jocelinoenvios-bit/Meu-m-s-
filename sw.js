const CACHE_NOME = "financas-v1";
const ARQUIVOS = ["./index.html", "./manifest.json"];

self.addEventListener("install", (e)=>{
  e.waitUntil(
    caches.open(CACHE_NOME).then(cache => cache.addAll(ARQUIVOS))
  );
});

self.addEventListener("fetch", (e)=>{
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
