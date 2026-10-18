import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/car_telemetry.dart';
import 'cockpit_theme.dart';

class TopHeaderBar extends StatelessWidget {
  final CarTelemetry telemetry;

  const TopHeaderBar({super.key, required this.telemetry});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: const BoxDecoration(
        color: CockpitTheme.bgHeader,
        border: Border(bottom: BorderSide(color: CockpitTheme.borderCyan, width: 1)),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            // 1. Brand Section
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [CockpitTheme.redAccent, Color(0xFFBA0D34)],
                    ),
                    borderRadius: BorderRadius.circular(4),
                    boxShadow: const [
                      BoxShadow(color: CockpitTheme.redGlow, blurRadius: 10),
                    ],
                  ),
                  child: Text(
                    'AERO GT',
                    style: GoogleFonts.orbitron(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.5,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'COCKPIT OS',
                  style: GoogleFonts.orbitron(
                    color: CockpitTheme.cyanPrimary,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.8,
                  ),
                ),
              ],
            ),

            const SizedBox(width: 16),

            // 2. Transmission Gear Selector (P - D - R - N)
            Container(
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: CockpitTheme.borderFaint),
              ),
              child: Row(
                children: [
                  _buildGearButton('P', GearMode.p),
                  _buildGearButton('D', GearMode.d),
                  _buildGearButton('R', GearMode.r),
                  _buildGearButton('N', GearMode.n),
                ],
              ),
            ),

            const SizedBox(width: 16),

            // 3. Drive Modes (E-Drive, Track, Dynamic, City)
            Row(
              children: [
                _buildDriveModeButton('E-Drive', DriveMode.eDrive),
                _buildDriveModeButton('Track', DriveMode.track),
                _buildDriveModeButton('Dynamic', DriveMode.dynamic),
                _buildDriveModeButton('City', DriveMode.city),
              ],
            ),

            const SizedBox(width: 16),

            // 4. Header Telemetry: Time, 5G, Battery, Speed
            Row(
              children: [
                Text(
                  '12:44 PM',
                  style: GoogleFonts.orbitron(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 14),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _buildSignalBar(4),
                    const SizedBox(width: 2),
                    _buildSignalBar(7),
                    const SizedBox(width: 2),
                    _buildSignalBar(10),
                    const SizedBox(width: 2),
                    _buildSignalBar(13),
                    const SizedBox(width: 4),
                    Text(
                      '5G',
                      style: GoogleFonts.rajdhani(
                        color: CockpitTheme.textSecondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 14),
                Row(
                  children: [
                    Container(
                      width: 20,
                      height: 10,
                      padding: const EdgeInsets.all(1.5),
                      decoration: BoxDecoration(
                        border: Border.all(color: CockpitTheme.greenActive, width: 1.2),
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          color: CockpitTheme.greenActive,
                          borderRadius: BorderRadius.circular(1),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${telemetry.batteryPercent}% (${telemetry.rangeMiles} mi)',
                      style: GoogleFonts.rajdhani(
                        color: CockpitTheme.textSecondary,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 14),
                // Speed Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: CockpitTheme.greenActive.withValues(alpha: 0.12),
                    border: Border.all(color: CockpitTheme.greenActive),
                    borderRadius: BorderRadius.circular(6),
                    boxShadow: const [
                      BoxShadow(color: CockpitTheme.greenGlow, blurRadius: 10),
                    ],
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        telemetry.speed.toInt().toString(),
                        style: GoogleFonts.orbitron(
                          color: CockpitTheme.greenActive,
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(width: 3),
                      Text(
                        'MPH',
                        style: GoogleFonts.rajdhani(
                          color: CockpitTheme.greenActive,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGearButton(String label, GearMode mode) {
    bool active = telemetry.gear == mode;
    return GestureDetector(
      onTap: () => telemetry.setGear(mode),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 4),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.redAccent : Colors.transparent,
          borderRadius: BorderRadius.circular(4),
          boxShadow: active
              ? [const BoxShadow(color: CockpitTheme.redGlow, blurRadius: 8)]
              : null,
        ),
        child: Text(
          label,
          style: GoogleFonts.orbitron(
            color: active ? Colors.white : CockpitTheme.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  Widget _buildDriveModeButton(String label, DriveMode mode) {
    bool active = telemetry.driveMode == mode;
    return GestureDetector(
      onTap: () => telemetry.setDriveMode(mode),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 3),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.cyanDim : const Color(0x33101A26),
          border: Border.all(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.borderFaint,
          ),
          borderRadius: BorderRadius.circular(4),
          boxShadow: active
              ? [const BoxShadow(color: CockpitTheme.cyanGlow, blurRadius: 8)]
              : null,
        ),
        child: Text(
          label.toUpperCase(),
          style: GoogleFonts.rajdhani(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.8,
          ),
        ),
      ),
    );
  }

  Widget _buildSignalBar(double height) {
    return Container(
      width: 2.5,
      height: height,
      decoration: BoxDecoration(
        color: CockpitTheme.cyanPrimary,
        borderRadius: BorderRadius.circular(1),
      ),
    );
  }
}
