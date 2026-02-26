/// Modèle de données pour un utilisateur de KORA
class User {
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.university,
    required this.profileImageUrl,
    this.downloadedDocumentsCount = 0,
  });

  /// Crée un utilisateur depuis un Map
  factory User.fromJson(Map<String, dynamic> json) {
    final firstName = (json['prenom'] ?? '').toString();
    final lastName = (json['nom'] ?? '').toString();
    final fallbackName = '$firstName $lastName'.trim();
    final universityField = json['university'] ?? json['universite'];
    final universityName = universityField is Map<String, dynamic>
        ? (universityField['nom'] ?? '').toString()
        : (universityField ?? '').toString();

    return User(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: (json['name'] ?? fallbackName).toString(),
      email: (json['email'] ?? '').toString(),
      university: universityName,
      profileImageUrl: (json['profileImageUrl'] ?? '').toString(),
      downloadedDocumentsCount: (json['downloadedDocumentsCount'] is int)
          ? json['downloadedDocumentsCount'] as int
          : int.tryParse(json['downloadedDocumentsCount']?.toString() ?? '0') ??
              0,
    );
  }

  factory User.fromBackend(Map<String, dynamic>? json) {
    if (json == null) {
      return User(
        id: '',
        name: '',
        email: '',
        university: '',
        profileImageUrl: '',
      );
    }

    return User.fromJson(json);
  }
  final String id;
  final String name;
  final String email;
  final String? profileImageUrl;
  final String university;
  final int downloadedDocumentsCount;

  /// Crée une copie de l'utilisateur avec les champs modifiés
  User copyWith({
    String? id,
    String? name,
    String? email,
    String? profileImageUrl,
    String? university,
    int? downloadedDocumentsCount,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      university: university ?? this.university,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      downloadedDocumentsCount:
          downloadedDocumentsCount ?? this.downloadedDocumentsCount,
    );
  }

  /// Convertit l'utilisateur en Map
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'university': university,
      'profileImageUrl': profileImageUrl,
      'downloadedDocumentsCount': downloadedDocumentsCount,
    };
  }
}
