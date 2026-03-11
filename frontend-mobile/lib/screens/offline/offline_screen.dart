import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/config/colors.dart';
import '../../core/config/document_card.dart';
import '../../core/config/kora_icons.dart';
import '../../core/config/text_styles.dart';
import '../../core/network/resource_api_service.dart';
import '../../core/network/session_manager.dart';
import '../../models/document.dart';

/// Écran affichant les documents téléchargés disponibles hors ligne
class OfflineScreen extends StatefulWidget {
  const OfflineScreen({super.key});

  @override
  State<OfflineScreen> createState() => _OfflineScreenState();
}

class _OfflineScreenState extends State<OfflineScreen> {
  List<Document> _offlineDocuments = <Document>[];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    unawaited(_loadOfflineDocuments());
  }

  Future<void> _loadOfflineDocuments() async {
    try {
      final user = await SessionManager.getUser();
      if (user == null || user.id.isEmpty) {
        throw Exception('Session utilisateur introuvable.');
      }

      final data = await ResourceApiService.getOfflineDocumentsForUser(user.id);
      if (!mounted) {
        return;
      }

      setState(() {
        _offlineDocuments = data;
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
        child: Column(
          children: [
            // En-tête
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),

                  // Titre
                  const Text(
                    'Mode Offline',
                    style: AppTextStyles.h2,
                  ),

                  const SizedBox(height: 24),

                  // Carte d'information
                  _buildInfoCard(),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Liste des documents
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null
                      ? Center(
                          child: Text(
                            _errorMessage!,
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.error,
                            ),
                          ),
                        )
                      : _offlineDocuments.isEmpty
                          ? _buildEmptyState()
                          : ListView.builder(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              itemCount: _offlineDocuments.length,
                              itemBuilder: (context, index) {
                                return DocumentCard(
                                  document: _offlineDocuments[index],
                                  onTap: () => _handleDocumentTap(
                                    _offlineDocuments[index],
                                  ),
                                  showDownloadButton: false,
                                );
                              },
                            ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  /// Construit la carte d'information
  Widget _buildInfoCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.mediumGray,
        ),
      ),
      child: Row(
        children: [
          // Icône
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              // ignore: deprecated_member_use
              color: AppColors.primaryGold.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: KoraIcons.book(
              color: AppColors.primaryGold,
              size: 32,
            ),
          ),

          const SizedBox(width: 16),

          // Texte
          Expanded(
            child: Row(
              children: [
                Text(
                  _offlineDocuments.length.toString(),
                  style: AppTextStyles.h2.copyWith(
                    color: AppColors.textDark,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Documents prêts pour une\nlecture hors ligne',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textDark,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// État vide
  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.cloud_off_outlined,
              size: 100,
              // ignore: deprecated_member_use
              color: AppColors.iconGray.withOpacity(0.5),
            ),
            const SizedBox(height: 24),
            Text(
              'Aucun document hors ligne',
              style: AppTextStyles.h3.copyWith(
                color: AppColors.textGray,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              "Téléchargez des documents depuis l'accueil ou l'explorateur pour y accéder sans connexion",
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textGray,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  /// Gère le tap sur un document
  void _handleDocumentTap(Document document) {
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
            if (document.downloadedAt != null)
              Text(
                'Téléchargé: ${_formatDate(document.downloadedAt!)}',
              ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _confirmDelete(document);
            },
            child: const Text(
              'Supprimer',
              style: TextStyle(color: AppColors.error),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              unawaited(_openOfflineDocument(document));
            },
            child: const Text('Ouvrir'),
          ),
        ],
      ),
    );
  }

  /// Confirme la suppression d'un document
  void _confirmDelete(Document document) {
    // ignore: inference_failure_on_function_invocation
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer le document'),
        content: Text(
          'Êtes-vous sûr de vouloir supprimer "${document.title}" ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () {
              unawaited(_deleteOfflineDocument(document));
            },
            child: const Text(
              'Supprimer',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteOfflineDocument(Document document) async {
    try {
      final user = await SessionManager.getUser();
      if (user == null || user.id.isEmpty) {
        throw Exception('Session utilisateur introuvable.');
      }
      await ResourceApiService.removeOfflineRecord(
        userId: user.id,
        document: document,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        _offlineDocuments.removeWhere((doc) => doc.id == document.id);
      });
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Document supprimé'),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (error) {
      if (!mounted) {
        return;
      }
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(ResourceApiService.parseError(error)),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _openOfflineDocument(Document document) async {
    try {
      await ResourceApiService.openOfflineDocument(document);
    } catch (error) {
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
    }
  }

  /// Formate une date
  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return "Aujourd'hui";
    } else if (difference.inDays == 1) {
      return 'Hier';
    } else if (difference.inDays < 7) {
      return 'Il y a ${difference.inDays} jours';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
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
              IconButton(
                icon: KoraIcons.home(color: AppColors.iconGray),
                onPressed: () => Navigator.of(context).pushNamed('/home'),
              ),
              IconButton(
                icon: KoraIcons.search(color: AppColors.iconGray),
                onPressed: () => Navigator.of(context).pushNamed('/explorer'),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.primaryGold,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 20,
                      height: 20,
                      child: KoraIcons.download(color: AppColors.textLight),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Offline',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: KoraIcons.profile(color: AppColors.iconGray),
                onPressed: () => Navigator.of(context).pushNamed('/profile'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
