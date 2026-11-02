const CACHE_NOME = "foco-quest-v1";
const ARQUIVOS = ["./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NOME).then(c => c.addAll(ARQUIVOS)));
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys()
      .then(n => Promise.all(n.filter(x => x.startsWith("foco-quest") && x !== CACHE_NOME).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro (pega sempre a versão nova); cache só quando estiver offline.
self.addEventListener("fetch", (e)=>{
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(resp => { const c = resp.clone(); caches.open(CACHE_NOME).then(x => x.put(e.request, c)); return resp; })
      .catch(() => caches.match(e.request))
  );
});

// Tocar no lembrete abre o app.
self.addEventListener("notificationclick", (e)=>{
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(lista => {
      for (const c of lista) if ("focus" in c) return c.focus();
      return self.clients.openWindow("./index.html");
    })
  );
});
