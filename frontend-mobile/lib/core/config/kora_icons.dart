import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Utilitaire pour charger les icônes SVG personnalisées depuis assets/icons/
class KoraIcons {
  static Widget home({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/home.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget search({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/search.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget profile({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/profile.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget download({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/download.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget documentCheck({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/file.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget book({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/book.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget file({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/file.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  /// Icône alternative pour représenter le téléchargement de documents
  static Widget downloadDocument({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/download1.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }

  static Widget university({
    double size = 24,
    Color? color,
  }) {
    return SvgPicture.asset(
      'assets/icons/university.svg',
      width: size,
      height: size,
      colorFilter:
          color != null ? ColorFilter.mode(color, BlendMode.srcIn) : null,
    );
  }
}
