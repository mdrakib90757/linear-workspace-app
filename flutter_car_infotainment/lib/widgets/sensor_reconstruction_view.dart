import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:vector_math/vector_math_64.dart' as v;
import '../models/car_telemetry.dart';
import '../engine_3d/car_mesh.dart';
import '../engine_3d/renderer_3d.dart';
import 'cockpit_theme.dart';

class SensorReconstructionView extends StatelessWidget {
  final CarTelemetry telemetry;

  const SensorReconstructionView({super.key, required this.telemetry});

  @override
  Widget build(BuildContext context) {
    // Car positioning based on parking maneuver
    double carOffsetX = 0.0;
    double carOffsetZ = -2.5 + (telemetry.parkingProgress * 2.5); // Moves smoothly into target bay
    double carRotationY = 0.0;

    final polygons = CarMeshBuilder.buildScene(
      carColor: telemetry.carColor,
      carOffsetX: carOffsetX,
      carOffsetZ: carOffsetZ,
      carRotationY: carRotationY,
      headlightsOn: telemetry.headlightsOn,
      hazardLightsOn: telemetry.hazardLightsOn,
      showGrid: true,
    );

    return Container(
      decoration: CockpitTheme.cardBox,
      child: Column(
        children: [
          // Header
          Container(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: const BoxDecoration(
              color: Color(0xF20A121B),
              border: Border(bottom: BorderSide(color: CockpitTheme.borderCyan)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(width: 4, height: 10, color: CockpitTheme.cyanPrimary),
                    const SizedBox(width: 8),
                    Text(
                      '3D PARKING/BAY SENSOR / RECONSTRUCTION',
                      style: GoogleFonts.orbitron(
                        color: CockpitTheme.cyanPrimary,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.1,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: CockpitTheme.greenActive.withValues(alpha: 0.12),
                    border: Border.all(color: CockpitTheme.greenActive),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: CockpitTheme.greenActive,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        telemetry.isAutoParking
                            ? 'PARK ASSIST: EXECUTING'
                            : 'AUTOMATION: ACTIVE',
                        style: GoogleFonts.rajdhani(
                          color: CockpitTheme.greenActive,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Main Viewport Area with 3D Canvas and HUD Readouts
          Expanded(
            child: Stack(
              children: [
                // 3D Top-Down Projection
                Positioned.fill(
                  child: CustomPaint(
                    painter: Scene3DPainter(
                      polygons: polygons,
                      yaw: 0.0,
                      pitch: 1.55,
                      distance: 19.0,
                      target: v.Vector3(0, 0, 0),
                      isTopDown: true,
                    ),
                  ),
                ),

                // Front Sensor Readout
                Positioned(
                  top: 16,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: _buildDistanceReadout(
                      label: 'FRONT',
                      value: '${telemetry.distFront.toStringAsFixed(1)} m',
                      fillPercent: (telemetry.distFront / 10.0).clamp(0.0, 1.0),
                      color: telemetry.distFront < 3.0
                          ? CockpitTheme.amberWarn
                          : CockpitTheme.cyanPrimary,
                    ),
                  ),
                ),

                // Left Sensor Readout
                Positioned(
                  top: 140,
                  left: 14,
                  child: _buildDistanceReadout(
                    label: 'LEFT',
                    value: '${telemetry.distLeft.toStringAsFixed(1)} m',
                    fillPercent: 0.35,
                    color: telemetry.distLeft < 1.0
                        ? CockpitTheme.amberWarn
                        : CockpitTheme.greenActive,
                  ),
                ),

                // Right Sensor Readout
                Positioned(
                  top: 140,
                  right: 14,
                  child: _buildDistanceReadout(
                    label: 'RIGHT',
                    value: '${telemetry.distRight.toStringAsFixed(1)} m',
                    fillPercent: 0.40,
                    color: telemetry.distRight < 1.0
                        ? CockpitTheme.amberWarn
                        : CockpitTheme.greenActive,
                  ),
                ),

                // Rear Sensor Readout
                Positioned(
                  bottom: 20,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: _buildDistanceReadout(
                      label: 'REAR',
                      value: '${telemetry.distRear.toStringAsFixed(1)} m',
                      fillPercent: (telemetry.distRear / 2.0).clamp(0.0, 1.0),
                      color: telemetry.distRear < 0.6
                          ? CockpitTheme.redAccent
                          : CockpitTheme.greenActive,
                    ),
                  ),
                ),

                // In-Space Target Bay indicator badge
                Positioned(
                  top: 70,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: CockpitTheme.greenActive.withValues(alpha: 0.15),
                        border: Border.all(color: CockpitTheme.greenActive),
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: const [
                          BoxShadow(color: CockpitTheme.greenGlow, blurRadius: 10),
                        ],
                      ),
                      child: Text(
                        'TARGET BAY (BAY 02)',
                        style: GoogleFonts.orbitron(
                          color: CockpitTheme.greenActive,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Footer Controls: Bay Buttons & Auto Park Assist Action
          Container(
            height: 52,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: const BoxDecoration(
              color: Color(0xF2080E16),
              border: Border(top: BorderSide(color: CockpitTheme.borderCyan)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Bay Selectors
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildBayButton('TARGET BAY'),
                        const SizedBox(width: 6),
                        _buildBayButton('BAY 01'),
                        const SizedBox(width: 6),
                        _buildBayButton('BAY 02'),
                        const SizedBox(width: 6),
                        _buildBayButton('BAY 03'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Auto Park Assist Action Button
                GestureDetector(
                  onTap: () => telemetry.toggleAutoPark(),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: telemetry.isAutoParking
                            ? [CockpitTheme.redAccent, const Color(0xFFBA0D34)]
                            : [
                                CockpitTheme.cyanPrimary.withValues(alpha: 0.25),
                                CockpitTheme.greenActive.withValues(alpha: 0.18),
                              ],
                      ),
                      border: Border.all(
                        color: telemetry.isAutoParking
                            ? CockpitTheme.redAccent
                            : CockpitTheme.cyanPrimary,
                        width: 1.5,
                      ),
                      borderRadius: BorderRadius.circular(6),
                      boxShadow: [
                        BoxShadow(
                          color: telemetry.isAutoParking
                              ? CockpitTheme.redGlow
                              : CockpitTheme.cyanGlow,
                          blurRadius: 12,
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: telemetry.isAutoParking
                                ? Colors.white
                                : CockpitTheme.cyanPrimary,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          telemetry.isAutoParking ? 'CANCEL PARK' : 'AUTO PARK ASSIST',
                          style: GoogleFonts.orbitron(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
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

  Widget _buildDistanceReadout({
    required String label,
    required String value,
    required double fillPercent,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xEB060C13),
        border: Border.all(color: CockpitTheme.borderCyan),
        borderRadius: BorderRadius.circular(6),
        boxShadow: const [
          BoxShadow(color: Colors.black87, blurRadius: 12),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: GoogleFonts.orbitron(
              color: CockpitTheme.cyanPrimary,
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.0,
            ),
          ),
          Text(
            value,
            style: GoogleFonts.orbitron(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 2),
          Container(
            width: 55,
            height: 3,
            decoration: BoxDecoration(
              color: Colors.white12,
              borderRadius: BorderRadius.circular(2),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: fillPercent,
              child: Container(
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBayButton(String bay) {
    bool active = telemetry.selectedBay == bay;
    return GestureDetector(
      onTap: () => telemetry.setSelectedBay(bay),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.cyanDim : const Color(0x330E1723),
          border: Border.all(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.borderFaint,
          ),
          borderRadius: BorderRadius.circular(4),
          boxShadow: active
              ? [const BoxShadow(color: CockpitTheme.cyanGlow, blurRadius: 8)]
              : null,
        ),
        child: Text(
          bay,
          style: GoogleFonts.orbitron(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.textSecondary,
            fontSize: 10,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
