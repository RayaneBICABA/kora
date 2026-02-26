import 'dart:io';

import 'package:dio/dio.dart';

import '../../models/user.dart';
import 'api_client.dart';
import 'session_manager.dart';

class AuthResult {
  AuthResult({
    required this.user,
    required this.token,
  });

  final User user;
  final String token;
}

class AuthApiService {
  AuthApiService._();

  static Future<List<String>> getUniversities() async {
    final response =
        await ApiClient.instance.get<List<dynamic>>('/universites');
    final data = response.data ?? <dynamic>[];

    return data
        .whereType<Map<String, dynamic>>()
        .map((item) => (item['nom'] ?? '').toString())
        .where((name) => name.isNotEmpty)
        .toList();
  }

  static Future<AuthResult> login({
    required String email,
    required String password,
  }) async {
    final response = await ApiClient.instance.post<Map<String, dynamic>>(
      '/auth/login',
      data: {
        'email': email,
        'motDePasse': password,
      },
    );

    final payload = response.data ?? <String, dynamic>{};
    final user = User.fromBackend(payload['user'] as Map<String, dynamic>?);
    final token = (payload['token'] ?? '').toString();

    if (token.isEmpty) {
      throw Exception('Token de connexion manquant.');
    }

    await SessionManager.saveToken(token);
    await SessionManager.saveUser(user);

    return AuthResult(user: user, token: token);
  }

  static Future<AuthResult> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String universityName,
  }) async {
    final response = await ApiClient.instance.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'nom': lastName,
        'prenom': firstName,
        'email': email,
        'motDePasse': password,
        'universite': universityName,
      },
    );

    final payload = response.data ?? <String, dynamic>{};
    final user = User.fromBackend(payload['user'] as Map<String, dynamic>?);
    final token = (payload['token'] ?? '').toString();

    if (token.isEmpty) {
      throw Exception('Token de création de compte manquant.');
    }

    await SessionManager.saveToken(token);
    await SessionManager.saveUser(user);

    return AuthResult(user: user, token: token);
  }

  static Future<String> uploadProfileImage(File imageFile) async {
    final fileName = imageFile.path.split('/').last;
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(imageFile.path, filename: fileName),
    });

    final response = await ApiClient.instance.post<Map<String, dynamic>>(
      '/upload',
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );

    final payload = response.data ?? <String, dynamic>{};
    final fileUrl = (payload['url'] ?? '').toString();

    if (fileUrl.isEmpty) {
      throw Exception('URL de la photo manquante après upload.');
    }

    final serverBase =
        ApiClient.instance.options.baseUrl.replaceFirst('/api', '');
    return '$serverBase$fileUrl';
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
