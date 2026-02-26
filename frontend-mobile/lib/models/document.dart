/// Énumération des types de documents disponibles
enum DocumentType {
  cours,
  examen,
  td,
  corrige,
}

/// Modèle de données pour un document académique
class Document {

  Document({
    required this.id,
    required this.title,
    required this.type,
    required this.level,
    required this.filiere,
    this.filePath,
    this.isDownloaded = false,
    this.downloadedAt,
    this.fileSize,
    this.university,
  });

  /// Crée un document depuis un Map
  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'] as String,
      title: json['title'] as String,
      type: DocumentType.values.firstWhere(
        (e) => e.toString() == json['type'],
      ),
      level: json['level'] as String,
      filiere: json['filiere'] as String?,
      filePath: json['filePath'] as String?,
      isDownloaded: json['isDownloaded'] as bool? ?? false,
      downloadedAt: json['downloadedAt'] != null
          ? DateTime.parse(json['downloadedAt'] as String)
          : null,
      fileSize: json['fileSize'] as int?,
      university: json['university'] as String?,
      
    );
  }
  final String id;
  final String title;
  final DocumentType type;
  final String level; // Ex: "L1", "L3"
  final String? filiere;
  final String? filePath; // Chemin du fichier téléchargé (pour mode offline)
  final bool isDownloaded;
  final DateTime? downloadedAt;
  final int? fileSize; // Taille en bytes
  final String? university;
  

  /// Convertit le type de document en texte lisible
  String get typeLabel {
    switch (type) {
      case DocumentType.cours:
        return 'Cours';
      case DocumentType.examen:
        return 'Examen';
      case DocumentType.td:
        return 'TD';
      case DocumentType.corrige:
        return 'Corrigé';
    }
  }

  /// Crée une copie du document avec les champs modifiés
  Document copyWith({
    String? id,
    String? title,
    DocumentType? type,
    String? level,
    String? filiere,
    String? filePath,
    bool? isDownloaded,
    DateTime? downloadedAt,
    int? fileSize,
    String? university,
    
  }) {
    return Document(
      id: id ?? this.id,
      title: title ?? this.title,
      type: type ?? this.type,
      level: level ?? this.level,
      filiere: filiere ?? this.filiere,
      filePath: filePath ?? this.filePath,
      isDownloaded: isDownloaded ?? this.isDownloaded,
      downloadedAt: downloadedAt ?? this.downloadedAt,
      fileSize: fileSize ?? this.fileSize,
      university: university ?? this.university,
      
    );
  }

  /// Convertit le document en Map (utile pour la persistance)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'type': type.toString(),
      'level': level,
      'filiere': filiere,
      'filePath': filePath,
      'isDownloaded': isDownloaded,
      'downloadedAt': downloadedAt?.toIso8601String(),
      'fileSize': fileSize,
      'university': university,
    };
  }
}
