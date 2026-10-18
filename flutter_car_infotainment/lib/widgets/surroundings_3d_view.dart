import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:vector_math/vector_math_64.dart' as v;
import '../models/car_telemetry.dart';
import '../engine_3d/car_mesh.dart';
import '../engine_3d/renderer_3d.dart';
import 'cockpit_theme.dart';

class Surroundings3DView extends StatelessWidget {
  final CarTelemetry telemetry;

  const Surroundings3DView({super.key, required this.telemetry});

  @override
  Widget build(BuildContext context) {
    double carOffsetX = 0.0;
    double carOffsetZ = -2.5 + (telemetry.parkingProgress * 2.5);
    double carRotationY = 0.0;

    final polygons = CarMeshBuilder.buildScene(
      carColor: telemetry.carColor,
      carOffsetX: carOffsetX,
      carOffsetZ: carOffsetZ,
      carRotationY: carRotationY,
      headlightsOn: telemetry.headlightsOn,
      hazardLightsOn: telemetry.hazardLightsOn,
      showGrid: telemetry.showSensorGrid,
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
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  Container(width: 4, height: 10, color: CockpitTheme.cyanPrimary),
                  const SizedBox(width: 8),
                  Text(
                    '3D SURROUNDINGS RECONSTRUCTION - 360 TC CAM1',
                    style: GoogleFonts.orbitron(
                      color: CockpitTheme.cyanPrimary,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.1,
                    ),
                  ),
                  const SizedBox(width: 14),
                  _buildMetaTag('FPS: 60'),
                  const SizedBox(width: 6),
                  _buildMetaTag('STEP: 120Hz'),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: CockpitTheme.cyanPrimary.withValues(alpha: 0.18),
                      border: Border.all(color: CockpitTheme.cyanPrimary),
                      borderRadius: BorderRadius.circular(4),
                      boxShadow: const [
                        BoxShadow(color: CockpitTheme.cyanGlow, blurRadius: 8),
                      ],
                    ),
                    child: Text(
                      'fscene.dev',
                      style: GoogleFonts.orbitron(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 3D Perspective Viewport with Interactive Touch/Mouse Orbit
          Expanded(
            child: Stack(
              children: [
                // Gesture detector for 360 orbit dragging and zoom
                GestureDetector(
                  onPanUpdate: (details) {
                    telemetry.updateOrbit(
                      -details.delta.dx * 0.008,
                      -details.delta.dy * 0.008,
                    );
                  },
                  child: Container(
                    color: Colors.transparent,
                    child: CustomPaint(
                      size: Size.infinite,
                      painter: Scene3DPainter(
                        polygons: polygons,
                        yaw: telemetry.camYaw,
                        pitch: telemetry.camPitch,
                        distance: telemetry.camDistance,
                        target: v.Vector3(carOffsetX, 0.6, carOffsetZ),
                        isTopDown: false,
                      ),
                    ),
                  ),
                ),

                // Floating View Toolbar (Camera presets and toggles)
                Positioned(
                  top: 10,
                  left: 10,
                  right: 10,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildCamPresetBtn('360 Orbit', CameraPreset.orbit),
                        const SizedBox(width: 5),
                        _buildCamPresetBtn('Isometric', CameraPreset.isometric),
                        const SizedBox(width: 5),
                        _buildCamPresetBtn('Top View', CameraPreset.top),
                        const SizedBox(width: 5),
                        _buildCamPresetBtn('Front Cam', CameraPreset.front),
                        const SizedBox(width: 5),
                        _buildCamPresetBtn('Rear Cam', CameraPreset.rear),
                        const SizedBox(width: 10),
                        _buildToolBtn(
                          label: telemetry.autoRotate ? '🔄 Orbit: ON' : '🔄 Orbit: OFF',
                          active: telemetry.autoRotate,
                          onTap: () => telemetry.toggleAutoRotate(),
                        ),
                        const SizedBox(width: 6),
                        _buildToolBtn(
                          label: telemetry.showSensorGrid ? '📐 Grid: ON' : '📐 Grid: OFF',
                          active: telemetry.showSensorGrid,
                          onTap: () => telemetry.toggleSensorGrid(),
                        ),
                      ],
                    ),
                  ),
                ),

                // Interactive Drag Hint at bottom of canvas
                Positioned(
                  bottom: 10,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: CockpitTheme.borderFaint),
                      ),
                      child: Text(
                        '🖱️ Drag to rotate 360° • Zoom • Real-time 3D Viewport',
                        style: GoogleFonts.rajdhani(
                          color: CockpitTheme.textSecondary,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Footer Info & Controls
          Container(
            height: 52,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: const BoxDecoration(
              color: Color(0xF2080E16),
              border: Border(top: BorderSide(color: CockpitTheme.borderCyan)),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: CockpitTheme.cyanPrimary,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'LIDAR POINT CLOUD SYNCHRONIZED',
                    style: GoogleFonts.orbitron(
                      color: CockpitTheme.textSecondary,
                      fontSize: 9.5,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(width: 16),
                  _buildQuickToggle(
                    label: telemetry.headlightsOn ? '💡 Lights ON' : '💡 Lights OFF',
                    active: telemetry.headlightsOn,
                    onTap: () => telemetry.toggleHeadlights(),
                  ),
                  const SizedBox(width: 6),
                  _buildQuickToggle(
                    label: '⚠️ Hazards',
                    active: telemetry.hazardLightsOn,
                    onTap: () => telemetry.toggleHazardLights(),
                  ),
                  const SizedBox(width: 6),
                  _buildQuickToggle(
                    label: '🎨 Paint',
                    active: true,
                    onTap: () => telemetry.cycleCarColor(),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetaTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.black26,
        border: Border.all(color: CockpitTheme.borderFaint),
        borderRadius: BorderRadius.circular(3),
      ),
      child: Text(
        text,
        style: GoogleFonts.orbitron(
          color: CockpitTheme.textSecondary,
          fontSize: 9.5,
        ),
      ),
    );
  }

  Widget _buildCamPresetBtn(String label, CameraPreset preset) {
    bool active = telemetry.cameraPreset == preset;
    return GestureDetector(
      onTap: () => telemetry.setCameraPreset(preset),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.cyanDim : const Color(0xCC080E16),
          border: Border.all(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.borderCyan,
          ),
          borderRadius: BorderRadius.circular(4),
          boxShadow: active
              ? [const BoxShadow(color: CockpitTheme.cyanGlow, blurRadius: 8)]
              : null,
        ),
        child: Text(
          label,
          style: GoogleFonts.rajdhani(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.textSecondary,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildToolBtn({required String label, required bool active, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.cyanDim : const Color(0xCC080E16),
          border: Border.all(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.borderCyan,
          ),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Text(
          label,
          style: GoogleFonts.rajdhani(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.textSecondary,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildQuickToggle({required String label, required bool active, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: active ? CockpitTheme.cyanDim : const Color(0x330E1723),
          border: Border.all(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.borderFaint,
          ),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Text(
          label,
          style: GoogleFonts.rajdhani(
            color: active ? CockpitTheme.cyanPrimary : CockpitTheme.textSecondary,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
