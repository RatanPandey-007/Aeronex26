import React from 'react';
import { 
  Radio, 
  MapPin, 
  Users, 
  Pause, 
  Play, 
  RotateCcw, 
  BatteryCharging, 
  Wifi, 
  Gauge, 
  AlertTriangle,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Crosshair,
  Grid,
  ChevronRight,
  Eye,
  CheckCircle2,
  Navigation,
  Wind
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { OperationsMap } from '../map/OperationsMap';
import { DroneVisual } from '../hero/DroneVisual';

export const MissionControlView: React.FC = () => {
  const {
    currentMission,
    primaryDrone,
    survivors,
    alerts,
    pauseMission,
    resumeMission,
    emergencyReturnHome,
    setIsRerouteModalOpen,
    setActiveTab,
    setSelectedSurvivor
  } = useMission();

  const isPaused = currentMission.status === 'PAUSED';
  const isReturning = currentMission.status === 'RETURNING';

  const formatFlightTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const criticalSurvivors = survivors.filter(s => s.priority === 'CRITICAL').length;

  return (
    <div className="space-y-5">
      {/* Top Header & Operational Callouts (Zero bulky KPI cards row) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8FAFC]">
              MISSION CONTROL // LIVE OPERATIONS
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            OPERATIONAL SECTOR: WAYANAD CHALIYAR DRAINAGE BASIN • SORTIE ACTIVE • FLIGHT LEVEL 124m AGL
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {criticalAlertsCount > 0 && (
            <button
              onClick={() => setActiveTab('alert-center')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF3B4E]/15 border border-[#FF3B4E]/30 text-[#FF3B4E] text-xs font-bold hover:bg-[#FF3B4E]/25 transition-colors shadow-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{criticalAlertsCount} CRITICAL ALERTS</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111925] border border-white/10 text-xs text-[#38BDF8] font-bold">
            <Navigation className="w-3.5 h-3.5" />
            <span>RTK GNSS: ±1.8cm FIX</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101722] border border-emerald-500/30 text-xs text-[#22C55E] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>AIRFRAME: AERONEX-SAR-03 • AIRBORNE</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Mission Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================================================
            LEFT COLUMN (3 cols): COMPACT MISSION BRIEF & SECTOR INTEL
            ========================================================================= */}
        <div className="lg:col-span-3 space-y-4 font-mono">
          {/* Mission Brief Card */}
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-3.5">
            {/* Header Badge */}
            <div className="border-b border-white/5 pb-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                  {currentMission.code} // ACTIVE
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] font-bold border border-[#22C55E]/30">
                  {currentMission.status}
                </span>
              </div>
              <h2 className="text-sm font-bold text-[#F8FAFC] mt-2 leading-snug">
                {currentMission.name}
              </h2>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF3B4E] shrink-0" />
                <span>{currentMission.locationName}</span>
              </div>
            </div>

            {/* Sweep Coverage Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">SEARCH COVERAGE:</span>
                <span className="text-[#22C55E] font-bold">68.4%</span>
              </div>
              <div className="w-full bg-[#111925] rounded-full h-2 overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-[#22C55E] h-2 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" 
                  style={{ width: '68.4%' }} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>8.55 km² swept</span>
                <span>12.50 km² total</span>
              </div>
            </div>

            {/* Compact Key Parameters */}
            <div className="space-y-2 text-xs pt-1 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Est. Completion:</span>
                <span className="font-bold text-amber-400">{currentMission.estimatedCompletionMinutes} min remaining</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Survivors Located:</span>
                <button
                  onClick={() => setActiveTab('survivors')}
                  className="font-bold text-[#FF3B4E] hover:underline flex items-center gap-1"
                >
                  <span>{survivors.length} ({criticalSurvivors} Critical)</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Search Pattern:</span>
                <span className="font-bold text-[#38BDF8]">{currentMission.pattern.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sweep Efficiency:</span>
                <span className="font-bold text-[#22C55E]">{currentMission.searchEfficiencyHaPerMin} ha/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Assigned Airframe:</span>
                <span className="font-bold text-white">{primaryDrone.callsign}</span>
              </div>
            </div>
          </div>

          {/* Quick Survivor Triage Mini-List */}
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF3B4E]" />
                <span>SECTOR DETECTIONS</span>
              </span>
              <button
                onClick={() => setActiveTab('survivors')}
                className="text-[10px] text-[#38BDF8] hover:underline font-bold"
              >
                TRIAGE →
              </button>
            </div>

            <div className="space-y-2">
              {survivors.slice(0, 3).map((survivor) => (
                <div
                  key={survivor.id}
                  onClick={() => {
                    setSelectedSurvivor(survivor);
                    setActiveTab('survivors');
                  }}
                  className="p-2 rounded-xl bg-[#111925] hover:bg-[#182333] border border-white/5 hover:border-white/15 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F8FAFC]">{survivor.code} ({survivor.id})</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      survivor.priority === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {survivor.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="truncate max-w-[120px]">{survivor.zone}</span>
                    <span className="text-[#38BDF8] font-bold">{(survivor.aiVerification.fusedConfidence * 100).toFixed(0)}% AI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            CENTER COLUMN (6 cols): HERO GEOSPATIAL MAP (THE UNDISPUTED HERO)
            ========================================================================= */}
        <div className="lg:col-span-6 space-y-2">
          {/* Tactical Situation Map Header Strip */}
          <div className="flex items-center justify-between bg-[#0D131D] px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <span className="font-bold text-[#F8FAFC]">TACTICAL SITUATION MAP</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#38BDF8]">ZONE ALPHA SWEEP</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>ELEV: <strong className="text-white">842m MSL</strong></span>
              <span>•</span>
              <span className="text-[#38BDF8] font-bold">
                {primaryDrone.currentLocation[0].toFixed(4)}°N, {primaryDrone.currentLocation[1].toFixed(4)}°E
              </span>
            </div>
          </div>

          {/* Full High-Resolution Tactical 3D Map */}
          <OperationsMap heightClass="h-[680px]" />

          {/* Map Sub-Strip: Quick Operations Status */}
          <div className="bg-[#0D131D]/90 px-4 py-2 rounded-xl border border-white/10 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span>FLIGHT CORRIDOR: <strong className="text-white">WAYPOINT 4 OF 9</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span>CLEARANCE: <strong className="text-[#22C55E]">+650m EAST BUFFER</strong></span>
              <span>•</span>
              <span>RESCUE TEAM: <strong className="text-[#38BDF8]">NDRF-04 EN ROUTE (1.2 km)</strong></span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (3 cols): DIGITAL TWIN & COMPACT QUICK ACTIONS
            ========================================================================= */}
        <div className="lg:col-span-3 space-y-4 font-mono">
          {/* Physical Drone Digital Twin Component (3D Model + Real Photo Toggle) */}
          <DroneVisual 
            compact={true} 
            hideGauges={true} 
            headerTitle="DRONE-01 // AERONEX-SAR-03" 
            badgeText="AIRBORNE"
          />

          {/* High-Density Live Telemetry */}
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>FLIGHT TELEMETRY</span>
              </span>
              <span className="text-[10px] font-bold text-[#22C55E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                STREAMING
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Altitude */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Altitude (AGL)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-[#F8FAFC]">{primaryDrone.telemetry.altitudeM}</span>
                  <span className="text-[10px] text-slate-400">meters</span>
                </div>
                <span className="text-[9px] text-slate-500 block">Clearance: 58m</span>
              </div>

              {/* Ground Speed */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Ground Speed</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-[#FF9F1C]">{primaryDrone.telemetry.groundSpeedMs}</span>
                  <span className="text-[10px] text-slate-400">m/s</span>
                </div>
                <span className="text-[9px] text-slate-500 block">Heading: {primaryDrone.telemetry.headingDeg}°</span>
              </div>

              {/* Battery */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Battery Level</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-[#22C55E]">{primaryDrone.telemetry.batteryPercent}%</span>
                  <span className="text-[10px] text-slate-400">({primaryDrone.telemetry.batteryVoltage}V)</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 mt-1 overflow-hidden">
                  <div className="bg-[#22C55E] h-1 rounded-full" style={{ width: `${primaryDrone.telemetry.batteryPercent}%` }} />
                </div>
              </div>

              {/* Comms Link */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Mesh Signal</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-[#38BDF8]">{primaryDrone.telemetry.linkQualityPercent}%</span>
                  <span className="text-[10px] text-slate-400">{primaryDrone.telemetry.signalRssiDbm} dBm</span>
                </div>
                <span className="text-[9px] text-[#22C55E] block">24.8 Mbps AES</span>
              </div>
            </div>

            {/* Flight Duration */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Sortie Duration:</span>
              <strong className="text-white font-mono">{formatFlightTime(primaryDrone.telemetry.flightTimeSeconds)}</strong>
            </div>
          </div>

          {/* Quick Working Flight Actions */}
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              QUICK FLIGHT ACTIONS
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={isPaused ? resumeMission : pauseMission}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isPaused
                    ? 'bg-[#22C55E] hover:bg-emerald-600 text-white'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
              </button>

              <button
                onClick={emergencyReturnHome}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-[#FF3B4E]/15 hover:bg-[#FF3B4E]/25 text-[#FF3B4E] border border-[#FF3B4E]/30 transition-all shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RTH</span>
              </button>
            </div>

            <button
              onClick={() => setIsRerouteModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>RECALCULATE ROUTE</span>
            </button>

            <button
              onClick={() => setActiveTab('search-ops')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all shadow-sm"
            >
              <Grid className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>SEARCH GRID OPERATIONS →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControlView;
