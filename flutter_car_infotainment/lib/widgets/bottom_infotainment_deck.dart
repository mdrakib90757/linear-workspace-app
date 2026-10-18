import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/car_telemetry.dart';
import 'cockpit_theme.dart';

class BottomInfotainmentDeck extends StatelessWidget {
  final CarTelemetry telemetry;

  const BottomInfotainmentDeck({super.key, required this.telemetry});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: const BoxDecoration(
        color: CockpitTheme.bgDeck,
        border: Border(top: BorderSide(color: CockpitTheme.borderCyan, width: 1)),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            // 1. Navigation Tabs
            Row(
              children: [
                _buildNavTab('Vehicle', '🚗'),
                _buildNavTab('Map', '🗺️'),
                _buildNavTab('Climate', '❄️'),
                _buildNavTab('Dynamics', '⚡'),
                _buildNavTab('Parking', '🅿️'),
                _buildNavTab('Media', '🎵'),
              ],
            ),

            const SizedBox(width: 24),

            // 2. Center Slider Controls: Speed & Clearance
            Row(
              children: [
                Row(
                  children: [
                    Text(
                      'PARK SPEED:',
                      style: GoogleFonts.orbitron(
                        color: CockpitTheme.textSecondary,
                        fontSize: 9.5,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(width: 6),
                    SizedBox(
                      width: 80,
                      child: SliderTheme(
                        data: SliderTheme.of(context).copyWith(
                          trackHeight: 3,
                          thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                          activeTrackColor: CockpitTheme.cyanPrimary,
                          inactiveTrackColor: Colors.white12,
                          thumbColor: CockpitTheme.cyanPrimary,
                        ),
                        child: Slider(
                          value: telemetry.maneuverSpeed.toDouble(),
                          min: 1,
                          max: 5,
                          divisions: 4,
                          onChanged: (val) => telemetry.setManeuverSpeed(val.toInt()),
                        ),
                      ),
                    ),
                    Text(
                      '${telemetry.maneuverSpeed} km/h',
                      style: GoogleFonts.orbitron(
                        color: CockpitTheme.cyanPrimary,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 16),
                Row(
                  children: [
                    Text(
                      'CLEARANCE:',
                      style: GoogleFonts.orbitron(
                        color: CockpitTheme.textSecondary,
                        fontSize: 9.5,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(width: 6),
                    SizedBox(
                      width: 80,
                      child: SliderTheme(
                        data: SliderTheme.of(context).copyWith(
                          trackHeight: 3,
                          thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                          activeTrackColor: CockpitTheme.greenActive,
                          inactiveTrackColor: Colors.white12,
                          thumbColor: CockpitTheme.greenActive,
                        ),
                        child: Slider(
                          value: telemetry.safetyClearance,
                          min: 0.3,
                          max: 2.0,
                          onChanged: (val) => telemetry.setSafetyClearance(val),
                        ),
                      ),
                    ),
                    Text(
                      '${telemetry.safetyClearance.toStringAsFixed(1)} m',
                      style: GoogleFonts.orbitron(
                        color: CockpitTheme.greenActive,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(width: 24),

            // 3. Right Status Cluster: Hazard, Climate, Audio
            Row(
              children: [
                // Hazard indicator
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: CockpitTheme.redAccent.withValues(alpha: 0.15),
                    border: Border.all(color: CockpitTheme.redAccent),
                    borderRadius: BorderRadius.circular(6),
                    boxShadow: const [
                      BoxShadow(color: CockpitTheme.redGlow, blurRadius: 8),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Text('▲', style: TextStyle(color: CockpitTheme.redAccent, fontSize: 11)),
                      const SizedBox(width: 4),
                      Text(
                        '${telemetry.hazardCount}',
                        style: GoogleFonts.orbitron(
                          color: CockpitTheme.redAccent,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),

                // Cabin Climate Control
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xCC0E1723),
                    border: Border.all(color: CockpitTheme.borderFaint),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => telemetry.adjustTemp(-1),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          child: const Text('-', style: TextStyle(color: CockpitTheme.cyanPrimary, fontSize: 16)),
                        ),
                      ),
                      Text(
                        '${telemetry.cabinTemp}°F',
                        style: GoogleFonts.orbitron(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => telemetry.adjustTemp(1),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          child: const Text('+', style: TextStyle(color: CockpitTheme.cyanPrimary, fontSize: 16)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),

                // Audio Mute/Unmute
                GestureDetector(
                  onTap: () => telemetry.toggleSound(),
                  child: Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: const Color(0xCC0E1723),
                      border: Border.all(color: CockpitTheme.borderCyan),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Center(
                      child: Text(
                        telemetry.soundEnabled ? '🔊' : '🔇',
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavTab(String title, String icon) {
    bool active = telemetry.activeNavTab == title;
    return GestureDetector(
      onTap: () => telemetry.setActiveNavTab(title),
      child: Container(
        margin: const EdgeInsets.only(right: 6),
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.cyanDim : Colors.transparent,
          border: active ? Border.all(color: CockpitTheme.borderCyan) : null,
          borderRadius: BorderRadius.circular(6),
          boxShadow: active
              ? [const BoxShadow(color: CockpitTheme.cyanGlow, blurRadius: 10)]
              : null,
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 13)),
            const SizedBox(width: 6),
            Text(
              title,
              style: GoogleFonts.rajdhani(
                color: active ? CockpitTheme.cyanPrimary : CockpitTheme.textSecondary,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
