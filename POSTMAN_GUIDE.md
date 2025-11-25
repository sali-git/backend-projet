# Guide de Test Postman - Application d17 Wallet

## Configuration de base
- **URL de base** : `http://localhost:5000`
- **Port** : `5000` (ou celui défini dans votre `.env`)

---

## 🔐 1. Routes d'Authentification (`/auth`)

### 1.1 Inscription (Register)
**Méthode** : `POST`  
**URL** : `http://localhost:5000/auth/register`  
**Headers** : 
```
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "currency": "XOF"
}
```

💡 **Note** : Le champ `fullName` peut aussi être écrit `fullname` (tout en minuscules). Les deux formats sont acceptés.

**Réponse attendue (201)** :
```json
{
  "message": "Utilisateur créé",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "wallet": {
    "id": "...",
    "balance": 0,
    "currency": "XOF"
  }
}
```

---

### 1.2 Connexion (Login)
**Méthode** : `POST`  
**URL** : `http://localhost:5000/auth/login`  
**Headers** : 
```
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse attendue (200)** :
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

⚠️ **IMPORTANT** : Copiez le `token` pour l'utiliser dans les requêtes suivantes !

---

## 💰 2. Routes Wallet (`/wallet`)

**Note** : Toutes les routes wallet nécessitent une authentification.

### 2.1 Consulter le wallet
**Méthode** : `GET`  
**URL** : `http://localhost:5000/wallet`  
**Headers** : 
```
Authorization: Bearer <VOTRE_TOKEN>
```
ou
```
Authorization: <VOTRE_TOKEN>
```

**Réponse attendue (200)** :
```json
{
  "_id": "...",
  "userId": "...",
  "balance": 0,
  "currency": "XOF",
  "walletNumber": "WAL-1234567890-123",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 2.2 Ajouter de l'argent (Add Money)
**Méthode** : `POST`  
**URL** : `http://localhost:5000/wallet/add`  
**Headers** : 
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "amount": 1000
}
```

**Réponse attendue (200)** :
```json
{
  "_id": "...",
  "userId": "...",
  "balance": 1000,
  "currency": "XOF",
  "walletNumber": "WAL-1234567890-123",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 2.3 Retirer de l'argent (Remove Money)
**Méthode** : `POST`  
**URL** : `http://localhost:5000/wallet/remove`  
**Headers** : 
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "amount": 500
}
```

**Réponse attendue (200)** :
```json
{
  "_id": "...",
  "userId": "...",
  "balance": 500,
  "currency": "XOF",
  "walletNumber": "WAL-1234567890-123",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Erreur si solde insuffisant (400)** :
```json
{
  "message": "Solde insuffisant"
}
```

---

### 2.4 Transférer de l'argent (Transfer)
**Méthode** : `POST`  
**URL** : `http://localhost:5000/wallet/transfer`  
**Headers** : 
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "receiverEmail": "jane@example.com",
  "amount": 200
}
```

**Réponse attendue (200)** :
```json
{
  "message": "Transfert effectué avec succès",
  "senderBalance": 300
}
```

**Erreurs possibles** :

- **`400` : "Solde insuffisant"**
  - Le wallet de l'envoyeur n'a pas assez de fonds pour effectuer le transfert
  - **Solution** : Vérifiez votre solde avec `GET /wallet` et ajoutez de l'argent si nécessaire

- **`400` : "receiverEmail requis"**
  - Le champ `receiverEmail` est manquant dans le body
  - **Solution** : Assurez-vous d'inclure `receiverEmail` dans votre requête JSON

- **`400` : "Impossible d'envoyer vers soi-même"**
  - Vous essayez de transférer vers votre propre email
  - **Solution** : Utilisez l'email d'un autre utilisateur

- **`404` : "Destinataire non trouvé"** ⚠️
  - L'email du destinataire n'existe pas dans la base de données
  - **Causes possibles** :
    - L'email est mal orthographié
    - L'utilisateur n'a pas encore été créé (pas d'inscription)
    - L'email n'existe pas dans la base de données
  - **Solutions** :
    1. Vérifiez l'orthographe de l'email du destinataire
    2. Assurez-vous que le destinataire s'est inscrit avec `/auth/register` avant le transfert
    3. Vérifiez que l'email existe bien dans votre base de données MongoDB

- **`404` : "Wallet manquant pour l'une des parties"**
  - Le wallet de l'envoyeur ou du destinataire n'existe pas
  - **Solution** : Normalement, un wallet est créé automatiquement lors de l'inscription. Si cette erreur apparaît, il y a un problème dans la base de données

**💡 Astuce pour éviter l'erreur 404** :
Avant de transférer, assurez-vous que :
1. Le destinataire existe : Créez d'abord l'utilisateur destinataire avec `/auth/register`
2. L'email est correct : Utilisez exactement le même email que celui utilisé lors de l'inscription
3. Les deux utilisateurs ont des wallets : Normalement créés automatiquement lors de l'inscription

---

## 📊 3. Routes Transactions (`/transactions`)

**Note** : Toutes les routes transactions nécessitent une authentification.

### 3.1 Consulter l'historique des transactions
**Méthode** : `GET`  
**URL** : `http://localhost:5000/transactions`  
**Headers** : 
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponse attendue (200)** :
```json
[
  {
    "_id": "...",
    "userId": "...",
    "amount": 1000,
    "type": "CREDIT",
    "status": "SUCCESS",
    "description": "Dépôt manuel",
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "_id": "...",
    "userId": "...",
    "amount": 500,
    "type": "DEBIT",
    "status": "SUCCESS",
    "description": "Retrait manuel",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

## 📝 Scénario de test complet

### Étape 1 : Créer deux utilisateurs
1. **User 1** : 
   ```json
   POST /auth/register
   {
     "fullName": "Alice",
     "email": "alice@example.com",
     "password": "password123",
     "currency": "XOF"
   }
   ```

2. **User 2** :
   ```json
   POST /auth/register
   {
     "fullName": "Bob",
     "email": "bob@example.com",
     "password": "password123",
     "currency": "XOF"
   }
   ```

### Étape 2 : Se connecter avec User 1
```json
POST /auth/login
{
  "email": "alice@example.com",
  "password": "password123"
}
```
→ Copier le `token` reçu

### Étape 3 : Consulter le wallet de User 1
```
GET /wallet
Authorization: Bearer <TOKEN_USER1>
```

### Étape 4 : Ajouter de l'argent au wallet de User 1
```json
POST /wallet/add
Authorization: Bearer <TOKEN_USER1>
{
  "amount": 5000
}
```

### Étape 5 : Consulter les transactions de User 1
```
GET /transactions
Authorization: Bearer <TOKEN_USER1>
```

### Étape 6 : Transférer de l'argent de User 1 vers User 2
⚠️ **Important** : Assurez-vous que User 2 (Bob) a bien été créé à l'étape 1, sinon vous obtiendrez une erreur `404 : "Destinataire non trouvé"`.

```json
POST /wallet/transfer
Authorization: Bearer <TOKEN_USER1>
{
  "receiverEmail": "bob@example.com",
  "amount": 1000
}
```

**Vérifications avant le transfert** :
- ✅ User 2 (bob@example.com) existe dans la base de données (créé à l'étape 1)
- ✅ L'email est exactement `bob@example.com` (même casse, pas d'espaces)
- ✅ User 1 a suffisamment de fonds (vérifié à l'étape 3)

### Étape 7 : Se connecter avec User 2 et vérifier
```json
POST /auth/login
{
  "email": "bob@example.com",
  "password": "password123"
}
```
→ Utiliser le nouveau token pour vérifier le wallet de User 2

---

## ⚠️ Erreurs courantes

### 401 Unauthorized
- **Cause** : Token manquant ou invalide
- **Solution** : Vérifier que le header `Authorization` contient un token valide

### 400 Bad Request
- **Cause** : Données manquantes ou invalides
- **Solution** : Vérifier le format JSON et les champs requis

### 404 Not Found
- **Causes possibles** :
  - **"Destinataire non trouvé"** : L'email du destinataire n'existe pas dans la base de données
    - Vérifiez que l'utilisateur destinataire a bien été créé avec `/auth/register`
    - Vérifiez l'orthographe de l'email (même casse, pas d'espaces)
    - Vérifiez dans MongoDB Compass que l'utilisateur existe
  - **"Wallet manquant"** : Le wallet de l'utilisateur n'existe pas
    - Normalement créé automatiquement lors de l'inscription
    - Vérifiez dans MongoDB Compass que le wallet existe
- **Solutions** :
  1. Créez d'abord l'utilisateur destinataire avec `/auth/register`
  2. Vérifiez l'email exact utilisé lors de l'inscription
  3. Utilisez MongoDB Compass pour vérifier que les données existent

### 500 Internal Server Error
- **Cause** : Erreur serveur
- **Solution** : Vérifier les logs du serveur

---

## 💡 Astuces Postman

1. **Créer une variable d'environnement** :
   - Créez un environnement Postman
   - Ajoutez une variable `base_url` = `http://localhost:5000`
   - Ajoutez une variable `token` pour stocker le token JWT
   - Utilisez `{{base_url}}/auth/login` dans vos requêtes

2. **Automatiser le token** :
   - Dans la requête `/auth/login`, allez dans "Tests"
   - Ajoutez : `pm.environment.set("token", pm.response.json().token);`
   - Utilisez `{{token}}` dans le header Authorization

3. **Collection Postman** :
   - Créez une collection "d17 Wallet API"
   - Organisez les requêtes par catégories (Auth, Wallet, Transactions)
   - Partagez la collection avec votre équipe

---

## 🔧 Configuration Postman (Optionnel)

### Script de test automatique pour Login
Dans l'onglet "Tests" de la requête `/auth/login` :
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("userId", jsonData.user.id);
    console.log("Token sauvegardé :", jsonData.token);
}
```

### Pré-requête pour ajouter automatiquement le token
Dans l'onglet "Pre-request Script" des requêtes protégées :
```javascript
const token = pm.environment.get("token");
if (!token) {
    console.error("Token non trouvé. Connectez-vous d'abord.");
}
```

---

**Bon test ! 🚀**

