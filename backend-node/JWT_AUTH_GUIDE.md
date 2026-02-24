# 🔐 Guide d'Authentification JWT

## 📋 Vue d'ensemble

L'API KORA utilise **JWT (JSON Web Tokens)** pour l'authentification et l'autorisation.

## 🚀 Endpoints d'authentification

### 1️⃣ Register - Créer un compte

#### POST `/api/auth/register`

**Body:**
```json
{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "motDePasse": "password123",
    "role": "etudiant",
    "niveau": "507f1f77bcf86cd799439013",
    "universite": "507f1f77bcf86cd799439011"
}
```

**Réponse: `201 Created`**
```json
{
    "user": {
        "_id": "507f1f77bcf86cd799439016",
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean@example.com",
        "role": "etudiant"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- ✅ `nom`, `prenom`, `email`, `motDePasse` sont requis
- ✅ L'email doit être unique (pas d'doublon)
- ✅ Le mot de passe est hashé avec bcrypt

---

### 2️⃣ Login - Se connecter

#### POST `/api/auth/login`

**Body:**
```json
{
    "email": "jean@example.com",
    "motDePasse": "password123"
}
```

**Réponse: `200 OK`**
```json
{
    "user": {
        "_id": "507f1f77bcf86cd799439016",
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean@example.com",
        "role": "etudiant"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- ❌ `401 Unauthorized` - Email ou mot de passe incorrect

---

## 🔑 Utilisation du Token

### Structure du Token

Un token JWT contient 3 parties séparées par des points:
```
header.payload.signature
```

Le **payload** contient:
```json
{
    "userId": "507f1f77bcf86cd799439016",
    "email": "jean@example.com",
    "role": "etudiant",
    "iat": 1706428800,
    "exp": 1707033600
}
```

### Envoi du Token

Tous les endpoints protégés nécessitent le token dans le header:

```
Authorization: Bearer <token>
```

**Exemple avec cURL:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🛡️ Routes Protégées

Les routes suivantes **nécessitent une authentification JWT**:

### Utilisateurs (sécurisées)
- ✅ `GET /api/users` - Nécessite token
- ✅ `GET /api/users/:id` - Nécessite token
- ✅ `POST /api/users` - Nécessite token
- ✅ `PUT /api/users/:id` - Nécessite token
- ✅ `DELETE /api/users/:id` - Nécessite token

### Routes Publiques (pas besoin de token)
- ❌ `POST /api/auth/register` - Publique
- ❌ `POST /api/auth/login` - Publique
- ❌ `GET /` - Publique (home)

**Autres routes** (universités, filières, etc.) restent publiques pour l'instant.

---

## 📝 Exemple complet: Login et utilisation

### 1. Se connecter
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "motDePasse": "password123"
  }'
```

Réponse:
```json
{
    "user": {
        "_id": "507f...",
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean@example.com",
        "role": "etudiant"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Utiliser le token pour accéder à `/api/users`
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## ⚠️ Gestion des Erreurs

### 401 Unauthorized - Token manquant
```json
{
    "error": "Access token required"
}
```

### 403 Forbidden - Token invalide ou expiré
```json
{
    "error": "Invalid or expired token"
}
```

### 400 Bad Request - Données manquantes
```json
{
    "error": "email and motDePasse are required"
}
```

### 400 Bad Request - Email déjà enregistré
```json
{
    "error": "Email already registered"
}
```

### 401 Unauthorized - Identifiants incorrects
```json
{
    "error": "Invalid email or password"
}
```

---

## 🔐 Configuration JWT

Les paramètres JWT sont définis dans le fichier `.env`:

```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRY=7d
```

**Important:** 
- ⚠️ Changez `JWT_SECRET` en production!
- ⚠️ Utilisez une clé complexe et aléatoire
- ⚠️ `JWT_EXPIRY` définit la durée de validité du token (7 jours)

---

## 🧪 Tests avec Postman

### Étape 1: Register
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "motDePasse": "password123",
    "role": "etudiant"
}
```

### Étape 2: Copier le token
Récupérez le `token` de la réponse.

### Étape 3: Utiliser le token
```
GET http://localhost:3000/api/users
Authorization: Bearer <token>
```

---

## 🚀 Bonnes Pratiques

1. **Stockage du Token:**
   - ✅ Stockez le token dans `localStorage` ou `sessionStorage` côté client
   - ❌ Ne stockez jamais le mot de passe

2. **Transmission du Token:**
   - ✅ Envoyez le token dans le header `Authorization: Bearer <token>`
   - ❌ N'envoyez jamais le token en paramètre URL

3. **Sécurité:**
   - ✅ Utilisez HTTPS en production
   - ✅ Définissez une expiration appropriée
   - ✅ Changez `JWT_SECRET` en production
   - ✅ Utilisez des mots de passe forts

4. **Refresh Token (à implémenter):**
   - Pour une meilleure sécurité, implémentez un refresh token
   - Les tokens d'accès auront une durée courte (15 minutes)
   - Les refresh tokens dureront plus longtemps (7 jours)

---

## 📚 Ressources

- [JWT.io - Documentation JWT](https://jwt.io)
- [Bcryptjs - Documentation](https://www.npmjs.com/package/bcryptjs)
- [Jsonwebtoken - Documentation](https://www.npmjs.com/package/jsonwebtoken)

---

**Version:** 1.0.0  
**Dernière mise à jour:** 28 janvier 2026
