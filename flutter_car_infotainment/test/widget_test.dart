import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_car_infotainment/main.dart';

void main() {
  testWidgets('Cockpit home screen loads on automotive display', (WidgetTester tester) async {
    // Set typical automotive cluster resolution (1920x1080)
    tester.view.physicalSize = const Size(1920, 1080);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const AeroGTCockpitApp());
    await tester.pump(const Duration(milliseconds: 100));

    expect(find.text('AERO GT'), findsOneWidget);
    expect(find.text('COCKPIT OS'), findsOneWidget);
    expect(find.text('3D PARKING/BAY SENSOR / RECONSTRUCTION'), findsOneWidget);
    expect(find.text('fscene.dev'), findsOneWidget);
  });
}
