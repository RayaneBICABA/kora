import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../models/user.dart';
import '../config/constants.dart';

class SessionManager {
  SessionManager._();

  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();
  static const String _userDataKey = 'user_data';
  static const String _profileImageUrlKey = 'profile_image_url';

  static Future<void> saveToken(String token) {
    return _secureStorage.write(key: AppConstants.keyAccessToken, value: token);
  }

  static Future<String?> getToken() {
    return _secureStorage.read(key: AppConstants.keyAccessToken);
  }

  static Future<void> saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userDataKey, jsonEncode(user.toJson()));
  }

  static Future<User?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_userDataKey);
    if (raw == null || raw.isEmpty) {
      return null;
    }

    return User.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  static Future<void> saveProfileImageUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileImageUrlKey, url);
  }

  static Future<String?> getProfileImageUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_profileImageUrlKey);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await _secureStorage.delete(key: AppConstants.keyAccessToken);
    await prefs.remove(_userDataKey);
    await prefs.remove(_profileImageUrlKey);
  }
}
