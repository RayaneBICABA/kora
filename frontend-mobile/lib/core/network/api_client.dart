import 'package:dio/dio.dart';

import '../config/constants.dart';
import 'session_manager.dart';

class ApiClient {
  ApiClient._();

  static Dio? _dio;

  static Dio get instance {
    _dio ??= _buildDio();
    return _dio!;
  }

  static Dio _buildDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: _resolveApiBaseUrl(),
        connectTimeout: AppConstants.connectionTimeout,
        receiveTimeout: AppConstants.apiTimeout,
        sendTimeout: AppConstants.apiTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await SessionManager.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
      ),
    );

    return dio;
  }

  static String _resolveApiBaseUrl() {
    final rawBase = AppConstants.baseUrl.trim();
    if (rawBase.endsWith('/api')) {
      return rawBase;
    }

    if (rawBase.endsWith('/')) {
      return '${rawBase.substring(0, rawBase.length - 1)}${AppConstants.apiPrefix}';
    }

    return '$rawBase${AppConstants.apiPrefix}';
  }
}
