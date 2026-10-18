import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'models/car_telemetry.dart';
import 'widgets/top_header_bar.dart';
import 'widgets/sensor_reconstruction_view.dart';
import 'widgets/surroundings_3d_view.dart';
import 'widgets/bottom_infotainment_deck.dart';
import 'widgets/cockpit_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AeroGTCockpitApp());
}

class AeroGTCockpitApp extends StatelessWidget {
  const AeroGTCockpitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AERO GT Cockpit OS - 3D Surroundings & Parking Reconstruction',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: CockpitTheme.bgCore,
      ),
      home: const CockpitHomeScreen(),
    );
  }
}

class CockpitHomeScreen extends StatefulWidget {
  const CockpitHomeScreen({super.key});

  @override
  State<CockpitHomeScreen> createState() => _CockpitHomeScreenState();
}

class _CockpitHomeScreenState extends State<CockpitHomeScreen>
    with SingleTickerProviderStateMixin {
  late final CarTelemetry _telemetry;
  late final Ticker _ticker;
  Duration _lastElapsed = Duration.zero;

  @override
  void initState() {
    super.initState();
    _telemetry = CarTelemetry();

    // 60-120Hz Animation Loop for 3D Camera Orbit and Parking Maneuver
    _ticker = createTicker((elapsed) {
      if (_lastElapsed == Duration.zero) {
        _lastElapsed = elapsed;
        return;
      }
      double dt = (elapsed - _lastElapsed).inMicroseconds / 1000000.0;
      _lastElapsed = elapsed;

      // 1. Auto Orbit step
      if (_telemetry.autoRotate) {
        _telemetry.stepAutoRotate(dt * 0.25);
      }

      // 2. Autonomous Parking trajectory animation
      if (_telemetry.isAutoParking) {
        _telemetry.updateParkingAnimation(dt);
      }
    });

    _ticker.start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    _telemetry.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _telemetry,
      builder: (context, child) {
        return Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0.0, -0.6),
                radius: 1.2,
                colors: [
                  Color(0xFF0A131F),
                  Color(0xFF05080C),
                ],
              ),
            ),
            child: Column(
              children: [
                // 1. Top System Header Bar
                TopHeaderBar(telemetry: _telemetry),

                // 2. Main Dual 3D Viewport Area
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Left: 3D Parking / Bay Sensor Reconstruction
                        Expanded(
                          child: SensorReconstructionView(telemetry: _telemetry),
                        ),
                        const SizedBox(width: 10),
                        // Right: 3D Surroundings Reconstruction (360 TC CAM1)
                        Expanded(
                          child: Surroundings3DView(telemetry: _telemetry),
                        ),
                      ],
                    ),
                  ),
                ),

                // 3. Bottom Infotainment Deck
                BottomInfotainmentDeck(telemetry: _telemetry),
              ],
            ),
          ),
        );
      },
    );
  }
}
