Backend Laravel – API REST

Ce projet est une API REST complète développée avec Laravel.
Elle permet de gérer l’authentification via JWT, la création et la gestion d’articles, la validation des données, la limitation du débit des requêtes et les tests via Postman.

1. Aperçu du Projet

Ce backend fournit toutes les fonctionnalités nécessaires pour construire une application moderne.
L’API gère les comptes utilisateurs, la connexion, les articles, la sécurité, le rate limiting et l’organisation des données grâce à Laravel.

2. Fonctionnalités

L’API propose plusieurs fonctions essentielles :

authentification sécurisée avec JWT

création et gestion du profil utilisateur

création, lecture, mise à jour et suppression d'articles

validation des données d’entrée

pagination, recherche et tri des articles

routes protégées

limitation du débit des requêtes pour la sécurité

tests API via Postman

3. Stack Technologique

L’API utilise les technologies suivantes :

PHP

Laravel Framework

MySQL ou MariaDB

JWT pour l’authentification

Postman pour les tests

Apache ou Nginx comme serveur web

4. Installation

Pour installer le projet :

Il faut d’abord télécharger ou cloner le projet.
Ensuite, installer les dépendances avec Composer.
Créer un fichier .env à partir du fichier exemple.
Configurer la base de données dans ce fichier .env.
Générer la clé de l’application.
Lancer les migrations pour créer les tables.
Installer le package JWT et générer la clé JWT.
Enfin, démarrer le serveur Laravel avec la commande php artisan serve.

5. Configuration

La configuration se fait principalement dans le fichier .env.

On y indique :
le nom de la base de données,
l’utilisateur MySQL,
le mot de passe,
et l’URL de l’application.

L’authentification JWT doit être activée dans le fichier config/auth.php.
Le guard api doit utiliser le driver jwt pour protéger les routes API.

6. Authentification

L’API gère plusieurs actions liées à l’utilisateur :

inscription d’un nouvel utilisateur

connexion avec email et mot de passe

récupération du profil

déconnexion

rafraîchissement du token JWT

Les routes d’authentification sont protégées pour empêcher tout accès non autorisé.
Lorsqu’un utilisateur se connecte, un token JWT lui est retourné.
Ce token doit être envoyé dans toutes les requêtes suivantes pour accéder aux routes sécurisées.

7. CRUD : API des Articles (Posts)

L’API permet de gérer des articles.

Un utilisateur peut créer un nouvel article, consulter la liste des articles, voir le détail d’un article, modifier un article dont il est le propriétaire et supprimer un article.

Chaque article contient un titre, un contenu, un statut et une date de publication si l’article est publié.

La liste des articles peut être filtrée par mot clé.
Elle peut être triée, et paginée pour afficher les résultats page par page.

Seul l’auteur d’un article peut le modifier ou le supprimer.

8. Limitation de Débit (Rate Limiting)

L’API utilise un système de limitation de requêtes pour renforcer la sécurité.

Par exemple :
les routes de connexion sont limitées pour éviter les attaques par force brute,
la création d’articles est limitée pour éviter le spam,
et chaque utilisateur a une limite précise de requêtes par minute.

En cas de dépassement, l’utilisateur reçoit une erreur indiquant qu’il doit attendre.

9. Tests avec Postman

Une collection Postman est disponible pour tester toutes les routes de l’API.

On peut tester :
l'inscription,
la connexion,
le profil utilisateur,
la création d’un article,
la mise à jour ou la suppression d’un article,
ainsi que les erreurs de validation ou d’autorisation.

Postman peut aussi sauvegarder automatiquement le token JWT pour les tests.

10. Structure de la Base de Données

La base de données contient plusieurs tables importantes :

la table des utilisateurs

la table des articles

les tables liées à l’authentification

les tables nécessaires à Laravel

Un utilisateur peut avoir plusieurs articles.
Chaque article appartient à un seul utilisateur.

11. Licence

Le projet peut être utilisé librement dans un cadre d’apprentissage, universitaire ou personnel.
Il peut être modifié selon les besoins.
