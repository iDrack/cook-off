# Cookoff

Votre bibliothèque de recettes à self-host.

## Démarrage rapide

1. Télécharger la dernière version de l'application dans la rubrique [Release](https://github.com/iDrack/cook-off/releases). L'archive contient une image Docker de l'application ainsi qu'un Docker Compose avec pour simplifier le lancement de l'application.
2. Décompresser l'archive.
3. Ajouter un fichier .env (un exemple est disponible plus loin).
4. Lancer la commande ou éxécuter le script de déploiement

```bash
docker load
docker compose up -d
```

L'application sera disponible sur le port fourni dans le .env ou au port 3000 par défaut et un accès à la base de donnée Mongo sur le  port 8081.

Fichier .env d'exemple :

```text
PORT=3000

MONGO_USER=
MONGO_PASS=
NUXT_MONGOOSE_URI=mongodb://[mongo_dbb]:[mongo_pass]@localhost:27017/cookoff?authSource=admin

ME_URL=mongodb://[mongo_dbb]:[mongo_pass]@mongo:27017/
ME_USER=
ME_PASS=
```

## Alternatives

Vous pouvez télécharger le répertoire et build l'applications comme suit :

Build l'application avec : `pnpm build`, le bundle sera disponilbe dans .output/server/index.mjs. Vous pourrez lancer l'application avec `node .output/server/index.mjs`.

Le bundle est aussi disponible dans les releases.

## Mise à jour

Si vous choississez d'utiliser le docker compose fournit avec l'application, vous pouvez juste télécharger l'image docker de l'app pour mettre à jour l'application et éxécuter ces commandes:

```bash
docker load -i cookoff-image.tar
docker compose up -d --force-recreate
```

## Dépendences

[Nuxt](https://nuxt.com)
[NuxtUI](https://ui.nuxt.com)
[Mongo](https://www.mongodb.com) & [MongoExpress](https://github.com/mongo-express/mongo-express)