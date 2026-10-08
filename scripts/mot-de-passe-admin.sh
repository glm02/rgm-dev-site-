#!/usr/bin/env bash
# Définit le mot de passe du compte admin, sans passer par un email.
#
# Pourquoi : le service d'email intégré à Supabase n'envoie que quelques liens
# par heure ; tant qu'un SMTP (Resend) n'est pas branché, le lien magique peut
# être refusé. Ce script pose le mot de passe directement via l'API admin de
# Supabase, avec la clé service_role lue sur Vercel.
#
# Le mot de passe est saisi masqué, jamais affiché, jamais écrit sur disque.
# La clé service_role reste en mémoire le temps du script.
#
# Usage (Git Bash, depuis la racine du dépôt, `vercel` connecté) :
#   bash scripts/mot-de-passe-admin.sh [email]

set -euo pipefail

EMAIL="${1:-glm07rafael@gmail.com}"
PROJET_VERCEL="rgm-dev-site-"
EQUIPE_VERCEL="team_DWMpZa969N1SHA7VVt55yjOM"

dossier=$(mktemp -d)
trap 'rm -rf "$dossier"' EXIT
umask 077

echo "Lecture des variables de production sur Vercel…"
(
  cd "$dossier"
  vercel link --yes --scope "$EQUIPE_VERCEL" --project "$PROJET_VERCEL" >/dev/null 2>&1
  vercel env pull .env --environment=production --yes >/dev/null 2>&1
)

lire() { grep "^$1=" "$dossier/.env" | head -1 | cut -d= -f2- | sed 's/^"//; s/"$//'; }
SUPABASE_URL=$(lire NEXT_PUBLIC_SUPABASE_URL)
SERVICE_KEY=$(lire SUPABASE_SERVICE_ROLE_KEY)
rm -f "$dossier/.env"

if [ -z "$SUPABASE_URL" ]; then
  echo "NEXT_PUBLIC_SUPABASE_URL introuvable sur Vercel." >&2
  exit 1
fi

# Vercel ne renvoie pas la valeur d'une variable marquée « sensible » : dans ce
# cas on la demande, masquée. Elle se copie dans Supabase → Settings → API Keys.
if [ -z "$SERVICE_KEY" ]; then
  read -r -s -p "Clé service_role Supabase (saisie masquée) : " SERVICE_KEY; echo
fi
[ -n "$SERVICE_KEY" ] || { echo "Clé vide." >&2; exit 1; }

read -r -s -p "Nouveau mot de passe pour $EMAIL (10 caractères min.) : " MDP; echo
read -r -s -p "Confirmation : " MDP2; echo
if [ "$MDP" != "$MDP2" ]; then echo "Les deux saisies diffèrent." >&2; exit 1; fi
if [ "${#MDP}" -lt 10 ]; then echo "Trop court." >&2; exit 1; fi

# Le traitement JSON est fait par Node (jq n'est pas installé partout). Les
# valeurs passent par l'environnement, jamais par la ligne de commande, pour
# ne pas apparaître dans la liste des processus.
SUPABASE_URL="$SUPABASE_URL" SERVICE_KEY="$SERVICE_KEY" EMAIL="$EMAIL" MDP="$MDP" node --input-type=module -e '
const { SUPABASE_URL: url, SERVICE_KEY: cle, EMAIL: email, MDP: mdp } = process.env;
const entetes = { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };

const liste = await fetch(`${url}/auth/v1/admin/users?per_page=1000`, { headers: entetes });
if (!liste.ok) { console.error(`Lecture des comptes impossible (HTTP ${liste.status}).`); process.exit(1); }
const { users } = await liste.json();
const compte = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

const reponse = compte
  ? await fetch(`${url}/auth/v1/admin/users/${compte.id}`, {
      method: "PUT", headers: entetes,
      body: JSON.stringify({ password: mdp, email_confirm: true }),
    })
  : await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST", headers: entetes,
      body: JSON.stringify({ email, password: mdp, email_confirm: true }),
    });

if (!reponse.ok) {
  const corps = await reponse.json().catch(() => ({}));
  console.error(`Échec (HTTP ${reponse.status}) : ${corps.msg ?? corps.message ?? "erreur inconnue"}`);
  process.exit(1);
}
console.log(compte ? "Mot de passe mis à jour." : "Compte créé avec ce mot de passe.");

const profil = await fetch(`${url}/rest/v1/profils?email=eq.${encodeURIComponent(email)}&select=role`, { headers: entetes });
const lignes = profil.ok ? await profil.json() : [];
if (lignes[0]?.role === "admin") console.log("Rôle : admin. Connexion sur /connexion, onglet « Mot de passe ».");
else console.log(`Attention : rôle actuel « ${lignes[0]?.role ?? "aucun profil"} ». La migration 0004_droits.sql est-elle appliquée ?`);
'
