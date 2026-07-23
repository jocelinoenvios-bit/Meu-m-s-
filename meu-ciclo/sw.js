const CACHE_NOME = "meu-ciclo-v1";
const ARQUIVOS = ["./index.html", "./manifest.json"];

self.addEventListener("install", (e)=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NOME).then(cache => cache.addAll(ARQUIVOS))
  );
});

// Remove caches de versões antigas do app para não correr o risco de
// servir uma versão desatualizada por engano, e assume o controle
// imediatamente das abas já abertas.
self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== CACHE_NOME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Busca sempre a versão mais nova na rede primeiro (e atualiza o cache);
// só usa o cache salvo quando o usuário está offline.
self.addEventListener("fetch", (e)=>{
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copia = resp.clone();
        caches.open(CACHE_NOME).then(cache => cache.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
