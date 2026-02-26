/// Constantes globales de l'application KORA
class AppConstants {
  AppConstants._();

  // Informations de l'application
  static const String appName = 'KORA';
  static const String appVersion = '0.1.0';
  static const String appDescription =
      'Plateforme de centralisation et de transmission des ressources académiques';

  // Configuration API
  static const String baseUrl = String.fromEnvironment(
    'KORA_API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );
  static const String apiPrefix = '/api';
  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration connectionTimeout = Duration(seconds: 15);

  // Configuration locale storage
  static const String hiveBoxName = 'kora_box';
  static const String userBoxName = 'user_box';
  static const String cacheBoxName = 'cache_box';

  // SharedPreferences keys
  static const String keyAccessToken = 'access_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyUserId = 'user_id';
  static const String keyIsFirstLaunch = 'is_first_launch';
  static const String keyThemeMode = 'theme_mode';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 50;

  // Cache
  static const Duration cacheValidityDuration = Duration(hours: 24);
  static const int maxCacheSize = 100; // MB

  // File upload
  static const int maxFileSize = 50 * 1024 * 1024; // 50 MB
  static const List<String> allowedFileExtensions = [
    'pdf',
    'doc',
    'docx',
    'ppt',
    'pptx',
    'xls',
    'xlsx',
    'jpg',
    'jpeg',
    'png',
  ];

  // URLs externes
  static const String termsOfServiceUrl = 'https://kora.bf/terms';
  static const String privacyPolicyUrl = 'https://kora.bf/privacy';
  static const String supportEmail = 'support@kora.bf';

  // Messages d'erreur par défaut
  static const String errorNetworkMessage =
      'Problème de connexion. Vérifiez votre connexion internet.';
  static const String errorServerMessage =
      'Erreur serveur. Veuillez réessayer plus tard.';
  static const String errorUnknownMessage =
      "Une erreur inattendue s'est produite.";
}
