# Daisynon

Extension Firefox (et Chrome) pour visualiser les fichiers XML au format **DAISY Text (DTBook)** et les transformer dynamiquement en HTML lisible avec **NVDA** et les lecteurs d'écran.

🔗 [Firefox Add-ons (AMO)](https://addons.mozilla.org/fr/firefox/addon/daisynon/)

---

## Fonctionnalités

- Ouvre les fichiers `.xml` DAISY Text directement dans Firefox
- Génère automatiquement un sommaire de navigation accessible
- Compatible **NVDA** : `role="main"`, ancres SHA-1 stables, lecture naturelle des numéros de page
- Fonctionne **entièrement hors ligne** (`file://`)

---

## Développement local

### Prérequis

- Firefox
- Node.js (pour `web-ext`)

```bash
npm install -g web-ext
```

### Lancer l'extension en mode développement

```bash
web-ext run --source-dir ./src
```

### Structure du projet

```
daisynon/
├── src/                  ← Code source de l'extension
│   ├── manifest.json
│   ├── content.js
│   ├── style.css
│   ├── icons/
│   └── _locales/
├── .github/
│   └── workflows/
│       └── release.yml   ← CI/CD automatique
├── CHANGELOG.md
└── README.md
```

---

## Publier une nouvelle version

### 1. Mettre à jour le numéro de version

Dans `src/manifest.json` :

```json
"version": "1.0.2"
```

### 2. Documenter les changements

Dans `CHANGELOG.md`, ajouter une section pour la nouvelle version.

### 3. Créer un tag Git → déclenche la CI/CD

```bash
git add src/manifest.json CHANGELOG.md
git commit -m "chore: release v1.0.2"
git tag v1.0.2
git push origin main --tags
```

Le workflow GitHub Actions va alors automatiquement :
1. Packager deux `.zip` (Firefox et Chrome)
2. Créer une GitHub Release avec les fichiers
3. Soumettre sur Firefox AMO
4. Uploader sur Chrome Web Store

---

## Configuration des secrets GitHub

Aller dans **Settings > Secrets and variables > Actions** du repo.

### Firefox AMO

Obtenir les clés depuis [addons.mozilla.org/fr/developers/addon/api/key/](https://addons.mozilla.org/fr/developers/addon/api/key/)

| Secret | Description |
|--------|-------------|
| `AMO_JWT_ISSUER` | Clé API AMO (champ "JWT issuer") |
| `AMO_JWT_SECRET` | Secret API AMO (champ "JWT secret") |

### Chrome Web Store

**Étape 1 : Créer un projet Google Cloud**

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un nouveau projet (ex: `daisynon-deploy`)
3. Activer l'API **Chrome Web Store API**

**Étape 2 : Créer des identifiants OAuth2**

1. APIs & Services > Identifiants > Créer des identifiants > ID client OAuth
2. Type : **Application de bureau**
3. Récupérer `Client ID` et `Client Secret`

**Étape 3 : Obtenir le Refresh Token**

```bash
# Remplacer CLIENT_ID par ta valeur
open "https://accounts.google.com/o/oauth2/auth?client_id=CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/chromewebstore&response_type=code"

# Puis échanger le code obtenu contre un refresh token :
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=CODE_OBTENU" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \
  -d "grant_type=authorization_code"
# → récupérer le champ "refresh_token"
```

**Étape 4 : Ajouter les secrets GitHub**

| Secret | Description |
|--------|-------------|
| `CHROME_EXTENSION_ID` | L'ID de l'extension sur le Chrome Web Store |
| `CHROME_CLIENT_ID` | OAuth2 Client ID |
| `CHROME_CLIENT_SECRET` | OAuth2 Client Secret |
| `CHROME_REFRESH_TOKEN` | Refresh token obtenu à l'étape 3 |

> **Note Chrome :** La première soumission sur le Chrome Web Store doit être faite manuellement via le [Developer Dashboard](https://chrome.google.com/webstore/devconsole). Les mises à jour suivantes seront automatisées.

---

## Licence

MIT
