import 'package:flutter/material.dart';

enum GearMode { p, d, r, n }
enum DriveMode { eDrive, track, dynamic, city }
enum CameraPreset { orbit, isometric, top, front, rear }

class CarTelemetry extends ChangeNotifier {
  // Transmission & Drive
  GearMode _gear = GearMode.p;
  DriveMode _driveMode = DriveMode.dynamic;
  double _speed = 76.0;
  final int _batteryPercent = 88;
  final int _rangeMiles = 312;

  // Sensor distances in meters
  double _distFront = 7.3;
  double _distLeft = 0.8;
  double _distRight = 0.9;
  double _distRear = 1.4;

  // Parking State
  bool _isAutoParking = false;
  String _selectedBay = 'TARGET BAY';
  double _parkingProgress = 0.0; // 0.0 to 1.0
  double _safetyClearance = 0.8;
  int _maneuverSpeed = 3;

  // 3D Viewport Controls
  CameraPreset _cameraPreset = CameraPreset.orbit;
  double _camYaw = 0.6;
  double _camPitch = 0.4;
  double _camDistance = 18.0;
  bool _autoRotate = true;
  bool _headlightsOn = true;
  bool _hazardLightsOn = false;
  bool _showSensorGrid = false;
  Color _carColor = const Color(0xFF151922); // Obsidian Black with cyan accents

  // Cockpit Climate & Deck
  int _cabinTemp = 78;
  final int _hazardCount = 1;
  bool _soundEnabled = true;
  String _activeNavTab = 'Parking';

  // Getters
  GearMode get gear => _gear;
  DriveMode get driveMode => _driveMode;
  double get speed => _speed;
  int get batteryPercent => _batteryPercent;
  int get rangeMiles => _rangeMiles;

  double get distFront => _distFront;
  double get distLeft => _distLeft;
  double get distRight => _distRight;
  double get distRear => _distRear;

  bool get isAutoParking => _isAutoParking;
  String get selectedBay => _selectedBay;
  double get parkingProgress => _parkingProgress;
  double get safetyClearance => _safetyClearance;
  int get maneuverSpeed => _maneuverSpeed;

  CameraPreset get cameraPreset => _cameraPreset;
  double get camYaw => _camYaw;
  double get camPitch => _camPitch;
  double get camDistance => _camDistance;
  bool get autoRotate => _autoRotate;
  bool get headlightsOn => _headlightsOn;
  bool get hazardLightsOn => _hazardLightsOn;
  bool get showSensorGrid => _showSensorGrid;
  Color get carColor => _carColor;

  int get cabinTemp => _cabinTemp;
  int get hazardCount => _hazardCount;
  bool get soundEnabled => _soundEnabled;
  String get activeNavTab => _activeNavTab;

  // Setters & Actions
  void setGear(GearMode gear) {
    _gear = gear;
    notifyListeners();
  }

  void setDriveMode(DriveMode mode) {
    _driveMode = mode;
    notifyListeners();
  }

  void setSelectedBay(String bay) {
    _selectedBay = bay;
    notifyListeners();
  }

  void setCameraPreset(CameraPreset preset) {
    _cameraPreset = preset;
    switch (preset) {
      case CameraPreset.orbit:
        _camYaw = 0.6;
        _camPitch = 0.35;
        _camDistance = 18.0;
        break;
      case CameraPreset.isometric:
        _camYaw = 0.785; // 45 deg
        _camPitch = 0.61;
        _camDistance = 20.0;
        break;
      case CameraPreset.top:
        _camYaw = 0.0;
        _camPitch = 1.55; // ~90 deg down
        _camDistance = 22.0;
        break;
      case CameraPreset.front:
        _camYaw = 3.14159; // 180 deg
        _camPitch = 0.2;
        _camDistance = 15.0;
        break;
      case CameraPreset.rear:
        _camYaw = 0.0;
        _camPitch = 0.25;
        _camDistance = 15.0;
        break;
    }
    notifyListeners();
  }

  void updateOrbit(double deltaYaw, double deltaPitch) {
    _camYaw += deltaYaw;
    _camPitch = (_camPitch + deltaPitch).clamp(0.05, 1.55);
    notifyListeners();
  }

  void updateZoom(double scale) {
    _camDistance = (_camDistance * scale).clamp(8.0, 35.0);
    notifyListeners();
  }

  void toggleAutoRotate() {
    _autoRotate = !_autoRotate;
    notifyListeners();
  }

  void stepAutoRotate(double delta) {
    if (_autoRotate) {
      _camYaw += delta;
      notifyListeners();
    }
  }

  void toggleHeadlights() {
    _headlightsOn = !_headlightsOn;
    notifyListeners();
  }

  void toggleHazardLights() {
    _hazardLightsOn = !_hazardLightsOn;
    notifyListeners();
  }

  void toggleSensorGrid() {
    _showSensorGrid = !_showSensorGrid;
    notifyListeners();
  }

  void cycleCarColor() {
    const colors = [
      Color(0xFF151922), // Obsidian
      Color(0xFF00384D), // Cyber Cyan
      Color(0xFF5A0B18), // Crimson Red
      Color(0xFFD8DCE5), // Polar Silver
    ];
    int nextIdx = (colors.indexOf(_carColor) + 1) % colors.length;
    _carColor = colors[nextIdx];
    notifyListeners();
  }

  void toggleAutoPark() {
    _isAutoParking = !_isAutoParking;
    if (_isAutoParking) {
      _gear = GearMode.r;
    } else {
      _gear = GearMode.p;
      _parkingProgress = 0.0;
    }
    notifyListeners();
  }

  void updateParkingAnimation(double delta) {
    if (_isAutoParking) {
      _parkingProgress += delta * (_maneuverSpeed * 0.15);
      if (_parkingProgress >= 1.0) {
        _parkingProgress = 1.0;
        _isAutoParking = false;
        _gear = GearMode.p;
      }
      // Dynamically compute sensor readouts as car moves into bay
      _distFront = 7.3 - (_parkingProgress * 3.8);
      _distRear = (1.4 - (_parkingProgress * 0.9)).clamp(0.4, 1.4);
      _distLeft = 0.8 + (0.1 * (_parkingProgress));
      _distRight = 0.9 - (0.1 * (_parkingProgress));
      _speed = _isAutoParking ? (_maneuverSpeed * 1.5) : 0.0;
      notifyListeners();
    }
  }

  void setSafetyClearance(double val) {
    _safetyClearance = val;
    notifyListeners();
  }

  void setManeuverSpeed(int val) {
    _maneuverSpeed = val;
    notifyListeners();
  }

  void adjustTemp(int delta) {
    _cabinTemp = (_cabinTemp + delta).clamp(60, 88);
    notifyListeners();
  }

  void toggleSound() {
    _soundEnabled = !_soundEnabled;
    notifyListeners();
  }

  void setActiveNavTab(String tab) {
    _activeNavTab = tab;
    notifyListeners();
  }
}
