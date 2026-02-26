// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Types matching backend models
export interface User {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    role: "admin" | "etudiant";
    niveau?: string;
    universite?: string | { _id: string; nom: string };
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Universite {
    _id: string;
    nom: string;
    localisation: string;
}

export interface Filiere {
    _id: string;
    nom: string;
    universite: Universite;
}

export interface Niveau {
    _id: string;
    nom: string;
    universite: Universite;
}

export interface Matiere {
    _id: string;
    libelle: string;
    filiere: Filiere;
}

export interface Ressource {
    _id: string;
    titre: string;
    type: string;
    fileURL: string;
    matiere: Matiere;
    uploader: User;
    dateUpload: string;
    nombreTelechargements: number;
}

// Helper function for making API calls
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "An error occurred" }));
        throw new Error(error.error || "An error occurred");
    }

    return response.json();
}

// Auth API
export const authAPI = {
    register: async (data: {
        nom: string;
        prenom: string;
        email: string;
        motDePasse: string;
        role?: string;
    }): Promise<AuthResponse> => {
        return fetchAPI<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    login: async (email: string, motDePasse: string): Promise<AuthResponse> => {
        return fetchAPI<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, motDePasse }),
        });
    },
};

// Universities API
export const universiteAPI = {
    getAll: async (): Promise<Universite[]> => {
        return fetchAPI<Universite[]>("/api/universites");
    },

    getById: async (id: string): Promise<Universite> => {
        return fetchAPI<Universite>(`/api/universites/${id}`);
    },

    create: async (data: { nom: string; localisation: string }): Promise<Universite> => {
        return fetchAPI<Universite>("/api/universites", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: { nom: string; localisation: string }): Promise<Universite> => {
        return fetchAPI<Universite>(`/api/universites/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return fetchAPI<{ message: string }>(`/api/universites/${id}`, {
            method: "DELETE",
        });
    },
};

// Filieres API
export const filiereAPI = {
    getAll: async (): Promise<Filiere[]> => {
        return fetchAPI<Filiere[]>("/api/filieres");
    },

    getById: async (id: string): Promise<Filiere> => {
        return fetchAPI<Filiere>(`/api/filieres/${id}`);
    },

    create: async (data: { nom: string; universite: string }): Promise<Filiere> => {
        return fetchAPI<Filiere>("/api/filieres", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: { nom: string; universite: string }): Promise<Filiere> => {
        return fetchAPI<Filiere>(`/api/filieres/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return fetchAPI<{ message: string }>(`/api/filieres/${id}`, {
            method: "DELETE",
        });
    },
};

// Niveaux API
export const niveauAPI = {
    getAll: async (): Promise<Niveau[]> => {
        return fetchAPI<Niveau[]>("/api/niveaux");
    },

    getById: async (id: string): Promise<Niveau> => {
        return fetchAPI<Niveau>(`/api/niveaux/${id}`);
    },

    create: async (data: { nom: string; universite: string }): Promise<Niveau> => {
        return fetchAPI<Niveau>("/api/niveaux", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: { nom: string; universite: string }): Promise<Niveau> => {
        return fetchAPI<Niveau>(`/api/niveaux/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return fetchAPI<{ message: string }>(`/api/niveaux/${id}`, {
            method: "DELETE",
        });
    },
};

// Matieres API
export const matiereAPI = {
    getAll: async (filiereId?: string, niveauId?: string): Promise<Matiere[]> => {
        let url = "/api/matieres";
        const params = new URLSearchParams();
        if (filiereId) params.append("filiere", filiereId);
        if (niveauId) params.append("niveau", niveauId);
        if (params.toString()) url += `?${params.toString()}`;
        return fetchAPI<Matiere[]>(url);
    },

    getById: async (id: string): Promise<Matiere> => {
        return fetchAPI<Matiere>(`/api/matieres/${id}`);
    },

    create: async (data: { libelle: string; filiere: string; niveau?: string }): Promise<Matiere> => {
        return fetchAPI<Matiere>("/api/matieres", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: { libelle: string; filiere: string; niveau?: string }): Promise<Matiere> => {
        return fetchAPI<Matiere>(`/api/matieres/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return fetchAPI<{ message: string }>(`/api/matieres/${id}`, {
            method: "DELETE",
        });
    },
};

// Ressources API
export const ressourceAPI = {
    getAll: async (): Promise<Ressource[]> => {
        return fetchAPI<Ressource[]>("/api/ressources");
    },

    getById: async (id: string): Promise<Ressource> => {
        return fetchAPI<Ressource>(`/api/ressources/${id}`);
    },

    create: async (data: {
        titre: string;
        type: string;
        fileURL: string;
        matiere: string;
        uploader: string;
    }): Promise<Ressource> => {
        return fetchAPI<Ressource>("/api/ressources", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (
        id: string,
        data: {
            titre: string;
            type: string;
            fileURL: string;
            matiere: string;
            uploader: string;
        }
    ): Promise<Ressource> => {
        return fetchAPI<Ressource>(`/api/ressources/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return fetchAPI<{ message: string }>(`/api/ressources/${id}`, {
            method: "DELETE",
        });
    },

    incrementDownload: async (id: string): Promise<Ressource> => {
        return fetchAPI<Ressource>(`/api/ressources/${id}/increment-download`, {
            method: "PATCH",
        });
    },
};

// Upload API
export const uploadAPI = {
    uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: "POST",
            headers: token ? { "Authorization": `Bearer ${token}` } : {},
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Upload failed" }));
            throw new Error(error.error || "Upload failed");
        }

        return response.json();
    },
};

// Users API
export const userAPI = {
    getAll: async (): Promise<User[]> => {
        return fetchAPI<User[]>("/api/users");
    },

    getById: async (id: string): Promise<User> => {
        return fetchAPI<User>(`/api/users/${id}`);
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return fetchAPI<{ message: string }>(`/api/users/${id}`, {
            method: "DELETE",
        });
    },
};

// Stats API
export const statsAPI = {
    getDashboardStats: async (): Promise<{ usersCount: number; documentsCount: number; downloadsCount: number }> => {
        return fetchAPI<{ usersCount: number; documentsCount: number; downloadsCount: number }>("/api/stats/dashboard");
    },
};
