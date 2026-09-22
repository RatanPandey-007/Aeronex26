import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Flame, 
  Eye, 
  Radar, 
  RotateCw, 
  Camera, 
  Box, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  Crosshair, 
  Layers, 
  Maximize2 
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import realDroneImg from '../../assets/real_drone_hardware.jpg';

export interface DroneVisualProps {
  compact?: boolean;
  hideGauges?: boolean;
  className?: string;
  headerTitle?: string;
  badgeText?: string;
}

export const DroneVisual: React.FC<DroneVisualProps> = ({
  compact = false,
  hideGauges = false,
  className = '',
  headerTitle = 'DRONE-01 // ANX-SAR-03',
  badgeText = 'F450 RED/WHITE QUAD',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { primaryDrone } = useMission();
  const [viewMode, setViewMode] = useState<'thermal' | 'rgb' | 'lidar'>('thermal');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'3d' | 'photo'>('3d');

  useEffect(() => {
    if (displayMode !== '3d' || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 3.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting (Tactical SAR lighting with red and cyan highlights)
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-3, -2, -3);
    scene.add(fillLight);

    const redRimLight = new THREE.DirectionalLight(0xef4444, 1.8);
    redRimLight.position.set(0, -2, 3);
    scene.add(redRimLight);

    // Master Drone Root Group
    const droneGroup = new THREE.Group();
    scene.add(droneGroup);

    // =========================================================================
    // MATERIALS ACCURATELY MATCHING THE USER'S PHYSICAL DRONE
    // =========================================================================
    // 1. FRONT RED ARMS (Bright red lattice truss material)
    const redArmMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.45,
      roughness: 0.35,
    });

    // 2. REAR WHITE ARMS (White lattice truss material)
    const whiteArmMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.2,
      roughness: 0.4,
    });

    // 3. Central Frame Plates & Mounts (Black Composite)
    const blackPlateMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });

    // 4. Motors (Brushless Outrunner: black casing + copper coils + silver prop nut)
    const motorBellMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const motorCopperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.95,
      roughness: 0.25,
    });
    const silverNutMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    // 5. Black 2-Blade Propellers
    const propBladeMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.85,
      roughness: 0.2,
    });
    const propSpinDiscMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    // 6. Central Display Screen Casing (RED OUTER BEZEL as shown in photo)
    const screenCasingMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.6,
      roughness: 0.3,
    });

    // =========================================================================
    // 1. CENTRAL BODY FRAME & SANDWICH PLATES
    // =========================================================================
    // Bottom & Top Plates
    const plateGeo = new THREE.BoxGeometry(0.55, 0.02, 0.55);
    const bottomPlate = new THREE.Mesh(plateGeo, blackPlateMat);
    bottomPlate.position.set(0, -0.04, 0);

    const topPlate = new THREE.Mesh(plateGeo, blackPlateMat);
    topPlate.position.set(0, 0.04, 0);
    droneGroup.add(bottomPlate, topPlate);

    // Standoff Spacers
    const standoffGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8);
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
    const corners = [
      [0.2, 0.2], [-0.2, 0.2], [0.2, -0.2], [-0.2, -0.2]
    ];
    corners.forEach(([cx, cz]) => {
      const standoff = new THREE.Mesh(standoffGeo, standoffMat);
      standoff.position.set(cx, 0, cz);
      droneGroup.add(standoff);
    });

    // =========================================================================
    // 2. LARGE RECTANGULAR ONBOARD DISPLAY MONITOR (WITH RED BEZEL)
    // =========================================================================
    // Red Outer Enclosure Case (like the physical 7" display in the photo)
    const monitorCaseGeo = new THREE.BoxGeometry(0.72, 0.44, 0.05);
    const monitorCase = new THREE.Mesh(monitorCaseGeo, screenCasingMat);
    // Angled upward facing the operator
    monitorCase.rotation.x = -Math.PI / 4.5;
    monitorCase.position.set(0, 0.24, -0.02);
    droneGroup.add(monitorCase);

    // Inner Black Bezel
    const monitorBezelGeo = new THREE.BoxGeometry(0.68, 0.4, 0.02);
    const monitorBezel = new THREE.Mesh(monitorBezelGeo, blackPlateMat);
    monitorBezel.position.set(0, 0, 0.022);
    monitorCase.add(monitorBezel);

    // Dynamic Live LCD Screen Content Texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark high-contrast background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, 512, 280);

      // Outer HUD Border
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 496, 264);

      // Header
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('AERONEX // MISSION-04', 24, 48);

      // Operational Status
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('STATUS: ARMED / FLIGHT ACTIVE', 24, 88);
      ctx.fillText('RTK: ±1.8cm FIX [18 SATS]', 24, 122);

      // Telemetry Data
      ctx.fillStyle = '#f8fafc';
      ctx.font = '22px monospace';
      ctx.fillText('ALT: 124m AGL | SPD: 42.0 km/h', 24, 162);
      ctx.fillText('PAYLOAD: FLIR BOSON 640 + 4K', 24, 196);

      // Battery Bar
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 218, 464, 28);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(26, 220, 360, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('BAT: 78% (34m REMAINING)', 120, 238);
    }

    const screenTexture = new THREE.CanvasTexture(canvas);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: 0x10b981,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.85,
      roughness: 0.1,
    });

    const screenSurfaceGeo = new THREE.PlaneGeometry(0.64, 0.36);
    const screenSurface = new THREE.Mesh(screenSurfaceGeo, screenMat);
    screenSurface.position.set(0, 0, 0.015);
    monitorBezel.add(screenSurface);

    // =========================================================================
    // 3. FRONT SENSOR / CAMERA MOUNT BRACKET
    // =========================================================================
    // Bracket extending forward from bottom plate
    const bracketGeo = new THREE.BoxGeometry(0.18, 0.025, 0.22);
    const frontBracket = new THREE.Mesh(bracketGeo, blackPlateMat);
    frontBracket.position.set(0, -0.05, 0.32);
    droneGroup.add(frontBracket);

    // Camera Turret / Sensor Bar
    const cameraHousingGeo = new THREE.BoxGeometry(0.2, 0.1, 0.12);
    const cameraHousing = new THREE.Mesh(cameraHousingGeo, blackPlateMat);
    cameraHousing.position.set(0, -0.06, 0.38);
    droneGroup.add(cameraHousing);

    // Dual Optics (FLIR Thermal + Sony 4K)
    const flirLensGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.03, 16);
    const flirMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
    });
    const flirLens = new THREE.Mesh(flirLensGeo, flirMat);
    flirLens.rotation.x = Math.PI / 2;
    flirLens.position.set(-0.05, -0.06, 0.44);
    droneGroup.add(flirLens);

    const rgbLensGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.03, 16);
    const rgbMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });
    const rgbLens = new THREE.Mesh(rgbLensGeo, rgbMat);
    rgbLens.rotation.x = Math.PI / 2;
    rgbLens.position.set(0.05, -0.06, 0.44);
    droneGroup.add(rgbLens);

    // Downward Volumetric Sensor Cone
    const coneGeo = new THREE.ConeGeometry(0.85, 2.0, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const scanCone = new THREE.Mesh(coneGeo, coneMat);
    scanCone.rotation.x = Math.PI;
    scanCone.position.set(0, -1.1, 0.38);
    droneGroup.add(scanCone);

    // =========================================================================
    // 4. QUADCOPTER ARMS: 2 FRONT RED, 2 REAR WHITE (WITH F450 LATTICE STRUCTURE)
    // =========================================================================
    // Angle layout for Quadcopter:
    // Front-Left (Angle ~ 40°): RED
    // Front-Right (Angle ~ 140°): RED
    // Rear-Left (Angle ~ -40° / 320°): WHITE
    // Rear-Right (Angle ~ -140° / 220°): WHITE
    const armDefs = [
      { id: 'FL', angle: Math.PI / 4 + 0.1, isFront: true },   // Front-Right Red
      { id: 'FR', angle: (3 * Math.PI) / 4 - 0.1, isFront: true }, // Front-Left Red
      { id: 'RR', angle: (5 * Math.PI) / 4 + 0.1, isFront: false }, // Rear-Left White
      { id: 'RL', angle: (7 * Math.PI) / 4 - 0.1, isFront: false }, // Rear-Right White
    ];

    const propAssemblies: THREE.Group[] = [];
    const armLength = 0.92;

    armDefs.forEach((def) => {
      const armGroup = new THREE.Group();
      armGroup.rotation.y = def.angle;
      droneGroup.add(armGroup);

      const armMat = def.isFront ? redArmMat : whiteArmMat;

      // Main Truss Arm Spars (Top & Bottom bars)
      const sparGeo = new THREE.BoxGeometry(0.024, 0.02, armLength);
      const topSpar = new THREE.Mesh(sparGeo, armMat);
      topSpar.position.set(0, 0.025, armLength / 2);

      const btmSpar = new THREE.Mesh(sparGeo, armMat);
      btmSpar.position.set(0, -0.025, armLength / 2);
      armGroup.add(topSpar, btmSpar);

      // Lattice Truss Diagonal Cross-Braces (F450 Truss Structure)
      for (let i = 1; i <= 5; i++) {
        const braceGeo = new THREE.BoxGeometry(0.016, 0.05, 0.016);
        const brace = new THREE.Mesh(braceGeo, armMat);
        brace.position.set(0, 0, (armLength / 6) * i);
        armGroup.add(brace);
      }

      // Motor Base Mount at Tip of Arm
      const motorBaseGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.025, 18);
      const motorBase = new THREE.Mesh(motorBaseGeo, armMat);
      motorBase.position.set(0, 0.03, armLength);
      armGroup.add(motorBase);

      // Brushless Motor Assembly
      const motorBell = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.06, 18), motorBellMat);
      motorBell.position.set(0, 0.07, armLength);

      const copperCoils = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16), motorCopperMat);
      copperCoils.position.set(0, 0.065, armLength);
      armGroup.add(motorBell, copperCoils);

      // Motor Wires routed along arm
      const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, armLength * 0.85, 8);
      const wireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.rotation.x = Math.PI / 2;
      wire.position.set(0.01, 0, armLength * 0.45);
      armGroup.add(wire);

      // =========================================================================
      // 5. BLACK 2-BLADE PROPELLERS & SPINNER NUT
      // =========================================================================
      const propGroup = new THREE.Group();
      propGroup.position.set(0, 0.11, armLength);
      armGroup.add(propGroup);

      // Two Sculpted Black Propeller Blades (Gemfan style)
      const bladeGeo = new THREE.BoxGeometry(0.04, 0.006, 0.52);
      const blade1 = new THREE.Mesh(bladeGeo, propBladeMat);
      blade1.rotation.y = Math.PI / 12;

      const blade2 = new THREE.Mesh(bladeGeo, propBladeMat);
      blade2.rotation.y = Math.PI + Math.PI / 12;
      propGroup.add(blade1, blade2);

      // High-speed semi-transparent rotor blur disc
      const spinDiscGeo = new THREE.RingGeometry(0.06, 0.48, 28);
      const spinDisc = new THREE.Mesh(spinDiscGeo, propSpinDiscMat);
      spinDisc.rotation.x = Math.PI / 2;
      propGroup.add(spinDisc);

      // Silver Propeller Spinner Bullet Nut
      const nutGeo = new THREE.ConeGeometry(0.02, 0.04, 14);
      const silverNut = new THREE.Mesh(nutGeo, silverNutMat);
      silverNut.position.set(0, 0.02, 0);
      propGroup.add(silverNut);

      propAssemblies.push(propGroup);
    });

    // =========================================================================
    // ANIMATION LOOP
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Spin 4 propellers rapidly
      propAssemblies.forEach((prop, idx) => {
        prop.rotation.y += (idx % 2 === 0 ? 0.48 : -0.48);
      });

      // Subtle active hovering
      droneGroup.position.y = Math.sin(t * 1.8) * 0.04;
      droneGroup.rotation.z = Math.sin(t * 1.2) * 0.02;
      droneGroup.rotation.x = 0.18 + Math.cos(t * 1.4) * 0.02;

      if (isRotating) {
        droneGroup.rotation.y = Math.sin(t * 0.4) * 0.35;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      screenTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [displayMode, isRotating]);

  return (
    <div className={`relative rounded-2xl bg-[#0C121B] border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Coordinate Grid */}
      <div className="absolute inset-0 bg-radial from-[#101722]/80 via-[#0C121B] to-[#05080D] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" 
      />

      {/* Top Header & Physical Mode Switcher */}
      <div className={`relative z-10 ${compact ? 'p-2.5' : 'p-3.5'} flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-white/10 bg-[#080D14]/90 backdrop-blur-md`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <div>
            <span className="font-bold text-white tracking-wide">{headerTitle}</span>
            {badgeText && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-[#E53935] font-bold border border-red-500/30">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {/* Display Mode Toggle: 3D Twin vs Real Photo */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-[#101722] p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setDisplayMode('3d')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                displayMode === '3d'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3 h-3" />
              <span>3D TWIN</span>
            </button>
            <button
              onClick={() => setDisplayMode('photo')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                displayMode === 'photo'
                  ? 'bg-[#E53935] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View uploaded photo of real physical drone"
            >
              <Camera className="w-3 h-3" />
              <span>REAL DRONE PHOTO</span>
            </button>
          </div>

          {displayMode === '3d' && (
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isRotating ? 'bg-white/10 text-sky-400 border-white/20' : 'bg-transparent text-slate-400 border-white/5'
              }`}
              title="Toggle Rotation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main View Area: 3D Canvas OR Real Drone Photo */}
      {displayMode === '3d' ? (
        <div 
          ref={mountRef} 
          className={`relative z-10 w-full ${compact ? 'h-[210px]' : 'h-[290px] sm:h-[330px]'} cursor-grab active:cursor-grabbing`}
        />
      ) : (
        <div className={`relative z-10 w-full ${compact ? 'h-[210px]' : 'h-[290px] sm:h-[330px]'} overflow-hidden bg-black flex items-center justify-center group`}>
          <img 
            src={realDroneImg} 
            alt="Real AERONEX SAR Drone Hardware" 
            className="w-full h-full object-contain filter contrast-105"
          />

          {/* Interactive Hardware Annotation Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D14] via-transparent to-transparent pointer-events-none" />

          {/* Annotation Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C121B]/90 border border-white/15 text-[10px] font-mono text-white shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>2x FRONT RED TRUSS ARMS</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C121B]/90 border border-white/15 text-[10px] font-mono text-white shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>2x REAR WHITE TRUSS ARMS</span>
          </div>

          <div className="absolute bottom-12 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C121B]/90 border border-red-500/40 text-[10px] font-mono text-white shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse" />
            <span>CENTRAL ONBOARD HUD SCREEN (RED FRAME)</span>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[10px] font-mono text-[#22C55E] font-bold shadow-lg backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>PHYSICAL RESCUE HARDWARE VERIFIED</span>
          </div>
        </div>
      )}

      {/* Sensor Payload Switcher & Diagnostics */}
      <div className={`relative z-10 ${compact ? 'p-2' : 'p-3'} bg-[#080D14]/95 border-t border-white/10 flex flex-col gap-2 text-xs`}>
        {/* Sensor Mode Switcher */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-[#101722] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('thermal')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                viewMode === 'thermal'
                  ? 'bg-[#FF9F1C] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>FLIR</span>
            </button>
            <button
              onClick={() => setViewMode('rgb')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                viewMode === 'rgb'
                  ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>4K</span>
            </button>
            <button
              onClick={() => setViewMode('lidar')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                viewMode === 'lidar'
                  ? 'bg-[#22C55E] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radar className="w-3 h-3" />
              <span>LiDAR</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-slate-400">
            FPS: <span className="text-[#22C55E] font-bold">42.4</span> | JETSON ORIN NX
          </div>
        </div>

        {/* Live Hardware Telemetry Gauges */}
        {!hideGauges && (
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/5 font-mono text-center text-[11px]">
            <div className="bg-[#101722] p-1.5 rounded border border-white/5">
              <span className="text-slate-400 block text-[10px]">ALTITUDE</span>
              <span className="text-[#38BDF8] font-bold">124m AGL</span>
            </div>
            <div className="bg-[#101722] p-1.5 rounded border border-white/5">
              <span className="text-slate-400 block text-[10px]">SPEED</span>
              <span className="text-white font-bold">42.0 km/h</span>
            </div>
            <div className="bg-[#101722] p-1.5 rounded border border-white/5">
              <span className="text-slate-400 block text-[10px]">RTK GNSS</span>
              <span className="text-[#22C55E] font-bold">±1.8cm</span>
            </div>
            <div className="bg-[#101722] p-1.5 rounded border border-white/5">
              <span className="text-slate-400 block text-[10px]">BATTERY</span>
              <span className="text-[#22C55E] font-bold">78% (34m)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
