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
    this.subject,
    this.offlineRecordId,
  });

  /// Crée un document depuis un Map
  factory Document.fromJson(Map<String, dynamic> json) {
    final rawType = (json['type'] ?? '').toString().toLowerCase();

    return Document(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      type: _parseType(rawType),
      level: (json['level'] ?? '').toString(),
      filiere: json['filiere'] as String?,
      filePath: json['filePath'] as String?,
      isDownloaded: json['isDownloaded'] as bool? ?? false,
      downloadedAt: json['downloadedAt'] != null
          ? DateTime.parse(json['downloadedAt'] as String)
          : null,
      fileSize: json['fileSize'] as int?,
      university: json['university'] as String?,
      subject: json['subject'] as String?,
      offlineRecordId: json['offlineRecordId'] as String?,
    );
  }
  factory Document.fromBackendResource(
    Map<String, dynamic> json, {
    String? offlineRecordId,
    DateTime? downloadedAt,
    bool isDownloaded = false,
  }) {
    final matiere = json['matiere'];
    final filiereMap =
        matiere is Map<String, dynamic> ? matiere['filiere'] : null;
    final niveauMap =
        matiere is Map<String, dynamic> ? matiere['niveau'] : null;
    final universityMap =
        filiereMap is Map<String, dynamic> ? filiereMap['universite'] : null;

    return Document(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      title: (json['titre'] ?? json['title'] ?? '').toString(),
      type: _parseType((json['type'] ?? '').toString()),
      level: niveauMap is Map<String, dynamic>
          ? (niveauMap['nom'] ?? '').toString()
          : (json['level'] ?? '').toString(),
      filiere: filiereMap is Map<String, dynamic>
          ? (filiereMap['nom'] ?? '').toString()
          : (json['filiere'] ?? '').toString(),
      filePath: (json['fileURL'] ?? json['filePath'] ?? '').toString(),
      isDownloaded: isDownloaded || (json['isDownloaded'] as bool? ?? false),
      downloadedAt: downloadedAt,
      university: universityMap is Map<String, dynamic>
          ? (universityMap['nom'] ?? '').toString()
          : null,
      subject: matiere is Map<String, dynamic>
          ? (matiere['libelle'] ?? '').toString()
          : null,
      offlineRecordId: offlineRecordId,
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
  final String? subject;
  final String? offlineRecordId;

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
    String? subject,
    String? offlineRecordId,
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
      subject: subject ?? this.subject,
      offlineRecordId: offlineRecordId ?? this.offlineRecordId,
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
      'subject': subject,
      'offlineRecordId': offlineRecordId,
    };
  }

  static DocumentType _parseType(String value) {
    switch (value.toLowerCase()) {
      case 'examen':
        return DocumentType.examen;
      case 'td':
        return DocumentType.td;
      case 'corrige':
      case 'corrigé':
        return DocumentType.corrige;
      case 'cours':
      default:
        return DocumentType.cours;
    }
  }
}
