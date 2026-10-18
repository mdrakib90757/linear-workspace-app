import 'package:flutter/material.dart';
import 'package:vector_math/vector_math_64.dart' as v;

class Polygon3D {
  final List<v.Vector3> vertices;
  final Color color;
  final bool isEmissive;
  final double emissiveIntensity;
  final bool isWireframe;

  Polygon3D({
    required this.vertices,
    required this.color,
    this.isEmissive = false,
    this.emissiveIntensity = 1.0,
    this.isWireframe = false,
  });

  // Calculate center depth for Z-sorting (Painter's algorithm)
  double getAverageZ(v.Matrix4 viewMatrix) {
    double sumZ = 0.0;
    for (var vertex in vertices) {
      v.Vector3 transformed = viewMatrix.transformed3(vertex);
      sumZ += transformed.z;
    }
    return sumZ / vertices.length;
  }

  // Calculate face normal
  v.Vector3 getNormal() {
    if (vertices.length < 3) return v.Vector3(0, 1, 0);
    v.Vector3 v0 = vertices[0];
    v.Vector3 v1 = vertices[1];
    v.Vector3 v2 = vertices[2];
    v.Vector3 edge1 = v1 - v0;
    v.Vector3 edge2 = v2 - v0;
    v.Vector3 normal = edge1.cross(edge2);
    if (normal.length > 0.0001) {
      normal.normalize();
    }
    return normal;
  }
}

class ProjectedPolygon {
  final List<Offset> points;
  final Color shadedColor;
  final double depth;
  final bool isEmissive;
  final bool isWireframe;

  ProjectedPolygon({
    required this.points,
    required this.shadedColor,
    required this.depth,
    required this.isEmissive,
    required this.isWireframe,
  });
}
