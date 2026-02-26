import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/config/colors.dart';
import '../../core/config/document_card.dart';
import '../../core/config/kora_icons.dart';
import '../../core/config/text_styles.dart';
import '../../core/network/resource_api_service.dart';
import '../../core/network/session_manager.dart';
import '../../models/document.dart';
import '../../models/user.dart';

/// Écran de recherche et exploration des documents
class ExplorerScreen extends StatefulWidget {
  const ExplorerScreen({super.key});

  @override
  State<ExplorerScreen> createState() => _ExplorerScreenState();
}

class _ExplorerScreenState extends State<ExplorerScreen> {
  final _searchController = TextEditingController();
  String? _selectedType;
  String? _selectedLevel;
  String? _selectedFiliere;
  bool _isLoading = true;
  String? _errorMessage;
  User? _currentUser;

  final List<String> _types = [
    'Tous',
    'Cours',
    'Examen',
    'TD',
    'Corrigé',
  ];
  final List<String> _levels = ['Tous', 'L1', 'L2', 'L3', 'M1', 'M2'];
  // ignore: unused_field
  final List<String> _filiere = [
    'Tous',
    'Informatique',
    'Mécanique',
    'Electicité'
  ];

  List<Document> _allDocuments = <Document>[];

  @override
  void initState() {
    super.initState();
    unawaited(_loadData());
  }

  Future<void> _loadData() async {
    try {
      final user = await SessionManager.getUser();
      final resources = await ResourceApiService.getResources();
      if (!mounted) {
        return;
      }
      setState(() {
        _currentUser = user;
        _allDocuments = resources;
        _isLoading = false;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _errorMessage = ResourceApiService.parseError(error);
        _isLoading = false;
      });
    }
  }

  List<Document> get _filteredDocuments {
    return _allDocuments.where((doc) {
      // Filtre par recherche
      if (_searchController.text.isNotEmpty &&
          !doc.title
              .toLowerCase()
              .contains(_searchController.text.toLowerCase())) {
        return false;
      }

      // Filtre par type
      if (_selectedType != null && _selectedType != 'Tous') {
        if (doc.typeLabel.toLowerCase() != _selectedType!.toLowerCase()) {
          return false;
        }
      }

      // Filtre par niveau
      if (_selectedLevel != null && _selectedLevel != 'Tous') {
        if (!doc.level.contains(_selectedLevel!)) {
          return false;
        }
      }

      // Filtre par filiere
      if (_selectedFiliere != null && _selectedFiliere != 'Tous') {
        if (!doc.filiere!.contains(_selectedFiliere!)) {
          return false;
        }
      }

      return true;
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Rechercher un document',
          style: AppTextStyles.h4,
        ),
        centerTitle: false,
      ),
      body: Column(
        children: [
          // Section de recherche et filtres
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                // Barre de recherche
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  decoration: BoxDecoration(
                    color: AppColors.lightGray,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          onChanged: (value) => setState(() {}),
                          decoration: InputDecoration(
                            hintText: "Entrer le nom d'un document",
                            hintStyle: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.textGray,
                            ),
                            border: InputBorder.none,
                            contentPadding:
                                const EdgeInsets.symmetric(vertical: 16),
                          ),
                        ),
                      ),
                      const Icon(
                        Icons.search,
                        color: AppColors.iconGray,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Filtres Type et Niveau
                Row(
                  children: [
                    Expanded(
                      child: _buildFilterChip(
                        label: _selectedType ?? 'Type',
                        onTap: _showTypeFilter,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildFilterChip(
                        label: _selectedLevel ?? 'Niveau',
                        onTap: _showLevelFilter,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Filtre Filiere
                _buildFilterChip(
                  label: _selectedFiliere ?? 'Filiere',
                  onTap: _showNiveauFilter,
                  fullWidth: true,
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Liste des documents filtrés
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
                    : _filteredDocuments.isEmpty
                        ? _buildEmptyState()
                        : ListView.builder(
                            padding: const EdgeInsets.all(20),
                            itemCount: _filteredDocuments.length,
                            itemBuilder: (context, index) {
                              return DocumentCard(
                                document: _filteredDocuments[index],
                                onDownload: () =>
                                    _handleDownload(_filteredDocuments[index]),
                                onTap: () => _handleDocumentTap(
                                    _filteredDocuments[index]),
                              );
                            },
                          ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  /// Construit un chip de filtre
  Widget _buildFilterChip({
    required String label,
    required VoidCallback onTap,
    bool fullWidth = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: fullWidth ? double.infinity : null,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.lightGray,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textDark,
                fontWeight: FontWeight.w500,
              ),
            ),
            const Icon(
              Icons.keyboard_arrow_down,
              color: AppColors.iconGray,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  /// État vide
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 80,
            // ignore: deprecated_member_use
            color: AppColors.iconGray.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'Aucun document trouvé',
            style: AppTextStyles.h4.copyWith(
              color: AppColors.textGray,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "Essayez d'ajuster vos filtres",
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textGray,
            ),
          ),
        ],
      ),
    );
  }

  /// Affiche le filtre de type
  void _showTypeFilter() {
    _showFilterBottomSheet(
      title: 'Sélectionner un type',
      items: _types,
      selectedItem: _selectedType,
      onSelect: (value) {
        setState(() {
          _selectedType = value == 'Tous' ? null : value;
        });
      },
    );
  }

  /// Affiche le filtre de niveau
  void _showLevelFilter() {
    _showFilterBottomSheet(
      title: 'Sélectionner un niveau',
      items: _levels,
      selectedItem: _selectedLevel,
      onSelect: (value) {
        setState(() {
          _selectedLevel = value == 'Tous' ? null : value;
        });
      },
    );
  }

  /// Affiche le filtre de niveau supplémentaire
  void _showNiveauFilter() {
    _showFilterBottomSheet(
      title: 'Sélectionner une filiere',
      items: _filiere,
      selectedItem: _selectedFiliere,
      onSelect: (value) {
        setState(() {
          _selectedFiliere = value == 'Tous' ? null : value;
        });
      },
    );
  }

  /// Bottom sheet générique pour les filtres
  void _showFilterBottomSheet({
    required String title,
    required List<String> items,
    // ignore: inference_failure_on_function_return_type
    required Function(String) onSelect,
    String? selectedItem,
  }) {
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
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Text(title, style: AppTextStyles.h4),
              ),
              const Divider(),
              ...items.map((item) {
                return ListTile(
                  title: Text(item),
                  onTap: () {
                    onSelect(item);
                    Navigator.pop(context);
                  },
                  trailing: selectedItem == item
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
        resourceId: document.id,
        user: user,
      ).then((_) {
        if (!mounted) {
          return;
        }
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
                      child: KoraIcons.search(color: AppColors.textLight),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Explorer',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: KoraIcons.download(color: AppColors.iconGray),
                onPressed: () => Navigator.of(context).pushNamed('/offline'),
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
