import 'package:flutter/material.dart';

class CockpitTheme {
  static const Color bgCore = Color(0xFF05080C);
  static const Color bgCard = Color(0xDC0A1018);
  static const Color bgHeader = Color(0xF2070B10);
  static const Color bgDeck = Color(0xF2070B12);

  static const Color cyanPrimary = Color(0xFF00F3FF);
  static const Color cyanGlow = Color(0x6600F3FF);
  static const Color cyanDim = Color(0x2600F3FF);

  static const Color greenActive = Color(0xFF00FFAA);
  static const Color greenGlow = Color(0x6600FFAA);

  static const Color redAccent = Color(0xFFFF2A55);
  static const Color redGlow = Color(0x80FF2A55);

  static const Color amberWarn = Color(0xFFFFB703);
  static const Color textPrimary = Color(0xFFE6F1FF);
  static const Color textSecondary = Color(0xFF7E9BB5);

  static const Color borderCyan = Color(0x4700F3FF);
  static const Color borderFaint = Color(0x1AFFFFFF);

  static BoxDecoration cardBox = BoxDecoration(
    color: bgCard,
    borderRadius: BorderRadius.circular(8),
    border: Border.all(color: borderCyan, width: 1),
    boxShadow: const [
      BoxShadow(
        color: Colors.black87,
        blurRadius: 20,
        spreadRadius: 2,
      ),
    ],
  );
}
