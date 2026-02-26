import 'package:flutter/material.dart';

/// Constantes de couleurs pour l'application KORA
/// Respecte l'identité visuelle définie dans le README
class AppColors {
  AppColors._();

  // Couleurs principales
  static const Color primaryGold = Color(0xFFC58B2B);
  static const Color darkBackground = Color(0xFF1E1E1E);
  
  // Couleurs de fond
  static const Color white = Color(0xFFFFFFFF);
  static const Color lightGray = Color(0xFFF5F5F5);
  static const Color mediumGray = Color(0xFFE0E0E0);
  
  // Couleurs de texte
  static const Color textDark = Color(0xFF1E1E1E);
  static const Color textGray = Color(0xFF757575);
  static const Color textLight = Color(0xFFFFFFFF);
  
  // Couleurs des badges de type de document
  static const Color badgeCours = Color(0xFF4A90E2);      // Bleu
  static const Color badgeExamen = Color(0xFFF5A623);     // Orange
  static const Color badgeTD = Color(0xFF7ED321);         // Vert
  static const Color badgeCorrige = Color(0xFFBD10E0);    // Violet
  static const Color badgeSoutenance = Color(0xFF50E3C2); // Cyan
  
  // Couleurs d'icônes
  static const Color iconGray = Color(0xFF9E9E9E);
  static const Color iconDark = Color(0xFF424242);
  
  // Couleurs de statut
  static const Color success = Color(0xFF4CAF50);
  static const Color error = Color(0xFFF44336);
  static const Color warning = Color(0xFFFF9800);
  
  // Overlay et shadows
  static const Color overlay = Color(0x80000000);
  static const Color shadow = Color(0x1A000000);
}
