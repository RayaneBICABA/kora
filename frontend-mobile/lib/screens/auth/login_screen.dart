import 'dart:async';

import 'package:flutter/material.dart';
import '../../core/network/auth_api_service.dart';
import '../../core/config/colors.dart';
import '../../core/config/kora_icons.dart';
import '../../core/config/text_styles.dart';
import '../../core/config/widgets.dart';

/// Écran de connexion de l'application KORA
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _universityController = TextEditingController();
  String? _selectedUniversity;
  bool _isLoading = false;
  bool _isUniversitiesLoading = false;

  List<String> _universities = <String>[];

  @override
  void initState() {
    super.initState();
    unawaited(_loadUniversities());
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _universityController.dispose();
    super.dispose();
  }

  Future<void> _loadUniversities() async {
    setState(() => _isUniversitiesLoading = true);
    try {
      final universities = await AuthApiService.getUniversities();
      if (!mounted) {
        return;
      }
      setState(() {
        _universities = universities;
      });
    } catch (_) {
      // Ne bloque pas la connexion si la liste des universités échoue
    } finally {
      if (mounted) {
        setState(() => _isUniversitiesLoading = false);
      }
    }
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      try {
        await AuthApiService.login(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );

        if (!mounted) {
          return;
        }

        setState(() => _isLoading = false);
        unawaited(Navigator.of(context).pushReplacementNamed('/home'));
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AuthApiService.parseError(error)),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  void _navigateToSignup() {
    Navigator.of(context).pushNamed('/signup');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Image de fond avec overlay
              _buildHeaderImage(),

              // Formulaire
              Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 8),

                      // Champ Email
                      CustomTextField(
                        controller: _emailController,
                        hintText: 'Email',
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: Icons.email_outlined,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez entrer votre email';
                          }
                          if (!value.contains('@')) {
                            return 'Email invalide';
                          }
                          return null;
                        },
                      ),

                      const SizedBox(height: 16),

                      // Champ Mot de passe
                      CustomTextField(
                        controller: _passwordController,
                        hintText: 'Mot de passe',
                        obscureText: true,
                        prefixIcon: Icons.lock_outline,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez entrer votre mot de passe';
                          }
                          if (value.length < 6) {
                            return 'Le mot de passe doit contenir au moins 6 caractères';
                          }
                          return null;
                        },
                      ),

                      const SizedBox(height: 16),

                      // Sélection de l'université - UTILISE prefixWidget
                      CustomTextField(
                        hintText: 'Université',
                        readOnly: true,
                        enabled: !_isUniversitiesLoading,
                        prefixWidget: KoraIcons.university(
                          size: 20,
                          color: AppColors.iconDark,
                        ),
                        suffixIcon: const Icon(Icons.keyboard_arrow_down),
                        controller: _universityController,
                        onTap: _showUniversityPicker,
                      ),

                      const SizedBox(height: 64),

                      // Bouton de connexion
                      CustomButton(
                        text: 'Se connecter',
                        onPressed: _handleLogin,
                        isLoading: _isLoading,
                      ),

                      const SizedBox(height: 24),

                      // Lien vers inscription
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Vous n'avez pas de compte?",
                            style: AppTextStyles.bodyMedium,
                          ),
                          const SizedBox(width: 4),
                          GestureDetector(
                            onTap: _navigateToSignup,
                            child: Text(
                              "S'inscrire",
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: AppColors.primaryGold,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Construit l'en-tête avec l'image de fond
  Widget _buildHeaderImage() {
    return Container(
      height: 280,
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.grey.shade300,
            Colors.grey.shade100,
          ],
        ),
      ),
      child: Stack(
        children: [
          // Image de fond
          Positioned.fill(
            child: Image.asset(
              'assets/images/login_image.png',
              fit: BoxFit.cover,
            ),
          ),

          // Overlay gradient
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  // ignore: deprecated_member_use
                  AppColors.white.withOpacity(0.9),
                ],
              ),
            ),
          ),

          // Titre
          Positioned(
            bottom: 24,
            left: 24,
            child: Text(
              'Connexion',
              style: AppTextStyles.h1.copyWith(
                color: AppColors.primaryGold,
                fontSize: 40,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Affiche le sélecteur d'université
  void _showUniversityPicker() {
    if (_universities.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Liste des universités indisponible pour le moment.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    // ignore: inference_failure_on_function_invocation
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Titre
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Text(
                  'Sélectionner votre université',
                  style: AppTextStyles.h4,
                ),
              ),

              const Divider(),

              // Liste des universités
              ..._universities.map((university) {
                return ListTile(
                  title: Text(university),
                  onTap: () {
                    setState(() {
                      _selectedUniversity = university;
                      _universityController.text = university;
                    });
                    Navigator.pop(context);
                  },
                  trailing: _selectedUniversity == university
                      ? const Icon(Icons.check, color: AppColors.primaryGold)
                      : null,
                );
              }),
            ],
          ),
        );
      },
    );
  }
}
