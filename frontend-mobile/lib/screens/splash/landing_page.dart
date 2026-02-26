import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/config/colors.dart';
import '../../core/config/text_styles.dart';

/// Page de démarrage de l'application KORA
/// Affiche le logo et le baseline avant de rediriger vers l'authentification
class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    // Animation de fade-in
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();

    // Navigation automatique après 3 secondes
    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Stack(
        children: [
          _buildCornerArc(
            context,
            isTopLeft: true,
          ),
          _buildCornerArc(
            context,
            isTopLeft: false,
          ),

          // Contenu principal
          Center(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo KORA
                  _buildLogo(),
                  const SizedBox(height: 8),
                  // Baseline
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Text(
                      "Sauvegarder aujourd'hui,\ntransmettre demain.",
                      textAlign: TextAlign.center,
                      style: AppTextStyles.h4.copyWith(
                        fontWeight: FontWeight.normal,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Construit le logo KORA
  Widget _buildLogo() {
    return SizedBox(
      width: 220,
      height: 220,
      child: SvgPicture.asset(
        'assets/logo/kora_logo.svg',
      ),
    );
  }

  /// Construit un cercle partiellement visible pour créer l'arc de coin
  Widget _buildCornerArc(
    BuildContext context, {
    required bool isTopLeft,
  }) {
    final width = MediaQuery.sizeOf(context).width;
    final diameter = isTopLeft ? width * 0.70 : width * 0.74;
    final strokeWidth = width * 0.055;

    return Positioned(
      top: isTopLeft ? -diameter * 0.22 : null,
      left: isTopLeft ? -diameter * 0.30 : null,
      bottom: isTopLeft ? null : -diameter * 0.28,
      right: isTopLeft ? null : -diameter * 0.32,
      child: Container(
        width: diameter,
        height: diameter,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: AppColors.primaryGold,
            width: strokeWidth,
          ),
        ),
      ),
    );
  }
}
