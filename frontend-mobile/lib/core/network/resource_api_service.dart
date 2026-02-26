import 'package:dio/dio.dart';

import '../../models/document.dart';
import '../../models/user.dart';
import 'api_client.dart';

class ResourceApiService {
  ResourceApiService._();

  static Future<List<Document>> getResources() async {
    final response = await ApiClient.instance.get<List<dynamic>>('/ressources');
    final data = response.data ?? <dynamic>[];

    return data
        .whereType<Map<String, dynamic>>()
        .map(Document.fromBackendResource)
        .toList();
  }

  static Future<void> markAsDownloaded({
    required String resourceId,
    required User user,
  }) async {
    try {
      await ApiClient.instance
          .patch<void>('/ressources/$resourceId/increment-download');
    } catch (_) {
      // L'incrément n'est pas bloquant pour la mise en offline côté mobile.
    }

    await ApiClient.instance.post<void>(
      '/offline-downloads',
      data: {
        'resourceId': resourceId,
        'userId': user.id,
      },
    );
  }

  static Future<List<Document>> getOfflineDocumentsForUser(
      String userId) async {
    final response =
        await ApiClient.instance.get<List<dynamic>>('/offline-downloads');
    final records = response.data ?? <dynamic>[];

    final documents = <Document>[];
    for (final record in records.whereType<Map<String, dynamic>>()) {
      final recordUser = record['userId'];
      final extractedUserId = recordUser is Map<String, dynamic>
          ? (recordUser['_id'] ?? '').toString()
          : recordUser?.toString() ?? '';

      if (extractedUserId != userId) {
        continue;
      }

      final resource = record['resourceId'];
      if (resource is! Map<String, dynamic>) {
        continue;
      }

      documents.add(
        Document.fromBackendResource(
          resource,
          offlineRecordId: (record['_id'] ?? '').toString(),
          downloadedAt:
              DateTime.tryParse((record['dataSynchro'] ?? '').toString()),
          isDownloaded: true,
        ),
      );
    }

    return documents;
  }

  static Future<void> removeOfflineRecord(String offlineRecordId) async {
    await ApiClient.instance
        .delete<void>('/offline-downloads/$offlineRecordId');
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
