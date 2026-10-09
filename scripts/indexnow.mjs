// Signale toutes les pages du sitemap à IndexNow (Bing, Yandex, Seznam…).
//
// Pourquoi : la recherche de ChatGPT et Copilot s'appuie sur l'index de Bing.
// Sans signal, Bing découvre un nouvel article ou une nouvelle réalisation au
// bout de plusieurs jours ; avec IndexNow, en quelques minutes.
//
// La clé n'est pas un secret : le protocole exige qu'elle soit publiée dans
// public/<clé>.txt pour prouver qu'on contrôle le domaine.
//
// Usage : node scripts/indexnow.mjs   (après un déploiement qui ajoute des pages)

const HOTE = "www.rgm-dev.site";
const CLE = "c716058451117ced29d11736a0a2f2a3";

const sitemap = await (await fetch(`https://${HOTE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const reponse = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOTE,
    key: CLE,
    keyLocation: `https://${HOTE}/${CLE}.txt`,
    urlList: urls,
  }),
});

// 200 ou 202 : accepté. 403 : la clé n'est pas (encore) en ligne.
console.log(`IndexNow : ${urls.length} URL envoyées, HTTP ${reponse.status}`);
if (!reponse.ok) process.exit(1);
