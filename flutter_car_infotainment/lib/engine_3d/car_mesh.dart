import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:vector_math/vector_math_64.dart' as v;
import 'math_3d.dart';

class CarMeshBuilder {
  /// Builds the complete 3D scene (Supercar, parking garage, pillars, adjacent vehicles)
  static List<Polygon3D> buildScene({
    required Color carColor,
    required double carOffsetX,
    required double carOffsetZ,
    required double carRotationY,
    required bool headlightsOn,
    required bool hazardLightsOn,
    required bool showGrid,
  }) {
    List<Polygon3D> polygons = [];

    // 1. Asphalt Ground and Parking Bay Lines
    polygons.addAll(_buildGarageFloor(showGrid));

    // 2. Concrete Architectural Pillars with Cyan Glowing LED Strips
    polygons.addAll(_buildPillars());

    // 3. Adjacent Parked Vehicles (Left & Right)
    polygons.addAll(_buildNeighborCar(offsetX: -4.8, offsetZ: 0.0, color: const Color(0xFF1E2633)));
    polygons.addAll(_buildNeighborCar(offsetX: 4.8, offsetZ: -0.4, color: const Color(0xFF181F28)));

    // 4. Hero Aerodynamic Sports Supercar
    polygons.addAll(_buildSportsCar(
      baseColor: carColor,
      offsetX: carOffsetX,
      offsetZ: carOffsetZ,
      rotationY: carRotationY,
      headlightsOn: headlightsOn,
      hazardLightsOn: hazardLightsOn,
    ));

    return polygons;
  }

  // --- GARAGE FLOOR & BAY LINES ---
  static List<Polygon3D> _buildGarageFloor(bool showGrid) {
    List<Polygon3D> list = [];

    // Main floor quad
    list.add(Polygon3D(
      vertices: [
        v.Vector3(-14, 0, -14),
        v.Vector3(14, 0, -14),
        v.Vector3(14, 0, 14),
        v.Vector3(-14, 0, 14),
      ],
      color: const Color(0xFF090E16),
    ));

    // Painted Parking Bay Lines (Bay 1, Bay 2 [Target], Bay 3)
    final bayLinesX = [-7.0, -2.4, 2.4, 7.0];
    for (double x in bayLinesX) {
      list.add(Polygon3D(
        vertices: [
          v.Vector3(x - 0.08, 0.01, -5.5),
          v.Vector3(x + 0.08, 0.01, -5.5),
          v.Vector3(x + 0.08, 0.01, 5.5),
          v.Vector3(x - 0.08, 0.01, 5.5),
        ],
        color: const Color(0xFF324860),
      ));
    }

    // Target Bay (Center Bay) Glowing Neon Guides
    list.add(Polygon3D(
      vertices: [
        v.Vector3(-2.3, 0.02, -5.0),
        v.Vector3(2.3, 0.02, -5.0),
        v.Vector3(2.3, 0.02, 5.0),
        v.Vector3(-2.3, 0.02, 5.0),
      ],
      color: const Color(0x3300F3FF),
      isWireframe: true,
      isEmissive: true,
      emissiveIntensity: 1.2,
    ));

    // Target Stop Bar in front of bay
    list.add(Polygon3D(
      vertices: [
        v.Vector3(-1.8, 0.02, -5.2),
        v.Vector3(1.8, 0.02, -5.2),
        v.Vector3(1.8, 0.02, -4.9),
        v.Vector3(-1.8, 0.02, -4.9),
      ],
      color: const Color(0xFF00FFAA),
      isEmissive: true,
      emissiveIntensity: 1.5,
    ));

    // Optional LIDAR Point Cloud Grid Lines
    if (showGrid) {
      for (double i = -12; i <= 12; i += 2.0) {
        list.add(Polygon3D(
          vertices: [
            v.Vector3(i, 0.005, -12),
            v.Vector3(i + 0.04, 0.005, -12),
            v.Vector3(i + 0.04, 0.005, 12),
            v.Vector3(i, 0.005, 12),
          ],
          color: const Color(0x2200F3FF),
        ));
        list.add(Polygon3D(
          vertices: [
            v.Vector3(-12, 0.005, i),
            v.Vector3(12, 0.005, i),
            v.Vector3(12, 0.005, i + 0.04),
            v.Vector3(-12, 0.005, i + 0.04),
          ],
          color: const Color(0x2200F3FF),
        ));
      }
    }

    return list;
  }

  // --- GARAGE CONCRETE PILLARS WITH CYAN VERTICAL LED BARS ---
  static List<Polygon3D> _buildPillars() {
    List<Polygon3D> list = [];
    final pillarPositions = [
      v.Vector3(-9.5, 0, -8.0),
      v.Vector3(9.5, 0, -8.0),
      v.Vector3(-9.5, 0, 7.0),
      v.Vector3(9.5, 0, 7.0),
    ];

    for (var pos in pillarPositions) {
      double w = 0.7;
      double h = 6.0;
      double d = 0.7;

      // Front Face
      list.add(Polygon3D(
        vertices: [
          v.Vector3(pos.x - w, pos.y, pos.z + d),
          v.Vector3(pos.x + w, pos.y, pos.z + d),
          v.Vector3(pos.x + w, pos.y + h, pos.z + d),
          v.Vector3(pos.x - w, pos.y + h, pos.z + d),
        ],
        color: const Color(0xFF1B232E),
      ));

      // Right Face
      list.add(Polygon3D(
        vertices: [
          v.Vector3(pos.x + w, pos.y, pos.z + d),
          v.Vector3(pos.x + w, pos.y, pos.z - d),
          v.Vector3(pos.x + w, pos.y + h, pos.z - d),
          v.Vector3(pos.x + w, pos.y + h, pos.z + d),
        ],
        color: const Color(0xFF141A23),
      ));

      // Glowing Cyan LED Light Strip on Pillar Face
      list.add(Polygon3D(
        vertices: [
          v.Vector3(pos.x - 0.1, pos.y + 0.8, pos.z + d + 0.02),
          v.Vector3(pos.x + 0.1, pos.y + 0.8, pos.z + d + 0.02),
          v.Vector3(pos.x + 0.1, pos.y + 4.8, pos.z + d + 0.02),
          v.Vector3(pos.x - 0.1, pos.y + 4.8, pos.z + d + 0.02),
        ],
        color: const Color(0xFF00F3FF),
        isEmissive: true,
        emissiveIntensity: 2.0,
      ));
    }
    return list;
  }

  // --- NEIGHBOR VEHICLES ---
  static List<Polygon3D> _buildNeighborCar({required double offsetX, required double offsetZ, required Color color}) {
    List<Polygon3D> list = [];
    double l = 4.2;
    double w = 1.9;
    double h = 1.4;

    // Body Block
    list.add(Polygon3D(
      vertices: [
        v.Vector3(offsetX - w/2, 0.3, offsetZ - l/2),
        v.Vector3(offsetX + w/2, 0.3, offsetZ - l/2),
        v.Vector3(offsetX + w/2, 0.3, offsetZ + l/2),
        v.Vector3(offsetX - w/2, 0.3, offsetZ + l/2),
      ],
      color: color,
    ));

    // Roof & Glass
    list.add(Polygon3D(
      vertices: [
        v.Vector3(offsetX - w*0.4, h, offsetZ - l*0.2),
        v.Vector3(offsetX + w*0.4, h, offsetZ - l*0.2),
        v.Vector3(offsetX + w*0.4, h, offsetZ + l*0.25),
        v.Vector3(offsetX - w*0.4, h, offsetZ + l*0.25),
      ],
      color: const Color(0xFF0B1119),
    ));

    // Windshield slope
    list.add(Polygon3D(
      vertices: [
        v.Vector3(offsetX - w/2, 0.8, offsetZ - l*0.4),
        v.Vector3(offsetX + w/2, 0.8, offsetZ - l*0.4),
        v.Vector3(offsetX + w*0.4, h, offsetZ - l*0.2),
        v.Vector3(offsetX - w*0.4, h, offsetZ - l*0.2),
      ],
      color: const Color(0xFF101924),
    ));

    // Sides
    list.add(Polygon3D(
      vertices: [
        v.Vector3(offsetX - w/2, 0.3, offsetZ - l/2),
        v.Vector3(offsetX - w/2, 0.3, offsetZ + l/2),
        v.Vector3(offsetX - w/2, 0.9, offsetZ + l/2),
        v.Vector3(offsetX - w/2, 0.9, offsetZ - l/2),
      ],
      color: color,
    ));

    list.add(Polygon3D(
      vertices: [
        v.Vector3(offsetX + w/2, 0.3, offsetZ - l/2),
        v.Vector3(offsetX + w/2, 0.9, offsetZ - l/2),
        v.Vector3(offsetX + w/2, 0.9, offsetZ + l/2),
        v.Vector3(offsetX + w/2, 0.3, offsetZ + l/2),
      ],
      color: color,
    ));

    return list;
  }

  // --- HERO AERODYNAMIC SPORTS SUPERCAR ---
  static List<Polygon3D> _buildSportsCar({
    required Color baseColor,
    required double offsetX,
    required double offsetZ,
    required double rotationY,
    required bool headlightsOn,
    required bool hazardLightsOn,
  }) {
    List<Polygon3D> list = [];

    // Helper to rotate and translate local car vertices
    v.Vector3 xf(double x, double y, double z) {
      double rad = rotationY;
      double cosR = math.cos(rad);
      double sinR = math.sin(rad);
      double rx = x * cosR - z * sinR;
      double rz = x * sinR + z * cosR;
      return v.Vector3(rx + offsetX, y, rz + offsetZ);
    }

    // Car Dimensions
    double hw = 1.05; // half width (2.1m total)
    double fl = -2.35; // front nose
    double rl = 2.25;  // rear diffuser
    double ground = 0.22; // ride height
    double belt = 0.72;  // beltline
    double roof = 1.25;  // roof height

    // 1. Sleek Aerodynamic Hood (Front Nose to Windshield Base)
    list.add(Polygon3D(
      vertices: [
        xf(-0.6, ground + 0.18, fl),
        xf(0.6, ground + 0.18, fl),
        xf(0.85, belt, -0.6),
        xf(-0.85, belt, -0.6),
      ],
      color: baseColor,
    ));

    // Iridescent Hood Stripe (Center accent)
    list.add(Polygon3D(
      vertices: [
        xf(-0.16, ground + 0.19, fl),
        xf(0.16, ground + 0.19, fl),
        xf(0.18, belt + 0.01, -0.6),
        xf(-0.18, belt + 0.01, -0.6),
      ],
      color: const Color(0xFF00F3FF),
      isEmissive: true,
      emissiveIntensity: 0.8,
    ));

    // 2. Front Bumper & Low Splitter
    list.add(Polygon3D(
      vertices: [
        xf(-0.95, ground, fl + 0.2),
        xf(0.95, ground, fl + 0.2),
        xf(0.6, ground + 0.22, fl),
        xf(-0.6, ground + 0.22, fl),
      ],
      color: const Color(0xFF0C1016),
    ));

    // 3. LED Headlight Ribbon (Cyan / Xenon Bright)
    Color headlightColor = headlightsOn ? const Color(0xFF00F3FF) : const Color(0xFF1B2836);
    // Left Light
    list.add(Polygon3D(
      vertices: [
        xf(-0.92, belt - 0.04, fl + 0.35),
        xf(-0.55, belt - 0.06, fl + 0.15),
        xf(-0.53, belt + 0.02, fl + 0.18),
        xf(-0.90, belt + 0.04, fl + 0.38),
      ],
      color: headlightColor,
      isEmissive: headlightsOn,
      emissiveIntensity: 2.5,
    ));
    // Right Light
    list.add(Polygon3D(
      vertices: [
        xf(0.55, belt - 0.06, fl + 0.15),
        xf(0.92, belt - 0.04, fl + 0.35),
        xf(0.90, belt + 0.04, fl + 0.38),
        xf(0.53, belt + 0.02, fl + 0.18),
      ],
      color: headlightColor,
      isEmissive: headlightsOn,
      emissiveIntensity: 2.5,
    ));

    // 4. Windshield Glass (Sleek aerodynamic rake)
    list.add(Polygon3D(
      vertices: [
        xf(-0.85, belt, -0.6),
        xf(0.85, belt, -0.6),
        xf(0.65, roof, 0.25),
        xf(-0.65, roof, 0.25),
      ],
      color: const Color(0xFF091420),
    ));

    // 5. Roof Canopy (Glass / Carbon fiber)
    list.add(Polygon3D(
      vertices: [
        xf(-0.65, roof, 0.25),
        xf(0.65, roof, 0.25),
        xf(0.60, roof - 0.06, 0.95),
        xf(-0.60, roof - 0.06, 0.95),
      ],
      color: const Color(0xFF070B11),
    ));

    // 6. Fastback Rear Window Slope
    list.add(Polygon3D(
      vertices: [
        xf(-0.60, roof - 0.06, 0.95),
        xf(0.60, roof - 0.06, 0.95),
        xf(0.78, belt + 0.08, 1.75),
        xf(-0.78, belt + 0.08, 1.75),
      ],
      color: const Color(0xFF091420),
    ));

    // 7. Rear Deck & Active Aero Wing / Spoiler
    list.add(Polygon3D(
      vertices: [
        xf(-0.85, belt + 0.15, 1.95),
        xf(0.85, belt + 0.15, 1.95),
        xf(0.82, belt + 0.12, rl),
        xf(-0.82, belt + 0.12, rl),
      ],
      color: baseColor,
    ));

    // 8. Full-Width Rear LED Taillight Bar (Neon Cyber Red)
    Color tailColor = hazardLightsOn ? const Color(0xFFFF9900) : const Color(0xFFFF2A55);
    list.add(Polygon3D(
      vertices: [
        xf(-0.88, belt + 0.04, rl + 0.01),
        xf(0.88, belt + 0.04, rl + 0.01),
        xf(0.88, belt - 0.04, rl + 0.01),
        xf(-0.88, belt - 0.04, rl + 0.01),
      ],
      color: tailColor,
      isEmissive: true,
      emissiveIntensity: 2.2,
    ));

    // 9. Rear Lower Diffuser (Dual Venturi tunnels)
    list.add(Polygon3D(
      vertices: [
        xf(-0.95, ground, rl),
        xf(0.95, ground, rl),
        xf(0.88, belt - 0.06, rl),
        xf(-0.88, belt - 0.06, rl),
      ],
      color: const Color(0xFF080C12),
    ));

    // 10. Left Side Bodywork & Air Intake Scoop
    list.add(Polygon3D(
      vertices: [
        xf(-hw, ground, -1.8),
        xf(-hw, ground, 1.8),
        xf(-0.95, belt, 1.8),
        xf(-0.92, belt, -1.8),
      ],
      color: baseColor,
    ));

    // Left Side Windows
    list.add(Polygon3D(
      vertices: [
        xf(-0.90, belt, -0.55),
        xf(-0.65, roof, 0.25),
        xf(-0.60, roof - 0.06, 0.95),
        xf(-0.88, belt, 1.05),
      ],
      color: const Color(0xFF060D15),
    ));

    // 11. Right Side Bodywork & Air Intake Scoop
    list.add(Polygon3D(
      vertices: [
        xf(hw, ground, -1.8),
        xf(0.92, belt, -1.8),
        xf(0.95, belt, 1.8),
        xf(hw, ground, 1.8),
      ],
      color: baseColor,
    ));

    // Right Side Windows
    list.add(Polygon3D(
      vertices: [
        xf(0.90, belt, -0.55),
        xf(0.88, belt, 1.05),
        xf(0.60, roof - 0.06, 0.95),
        xf(0.65, roof, 0.25),
      ],
      color: const Color(0xFF060D15),
    ));

    // 12. Four Detailed Wheels (Front-Left, Front-Right, Rear-Left, Rear-Right)
    final wheelPositions = [
      [-1.02, 0.35, -1.45], // FL
      [1.02, 0.35, -1.45],  // FR
      [-1.02, 0.38, 1.45],  // RL
      [1.02, 0.38, 1.45],   // RR
    ];

    for (var wp in wheelPositions) {
      double wx = wp[0];
      double wy = wp[1];
      double wz = wp[2];
      double r = 0.36;

      // Tire Outer Face
      list.add(Polygon3D(
        vertices: [
          xf(wx, wy + r, wz - r*0.7),
          xf(wx, wy + r, wz + r*0.7),
          xf(wx, wy - r*0.5, wz + r*0.7),
          xf(wx, wy - r*0.5, wz - r*0.7),
        ],
        color: const Color(0xFF15171C),
      ));

      // Chrome Rim & Cyan Caliper Center
      list.add(Polygon3D(
        vertices: [
          xf(wx + (wx > 0 ? 0.02 : -0.02), wy + r*0.5, wz - r*0.4),
          xf(wx + (wx > 0 ? 0.02 : -0.02), wy + r*0.5, wz + r*0.4),
          xf(wx + (wx > 0 ? 0.02 : -0.02), wy - r*0.3, wz + r*0.4),
          xf(wx + (wx > 0 ? 0.02 : -0.02), wy - r*0.3, wz - r*0.4),
        ],
        color: const Color(0xFF00F3FF),
        isEmissive: true,
        emissiveIntensity: 0.6,
      ));
    }

    return list;
  }
}
