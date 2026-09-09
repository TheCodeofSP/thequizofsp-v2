# The Quiz of SP

Quiz full-stack rétro conçu pour découvrir l'univers de SP en trois niveaux, avec une mécanique finale « quitte ou double » et un classement persistant.

## Stack

- **Web** : React 19, React Router, Vite, Sass
- **API** : Node.js, Express 5, Mongoose, MongoDB Atlas
- **Qualité** : ESLint, tests natifs Node.js, validation métier, CI GitHub
- **Déploiement** : deux projets Vercel depuis un monorepo

## Arborescence

```text
.
├── api/         API REST, modèle MongoDB et tests métier
├── web/         interface React et styles Sass mobile-first
├── docs/        guides de déploiement et de migration
└── .github/     intégration continue
```

## Installation

```bash
npm install
cp api/.env.example api/.env
cp web/.env.example web/.env
```

Lancer les deux applications dans deux terminaux :

```bash
npm run dev:api
npm run dev:web
```

Le site est disponible sur `http://localhost:5173` et l'API sur `http://localhost:5050`.

## Vérifications

```bash
npm run check
```

Cette commande exécute le lint, les tests et le build de production.

## Variables d'environnement

Voir `api/.env.example` et `web/.env.example`. Ne jamais versionner les fichiers `.env`.

## Données existantes

Le modèle `Score` conserve la collection MongoDB `scores` et tous les champs historiques. Le nouveau déploiement peut donc utiliser la base `thequizofsp` existante sans migration destructive. Lire `docs/MIGRATION.md` avant la bascule.

Le pas-à-pas de création du nouveau dépôt et des deux projets Vercel se trouve dans `docs/DEPLOIEMENT.md`.

## API

| Méthode | Route | Usage |
| --- | --- | --- |
| `GET` | `/health` | état de l'API |
| `GET` | `/api/scores?limit=10` | classement |
| `POST` | `/api/scores` | enregistrement idempotent d'un score |

Documentation interactive : `/api-docs` en dehors de la production, ou si `ENABLE_API_DOCS=true`.

## Auteur

[The Code of SP](https://thecodeofsp.fr) — Code tes ambitions !
