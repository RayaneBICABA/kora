import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/config/colors.dart';
import '../../core/config/document_card.dart';
import '../../core/config/kora_icons.dart';
import '../../core/config/text_styles.dart';
import '../../core/network/resource_api_service.dart';
import '../../core/network/user_api_service.dart';
import '../../models/document.dart';
import '../../models/user.dart';

/// Écran d'accueil de l'application KORA
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  bool _isLoading = true;
  String? _errorMessage;
  User? _currentUser;
  List<Document> _recentDocuments = <Document>[];

  @override
  void initState() {
    super.initState();
    unawaited(_loadData());
  }

  Future<void> _loadData() async {
    try {
      final user = await UserApiService.refreshCurrentUser();
      final resources = await ResourceApiService.getResources();
      final offlineIds = user == null || user.id.isEmpty
          ? <String>{}
          : await ResourceApiService.getOfflineDocumentIds(user.id);

      if (!mounted) {
        return;
      }

      setState(() {
        _currentUser = user;
        _recentDocuments = resources
            .map(
              (document) => document.copyWith(
                isDownloaded: offlineIds.contains(document.id),
              ),
            )
            .take(4)
            .toList();
        _isLoading = false;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
        _errorMessage = ResourceApiService.parseError(error);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // En-tête avec profil
                _buildHeader(),

                const SizedBox(height: 24),

                // Carte d'information
                _buildInfoCard(),

                const SizedBox(height: 32),

                // Section "Ajoutés récemment"
                const Text(
                  'Ajoutés récemment',
                  style: AppTextStyles.h3,
                ),

                const SizedBox(height: 16),

                // Liste des documents
                if (_isLoading)
                  const Center(child: CircularProgressIndicator())
                else if (_errorMessage != null)
                  Text(
                    _errorMessage!,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.error,
                    ),
                  )
                else if (_recentDocuments.isEmpty)
                  const Text('Aucune ressource disponible pour le moment.')
                else
                  ..._recentDocuments.map(
                    (doc) => DocumentCard(
                      document: doc,
                      onDownload: () => _handleDownload(doc),
                      onTap: () => _handleDocumentTap(doc),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  /// Construit l'en-tête avec le profil utilisateur
  Widget _buildHeader() {
    return Row(
      children: [
        // Informations utilisateur
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _currentUser?.name.isNotEmpty ?? false
                    ? _currentUser!.name
                    : 'Utilisateur',
                style: AppTextStyles.h4,
              ),
              Text(
                'Bienvenue sur KORA',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textGray,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Construit la carte d'information dorée
  Widget _buildInfoCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            AppColors.primaryGold,
            Color(0xFFB87922),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            // ignore: deprecated_member_use
            color: AppColors.primaryGold.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Bienvenue sur l'espace KORA",
                  style: AppTextStyles.h4.copyWith(
                    color: AppColors.textLight,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Propulsez vos révisions avec plus de 1 000 ressources à portée de main !',
                  style: AppTextStyles.bodyMedium.copyWith(
                    // ignore: deprecated_member_use
                    color: AppColors.textLight.withOpacity(0.95),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              // ignore: deprecated_member_use
              color: AppColors.textLight.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: KoraIcons.book(
              color: AppColors.textLight,
              size: 32,
            ),
          ),
        ],
      ),
    );
  }

  /// Construit la barre de navigation inférieure
  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 8,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildNavItemSvg(
                iconBuilder: (color) => KoraIcons.home(color: color),
                label: 'Accueil',
                index: 0,
              ),
              _buildNavItemSvg(
                iconBuilder: (color) => KoraIcons.search(color: color),
                label: 'Explorer',
                index: 1,
              ),
              _buildNavItemSvg(
                iconBuilder: (color) => KoraIcons.download(color: color),
                label: 'Offline',
                index: 3,
              ),
              _buildNavItemSvg(
                iconBuilder: (color) => KoraIcons.profile(color: color),
                label: 'Profile',
                index: 2,
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Construit un élément de la barre de navigation avec icône SVG
  Widget _buildNavItemSvg({
    required Widget Function(Color?) iconBuilder,
    required String label,
    required int index,
  }) {
    final isActive = _currentIndex == index;

    return GestureDetector(
      onTap: () => _handleNavigation(index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? AppColors.primaryGold : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: iconBuilder(
                isActive ? AppColors.textLight : AppColors.iconGray,
              ),
            ),
            if (isActive) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textLight,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  /// Gère la navigation entre les pages
  void _handleNavigation(int index) {
    setState(() => _currentIndex = index);

    switch (index) {
      case 0:
        // Déjà sur Home
        break;
      case 1:
        Navigator.of(context).pushNamed('/explorer');
      case 2:
        Navigator.of(context).pushNamed('/profile');
      case 3:
        Navigator.of(context).pushNamed('/offline');
    }
  }

  /// Gère le téléchargement d'un document
  void _handleDownload(Document document) {
    final user = _currentUser;
    if (user == null || user.id.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Session invalide, veuillez vous reconnecter.'),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    unawaited(
      ResourceApiService.markAsDownloaded(
        document: document,
        user: user,
      ).then((offlineDocument) {
        if (!mounted) {
          return;
        }
        setState(() {
          _recentDocuments = _recentDocuments
              .map(
                (item) => item.id == document.id
                    ? item.copyWith(
                        isDownloaded: true,
                        filePath: offlineDocument.filePath,
                        downloadedAt: offlineDocument.downloadedAt,
                      )
                    : item,
              )
              .toList();
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('"${document.title}" ajouté en offline.'),
            backgroundColor: AppColors.success,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }).catchError((Object error) {
        if (!mounted) {
          return;
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(ResourceApiService.parseError(error)),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }),
    );
  }

  /// Gère le tap sur un document
  void _handleDocumentTap(Document document) {
    // Navigation vers les détails du document
    // ignore: inference_failure_on_function_invocation
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(document.title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Type: ${document.typeLabel}'),
            Text('Niveau: ${document.level}'),
            Text('Filiere: ${document.filiere}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }
}
