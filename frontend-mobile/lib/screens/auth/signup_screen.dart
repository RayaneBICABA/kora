import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/config/colors.dart';
import '../../core/config/kora_icons.dart';
import '../../core/config/text_styles.dart';
import '../../core/config/widgets.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  // ================= FORM KEYS =================
  final _step1FormKey = GlobalKey<FormState>();
  final _step2FormKey = GlobalKey<FormState>();

  // ================= CONTROLLERS =================
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String? _selectedUniversity;
  File? _profileImage;

  bool _isLoading = false;
  int _currentStep = 0;

  final List<String> _universities = [
    'Université BIT (Burkina Institute of Technology)',
    'Université de Ouagadougou',
    'Université Nazi Boni',
    'Université Thomas Sankara',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // ================= IMAGE PICKER =================
  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => _profileImage = File(pickedFile.path));
    }
  }

  // ================= NAVIGATION =================
  void _goToNextStep() {
    if (_step1FormKey.currentState!.validate()) {
      setState(() => _currentStep = 1);
    }
  }

  Future<void> _handleSignup() async {
    if (!_step2FormKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    // ignore: inference_failure_on_instance_creation
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    setState(() => _isLoading = false);

    // Retour au login
    Navigator.of(context).pop();
  }

  void _navigateToLogin() {
    Navigator.of(context).pop();
  }

  // ================= STEP 1 =================
  List<Widget> _buildStep1() {
    return [
      _buildProfileImagePicker(),
      const SizedBox(height: 32),

      CustomTextField(
        controller: _nameController,
        hintText: 'Nom complet',
        prefixIcon: Icons.person_outline,
        validator: (value) =>
            value == null || value.isEmpty ? 'Veuillez entrer votre nom' : null,
      ),
      const SizedBox(height: 16),

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
    ];
  }

  // ================= STEP 2 =================
  List<Widget> _buildStep2() {
    return [
      CustomTextField(
        controller: _passwordController,
        hintText: 'Mot de passe',
        obscureText: true,
        prefixIcon: Icons.lock_outline,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Mot de passe obligatoire';
          }
          if (value.length < 6) {
            return 'Minimum 6 caractères';
          }
          return null;
        },
      ),
      const SizedBox(height: 16),

      CustomTextField(
        controller: _confirmPasswordController,
        hintText: 'Confirmer mot de passe',
        obscureText: true,
        prefixIcon: Icons.lock_outline,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Confirmation obligatoire';
          }
          if (value != _passwordController.text) {
            return 'Les mots de passe ne correspondent pas';
          }
          return null;
        },
      ),
      const SizedBox(height: 16),

      CustomTextField(
        hintText: 'Université',
        readOnly: true,
        prefixWidget: KoraIcons.university(
          size: 20,
          color: AppColors.iconDark,
        ),
        suffixIcon: const Icon(Icons.keyboard_arrow_down),
        controller: TextEditingController(text: _selectedUniversity),
        onTap: _showUniversityPicker,
        validator: (_) =>
            _selectedUniversity == null ? 'Université obligatoire' : null,
      ),
    ];
  }

  // ================= UI =================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildHeaderImage(),
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    IndexedStack(
                      index: _currentStep,
                      children: [
                        Form(
                          key: _step1FormKey,
                          child: Column(children: _buildStep1()),
                        ),
                        Form(
                          key: _step2FormKey,
                          child: Column(children: _buildStep2()),
                        ),
                      ],
                    ),

                    const SizedBox(height: 32),

                    if (_currentStep == 0) CustomButton(
                            text: 'Suivant',
                            onPressed: _goToNextStep,
                          ) else Row(
                            children: [
                              Expanded(
                                child: CustomButton(
                                  text: 'Retour',
                                  outlined: true,
                                  onPressed: () =>
                                      setState(() => _currentStep = 0),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: CustomButton(
                                  text: "S'inscrire",
                                  isLoading: _isLoading,
                                  onPressed: _handleSignup,
                                ),
                              ),
                            ],
                          ),

                    const SizedBox(height: 24),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Vous avez déjà un compte ?',
                          style: AppTextStyles.bodyMedium,
                        ),
                        const SizedBox(width: 4),
                        GestureDetector(
                          onTap: _navigateToLogin,
                          child: Text(
                            'Se connecter',
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
            ],
          ),
        ),
      ),
    );
  }

  // ================= COMPONENTS =================
  Widget _buildProfileImagePicker() {
    return Column(
      children: [
        Stack(
          alignment: Alignment.bottomRight,
          children: [
            CircleAvatar(
              radius: 55,
              backgroundColor: AppColors.lightGray,
              backgroundImage:
                  _profileImage != null ? FileImage(_profileImage!) : null,
              child: _profileImage == null
                  ? const Icon(
                      Icons.person,
                      size: 60,
                      color: AppColors.iconGray,
                    )
                  : null,
            ),
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppColors.primaryGold,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.camera_alt,
                  size: 18,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          'Ajouter une photo de profil',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textGray,
          ),
        ),
      ],
    );
  }

  Widget _buildHeaderImage() {
    return SizedBox(
      height: 280,
      width: double.infinity,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/register_image.png',
            fit: BoxFit.cover,
          ),
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
          const Positioned(
            bottom: 24,
            left: 24,
            child: Text(
              'Inscription',
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.bold,
                color: AppColors.primaryGold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showUniversityPicker() {
    // ignore: inference_failure_on_function_invocation
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Sélectionner votre université',
                style: AppTextStyles.h4,
              ),
            ),
            const Divider(),
            ..._universities.map(
              (university) => ListTile(
                title: Text(university),
                trailing: _selectedUniversity == university
                    ? const Icon(Icons.check, color: AppColors.primaryGold)
                    : null,
                onTap: () {
                  setState(() => _selectedUniversity = university);
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        );
      },
    );
  }
}
