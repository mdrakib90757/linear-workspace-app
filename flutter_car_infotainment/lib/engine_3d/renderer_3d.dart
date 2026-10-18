import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:vector_math/vector_math_64.dart' as v;
import 'math_3d.dart';

class Scene3DPainter extends CustomPainter {
  final List<Polygon3D> polygons;
  final double yaw;
  final double pitch;
  final double distance;
  final v.Vector3 target;
  final bool isTopDown;

  Scene3DPainter({
    required this.polygons,
    required this.yaw,
    required this.pitch,
    required this.distance,
    required this.target,
    this.isTopDown = false,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (size.width <= 0 || size.height <= 0) return;

    final double cx = size.width / 2;
    final double cy = size.height / 2;

    // 1. Calculate Camera Eye Position
    v.Vector3 eye;
    if (isTopDown) {
      eye = v.Vector3(target.x, target.y + distance, target.z + 0.001);
    } else {
      double cosP = math.cos(pitch);
      double sinP = math.sin(pitch);
      double cosY = math.cos(yaw);
      double sinY = math.sin(yaw);

      eye = v.Vector3(
        target.x + distance * cosP * sinY,
        target.y + distance * sinP,
        target.z + distance * cosP * cosY,
      );
    }

    // 2. Build View Matrix
    v.Matrix4 viewMatrix = v.makeViewMatrix(
      eye,
      target,
      isTopDown ? v.Vector3(0, 0, -1) : v.Vector3(0, 1, 0),
    );

    // 3. Directional Key Light (Cyber Blue & Cool White)
    v.Vector3 lightDir = v.Vector3(0.5, 1.0, 0.8)..normalize();

    // 4. Project and Depth-Sort Polygons
    List<ProjectedPolygon> projectedList = [];

    final double fov = isTopDown ? 45.0 : 55.0;
    final double fovRad = fov * math.pi / 180.0;
    final double f = 1.0 / math.tan(fovRad / 2.0);
    final double aspect = size.width / size.height;

    for (var poly in polygons) {
      List<Offset> screenPoints = [];
      double depthSum = 0.0;
      bool clipped = false;

      for (var vert in poly.vertices) {
        // World to View space
        v.Vector3 viewPos = viewMatrix.transformed3(vert);

        // Near plane clipping
        if (viewPos.z >= -0.8) {
          clipped = true;
          break;
        }

        depthSum += -viewPos.z;

        // Perspective Projection
        double projX = (viewPos.x / -viewPos.z) * f / aspect;
        double projY = (viewPos.y / -viewPos.z) * f;

        // Screen Coordinates
        double sx = cx + projX * (size.width * 0.5);
        double sy = cy - projY * (size.height * 0.5);
        screenPoints.add(Offset(sx, sy));
      }

      if (clipped || screenPoints.length < 3) continue;

      // Lighting Calculation
      Color shaded;
      if (poly.isEmissive) {
        shaded = poly.color;
      } else {
        v.Vector3 normal = poly.getNormal();
        double dot = normal.dot(lightDir);
        double diffuse = math.max(0.15, dot * 0.85);

        // Base channels
        int baseR = (poly.color.r * 255.0).round().clamp(0, 255);
        int baseG = (poly.color.g * 255.0).round().clamp(0, 255);
        int baseB = (poly.color.b * 255.0).round().clamp(0, 255);
        int baseA = (poly.color.a * 255.0).round().clamp(0, 255);

        int r = (baseR * diffuse).clamp(0, 255).toInt();
        int g = (baseG * diffuse).clamp(0, 255).toInt();
        int b = (baseB * diffuse).clamp(0, 255).toInt();

        // Subtle specular sheen on roof/hood
        if (dot > 0.6) {
          double spec = math.pow(dot, 4).toDouble() * 60;
          r = (r + spec).clamp(0, 255).toInt();
          g = (g + spec * 1.1).clamp(0, 255).toInt();
          b = (b + spec * 1.3).clamp(0, 255).toInt();
        }

        shaded = Color.fromARGB(baseA, r, g, b);
      }

      projectedList.add(ProjectedPolygon(
        points: screenPoints,
        shadedColor: shaded,
        depth: depthSum / poly.vertices.length,
        isEmissive: poly.isEmissive,
        isWireframe: poly.isWireframe,
      ));
    }

    // 5. Painter's Algorithm: Sort Back to Front (Highest depth first)
    projectedList.sort((a, b) => b.depth.compareTo(a.depth));

    // 6. Draw Polygons
    final Paint fillPaint = Paint()..style = PaintingStyle.fill;
    final Paint strokePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    for (var poly in projectedList) {
      Path path = Path();
      path.moveTo(poly.points[0].dx, poly.points[0].dy);
      for (int i = 1; i < poly.points.length; i++) {
        path.lineTo(poly.points[i].dx, poly.points[i].dy);
      }
      path.close();

      if (poly.isWireframe) {
        strokePaint.color = poly.shadedColor;
        canvas.drawPath(path, strokePaint);
      } else {
        fillPaint.color = poly.shadedColor;
        canvas.drawPath(path, fillPaint);

        // Add subtle edge accent for cyber tech aesthetic
        if (poly.isEmissive) {
          strokePaint.color = poly.shadedColor.withValues(alpha: 0.8);
          strokePaint.strokeWidth = 2.0;
          canvas.drawPath(path, strokePaint);
        } else {
          strokePaint.color = Colors.black.withValues(alpha: 0.2);
          strokePaint.strokeWidth = 0.5;
          canvas.drawPath(path, strokePaint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant Scene3DPainter oldDelegate) {
    return true;
  }
}
