import 'package:dio/dio.dart';

import 'api_client.dart';

class FilterOption {
  FilterOption({required this.id, required this.name});

  final String id;
  final String name;
}

class MatiereOption extends FilterOption {
  MatiereOption({
    required super.id,
    required super.name,
    required this.filiereId,
    required this.niveauId,
  });

  final String? filiereId;
  final String? niveauId;
}

class UniversityCatalog {
  UniversityCatalog({
    required this.filieres,
    required this.niveaux,
    required this.matieres,
  });

  final List<FilterOption> filieres;
  final List<FilterOption> niveaux;
  final List<MatiereOption> matieres;
}

class CatalogApiService {
  CatalogApiService._();

  static Future<UniversityCatalog> getUniversityCatalog({
    required String universityId,
  }) async {
    final responses = await Future.wait([
      ApiClient.instance.get<List<dynamic>>('/filieres'),
      ApiClient.instance.get<List<dynamic>>('/niveaux'),
      ApiClient.instance.get<List<dynamic>>('/matieres'),
    ]);

    final filieresRaw = responses[0].data ?? <dynamic>[];
    final niveauxRaw = responses[1].data ?? <dynamic>[];
    final matieresRaw = responses[2].data ?? <dynamic>[];

    final filieres = filieresRaw
        .whereType<Map<String, dynamic>>()
        .where((item) => _extractId(item['universite']) == universityId)
        .map(
          (item) => FilterOption(
            id: (item['_id'] ?? '').toString(),
            name: (item['nom'] ?? '').toString(),
          ),
        )
        .where((item) => item.id.isNotEmpty && item.name.isNotEmpty)
        .toList();

    final niveaux = niveauxRaw
        .whereType<Map<String, dynamic>>()
        .where((item) => _extractId(item['universite']) == universityId)
        .map(
          (item) => FilterOption(
            id: (item['_id'] ?? '').toString(),
            name: (item['nom'] ?? '').toString(),
          ),
        )
        .where((item) => item.id.isNotEmpty && item.name.isNotEmpty)
        .toList();

    final filiereIds = filieres.map((item) => item.id).toSet();
    final niveauIds = niveaux.map((item) => item.id).toSet();

    final matieres = matieresRaw
        .whereType<Map<String, dynamic>>()
        .map(
          (item) => MatiereOption(
            id: (item['_id'] ?? '').toString(),
            name: (item['libelle'] ?? '').toString(),
            filiereId: _extractId(item['filiere']),
            niveauId: _extractId(item['niveau']),
          ),
        )
        .where((item) => item.id.isNotEmpty && item.name.isNotEmpty)
        .where(
          (item) =>
              (item.filiereId != null && filiereIds.contains(item.filiereId)) ||
              (item.niveauId != null && niveauIds.contains(item.niveauId)),
        )
        .toList();

    return UniversityCatalog(
      filieres: _uniqueByName(filieres),
      niveaux: _uniqueByName(niveaux),
      matieres: _uniqueMatieresByName(matieres),
    );
  }

  static List<FilterOption> _uniqueByName(List<FilterOption> items) {
    final seen = <String>{};
    final result = <FilterOption>[];

    for (final item in items) {
      final key = item.name.toLowerCase();
      if (seen.add(key)) {
        result.add(item);
      }
    }

    return result;
  }

  static List<MatiereOption> _uniqueMatieresByName(List<MatiereOption> items) {
    final seen = <String>{};
    final result = <MatiereOption>[];

    for (final item in items) {
      final key = item.name.toLowerCase();
      if (seen.add(key)) {
        result.add(item);
      }
    }

    return result;
  }

  static String? _extractId(dynamic value) {
    if (value is Map<String, dynamic>) {
      final id = (value['_id'] ?? '').toString();
      return id.isEmpty ? null : id;
    }

    if (value == null) {
      return null;
    }

    final id = value.toString();
    return id.isEmpty ? null : id;
  }

  static String parseError(Object error) {
    if (error is DioException) {
      final payload = error.response?.data;
      if (payload is Map<String, dynamic>) {
        final message = payload['error'] ?? payload['message'];
        if (message != null) {
          return message.toString();
        }
      }
      return 'Erreur réseau (${error.response?.statusCode ?? 'connexion'}).';
    }

    return error.toString().replaceFirst('Exception: ', '');
  }
}
