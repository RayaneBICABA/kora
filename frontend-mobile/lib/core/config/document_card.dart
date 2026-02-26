import 'package:flutter/material.dart';

import '../../models/document.dart';
import 'colors.dart';
import 'kora_icons.dart';
import 'text_styles.dart';

/// Carte représentant un document académique
class DocumentCard extends StatelessWidget {
  const DocumentCard({
    required this.document,
    super.key,
    this.onDownload,
    this.onTap,
    this.showDownloadButton = true,
  });
  final Document document;
  final VoidCallback? onDownload;
  final VoidCallback? onTap;
  final bool showDownloadButton;

  Color _getIconColor() {
    if (document.type == DocumentType.examen ||
        document.type == DocumentType.td) {
      return AppColors.primaryGold;
    }
    return AppColors.iconGray;
  }

  Color _getBadgeColor() {
    switch (document.type) {
      case DocumentType.cours:
        return AppColors.badgeCours;
      case DocumentType.examen:
        return AppColors.badgeExamen;
      case DocumentType.td:
        return AppColors.badgeTD;
      case DocumentType.corrige:
        return AppColors.badgeCorrige;
    }
  }

  Color _getBadgeTextColor() {
    switch (document.type) {
      case DocumentType.examen:
      case DocumentType.td:
        return AppColors.primaryGold;
      case DocumentType.cours:
        return AppColors.badgeCours;
      case DocumentType.corrige:
        return AppColors.badgeCorrige;
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            // Icône du document - FORCER LA TAILLE
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                // ignore: deprecated_member_use
                color: _getIconColor().withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: SizedBox(
                  width: 28,  // Augmenté de 24 à 28
                  height: 28, // Augmenté de 24 à 28
                  child: KoraIcons.file(
                    size: 28,
                    color: _getIconColor(),
                  ),
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Informations du document
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Titre
                  Text(
                    document.title,
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: document.type == DocumentType.examen ||
                              document.type == DocumentType.td
                          ? AppColors.primaryGold
                          : AppColors.textDark,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 4),

                  // Badge et niveau
                  Row(
                    children: [
                      // Badge de type
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          // ignore: deprecated_member_use
                          color: _getBadgeColor().withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            // ignore: deprecated_member_use
                            color: _getBadgeColor().withOpacity(0.3),
                          ),
                        ),
                        child: Text(
                          document.typeLabel,
                          style: AppTextStyles.badge.copyWith(
                            color: _getBadgeTextColor(),
                          ),
                        ),
                      ),

                      const SizedBox(width: 8),

                      // Niveau
                      Text(
                        '${document.level} • ${document.filiere}',
                        style: AppTextStyles.caption,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Bouton de téléchargement
            if (showDownloadButton)
              IconButton(
                onPressed: onDownload,
                icon: document.isDownloaded
                    ? const Icon(
                        Icons.check_circle,
                        color: AppColors.success,
                        size: 24,
                      )
                    : KoraIcons.downloadDocument(
                        color: AppColors.primaryGold,
                      ),
              ),
          ],
        ),
      ),
    );
  }
}
