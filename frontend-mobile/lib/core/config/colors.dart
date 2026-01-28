import 'package:flutter/material.dart';

/// Palette de couleurs officielle KORA
class KoraColors {
  KoraColors._();

  // Couleurs principales
  static const Color gold = Color(0xFFC58B2B);
  static const Color dark = Color(0xFF1E1E1E);
  
  // Nuances de gold
  static const Color goldLight = Color(0xFFD4A855);
  static const Color goldDark = Color(0xFFB07A1F);
  
  // Nuances de dark
  static const Color darkLight = Color(0xFF2A2A2A);
  static const Color darkDarker = Color(0xFF121212);
  
  // Couleurs fonctionnelles
  static const Color success = Color(0xFF4CAF50);
  static const Color error = Color(0xFFF44336);
  static const Color warning = Color(0xFFFF9800);
  static const Color info = Color(0xFF2196F3);
  
  // Couleurs neutres
  static const Color white = Color(0xFFFFFFFF);
  static const Color grey = Color(0xFF9E9E9E);
  static const Color greyLight = Color(0xFFE0E0E0);
  static const Color greyDark = Color(0xFF616161);
  
  // Couleurs de texte
  static const Color textPrimary = dark;
  static const Color textSecondary = Color(0xFF757575);
  static const Color textDisabled = Color(0xFFBDBDBD);
  static const Color textOnGold = white;
  static const Color textOnDark = white;
}