import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core/config/theme.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/explorer/explorer_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/offline/offline_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/splash/landing_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Configuration de la barre de statut
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  
  runApp(const KoraApp());
}

/// Application principale KORA
class KoraApp extends StatelessWidget {
  const KoraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KORA',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const LandingPage(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/home': (context) => const HomeScreen(),
        '/explorer': (context) => const ExplorerScreen(),
        '/offline': (context) => const OfflineScreen(),
        '/profile': (context) => const ProfileScreen(),
      },
    );
  }
}
