import 'package:dio/dio.dart';

import '../../models/user.dart';
import 'api_client.dart';
import 'auth_api_service.dart';
import 'session_manager.dart';

class UserApiService {
  UserApiService._();

  static Future<User?> refreshCurrentUser() async {
    final current = await SessionManager.getUser();
    if (current == null || current.id.isEmpty) {
      return current;
    }

    final response = await ApiClient.instance
        .get<Map<String, dynamic>>('/users/${current.id}');
    final data = response.data;
    if (data == null) {
      return current;
    }

    final user = User.fromBackend(data);
    await SessionManager.saveUser(user);
    return user;
  }

  static String parseError(Object error) {
    return AuthApiService.parseError(error is DioException ? error : error);
  }
}
