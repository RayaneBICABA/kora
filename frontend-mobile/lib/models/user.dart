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
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      university: json['university'] as String,
      profileImageUrl: json['profileImageUrl'] as String,
      downloadedDocumentsCount: (json['downloadedDocumentsCount'] is int)
          ? json['downloadedDocumentsCount'] as int
          : int.tryParse(json['downloadedDocumentsCount']?.toString() ?? '0') ?? 0,
    );
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
