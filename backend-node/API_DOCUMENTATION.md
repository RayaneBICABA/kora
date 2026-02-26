# 📚 Documentation API KORA

## 🎯 Base URL
```
http://localhost:3000
```

## 🔌 Endpoints disponibles

### 🏠 Home
#### GET `/`
- **Description:** Affiche un message de bienvenue
- **Réponse:** 
```json
{
    "message": "Welcome to KORA!"
}
```

---

## 🏫 Universités

### GET `/api/universites`
- **Description:** Récupère toutes les universités
- **Réponse:** 
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "nom": "Université de Paris",
        "localisation": "Paris",
        "__v": 0
    }
]
```

### GET `/api/universites/:id`
- **Description:** Récupère une université par ID
- **Paramètres:** `id` (MongoDB ObjectId)
- **Réponse:** 
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Université de Paris",
    "localisation": "Paris"
}
```

### POST `/api/universites`
- **Description:** Crée une nouvelle université
- **Body:**
```json
{
    "nom": "Université de Toulouse",
    "localisation": "Toulouse"
}
```
- **Réponse:** `201 Created`

### PUT `/api/universites/:id`
- **Description:** Met à jour une université
- **Body:**
```json
{
    "nom": "Université de Toulouse",
    "localisation": "Toulouse"
}
```
- **Réponse:** `200 OK`

### DELETE `/api/universites/:id`
- **Description:** Supprime une université
- **Réponse:** 
```json
{
    "message": "University removed successfully"
}
```

---

## 🎓 Filières

### GET `/api/filieres`
- **Description:** Récupère toutes les filières
- **Réponse:**
```json
[
    {
        "_id": "507f1f77bcf86cd799439012",
        "nom": "Informatique",
        "universite": {
            "_id": "507f1f77bcf86cd799439011",
            "nom": "Université de Paris"
        }
    }
]
```

### GET `/api/filieres/:id`
- **Description:** Récupère une filière par ID
- **Réponse:** Détails d'une filière

### POST `/api/filieres`
- **Description:** Crée une nouvelle filière
- **Body:**
```json
{
    "nom": "Informatique",
    "universite": "507f1f77bcf86cd799439011"
}
```
- **Réponse:** `201 Created`

### PUT `/api/filieres/:id`
- **Description:** Met à jour une filière
- **Body:**
```json
{
    "nom": "Informatique",
    "universite": "507f1f77bcf86cd799439011"
}
```

### DELETE `/api/filieres/:id`
- **Description:** Supprime une filière

---

## 📚 Niveaux

### GET `/api/niveaux`
- **Description:** Récupère tous les niveaux
- **Réponse:**
```json
[
    {
        "_id": "507f1f77bcf86cd799439013",
        "nom": "Licence 1",
        "universite": {...}
    }
]
```

### GET `/api/niveaux/:id`
- **Description:** Récupère un niveau par ID

### POST `/api/niveaux`
- **Description:** Crée un nouveau niveau
- **Body:**
```json
{
    "nom": "Licence 1",
    "universite": "507f1f77bcf86cd799439011"
}
```

### PUT `/api/niveaux/:id`
- **Description:** Met à jour un niveau

### DELETE `/api/niveaux/:id`
- **Description:** Supprime un niveau

---

## 📖 Matières

### GET `/api/matieres`
- **Description:** Récupère toutes les matières
- **Réponse:**
```json
[
    {
        "_id": "507f1f77bcf86cd799439014",
        "libelle": "Programmation C",
        "filiere": {...}
    }
]
```

### GET `/api/matieres/:id`
- **Description:** Récupère une matière par ID

### POST `/api/matieres`
- **Description:** Crée une nouvelle matière
- **Body:**
```json
{
    "libelle": "Programmation C",
    "filiere": "507f1f77bcf86cd799439012"
}
```

### PUT `/api/matieres/:id`
- **Description:** Met à jour une matière

### DELETE `/api/matieres/:id`
- **Description:** Supprime une matière

---

## 📄 Ressources

### GET `/api/ressources`
- **Description:** Récupère toutes les ressources
- **Réponse:**
```json
[
    {
        "_id": "507f1f77bcf86cd799439015",
        "titre": "Cours de C",
        "type": "pdf",
        "fileURL": "https://example.com/cours.pdf",
        "matiere": {...},
        "uploader": {...},
        "dateUpload": "2024-01-28T10:00:00.000Z",
        "nombreTelechargements": 15
    }
]
```

### GET `/api/ressources/:id`
- **Description:** Récupère une ressource par ID

### POST `/api/ressources`
- **Description:** Crée une nouvelle ressource
- **Body:**
```json
{
    "titre": "Cours de C",
    "type": "pdf",
    "fileURL": "https://example.com/cours.pdf",
    "matiere": "507f1f77bcf86cd799439014",
    "uploader": "507f1f77bcf86cd799439016"
}
```

### PUT `/api/ressources/:id`
- **Description:** Met à jour une ressource

### DELETE `/api/ressources/:id`
- **Description:** Supprime une ressource

---

## 👥 Utilisateurs

### GET `/api/users`
- **Description:** Récupère tous les utilisateurs
- **Réponse:**
```json
[
    {
        "_id": "507f1f77bcf86cd799439016",
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean@example.com",
        "role": "etudiant",
        "niveau": {...},
        "universite": {...}
    }
]
```

### GET `/api/users/:id`
- **Description:** Récupère un utilisateur par ID

### POST `/api/users`
- **Description:** Crée un nouvel utilisateur
- **Body:**
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

### PUT `/api/users/:id`
- **Description:** Met à jour un utilisateur

### DELETE `/api/users/:id`
- **Description:** Supprime un utilisateur

---

## 💾 Téléchargements Offline

### GET `/api/offline-downloads`
- **Description:** Récupère tous les téléchargements offline
- **Réponse:**
```json
[
    {
        "_id": "507f1f77bcf86cd799439017",
        "resourceId": "507f1f77bcf86cd799439015",
        "userId": "507f1f77bcf86cd799439016",
        "dataSynchro": "2024-01-28T10:00:00.000Z"
    }
]
```

### GET `/api/offline-downloads/:id`
- **Description:** Récupère un téléchargement offline par ID

### POST `/api/offline-downloads`
- **Description:** Crée un nouvel enregistrement de téléchargement
- **Body:**
```json
{
    "resourceId": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439016"
}
```

### PUT `/api/offline-downloads/:id`
- **Description:** Met à jour un enregistrement de téléchargement

### DELETE `/api/offline-downloads/:id`
- **Description:** Supprime un enregistrement de téléchargement

---

## 📊 Codes de réponse HTTP

| Code | Signification |
|------|---------------|
| `200` | OK - Requête réussie |
| `201` | Created - Ressource créée |
| `400` | Bad Request - Erreur dans les données |
| `404` | Not Found - Ressource non trouvée |
| `500` | Internal Server Error - Erreur serveur |

---

## 🔍 Format des erreurs

### Erreur 400
```json
{
    "error": "Description de l'erreur"
}
```

### Erreur 404
```json
{
    "message": "Ressource not found"
}
```

### Erreur 500
```json
{
    "error": "Internal Server Error"
}
```

---

## 💡 Exemples de requêtes cURL

### Créer une université
```bash
curl -X POST http://localhost:3000/api/universites \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Université de Lyon",
    "localisation": "Lyon"
  }'
```

### Récupérer tous les utilisateurs
```bash
curl -X GET http://localhost:3000/api/users
```

### Mettre à jour un utilisateur
```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439016 \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Pierre"
  }'
```

### Supprimer une ressource
```bash
curl -X DELETE http://localhost:3000/api/ressources/507f1f77bcf86cd799439015
```

---

## 🔐 Authentification
⚠️ **À implémenter:** Ajouter JWT (JSON Web Tokens) pour l'authentification

---

## 📝 Notes importantes

1. **ObjectId MongoDB:** Tous les IDs doivent être des ObjectIds MongoDB valides (24 caractères hexadécimaux)
2. **Validation:** Des validations sont effectuées sur tous les champs requis
3. **Middleware d'erreur:** Toutes les erreurs sont capturées par le middleware d'erreur centralisé
4. **Logging:** Toutes les requêtes sont loggées avec horodatage et durée d'exécution

---

**Version:** 1.0.0  
**Dernière mise à jour:** 28 janvier 2026
