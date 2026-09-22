import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Users, 
  PlayCircle, 
  BarChart3, 
  FileText, 
  Compass, 
  AlertTriangle, 
  Sliders, 
  Sparkles, 
  Activity, 
  Menu, 
  X, 
  Cpu,
  Wifi,
  Navigation,
  Crosshair,
  ExternalLink
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

interface CommandLayoutProps {
  children: React.ReactNode;
}

export const CommandLayout: React.FC<CommandLayoutProps> = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    alerts, 
    survivors, 
    primaryDrone,
    currentMission,
    setIsSystemDrawerOpen, 
    startDemo,
    isDemoActive 
  } = useMission();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const verifiedSurvivorsCount = survivors.filter(s => s.status === 'VERIFIED').length;

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: Compass },
    { id: 'mission-control', label: 'MISSION CONTROL', icon: Radio },
    { 
      id: 'alert-center', 
      label: 'ALERT CENTER', 
      icon: AlertTriangle, 
      highlight: true, 
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} CRITICAL` : undefined 
    },
    { id: 'search-ops', label: 'SEARCH OPS', icon: MapPin },
    { 
      id: 'survivors', 
      label: 'SURVIVORS', 
      icon: Users, 
      badge: verifiedSurvivorsCount > 0 ? `${verifiedSurvivorsCount}` : undefined 
    },
    { id: 'priority-engine', label: 'PRIORITY', icon: Sliders },
    { id: 'replay', label: 'MISSION REPLAY', icon: PlayCircle },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'reports', label: 'REPORTS', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-[#05080D] text-[#F8FAFC]">
      {/* ============================================================ */}
      {/* 1. LEFT COMMAND RAIL (Desktop Fixed Sidebar w-64)             */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0C121B] border-r border-white/10 h-screen sticky top-0 z-30 justify-between select-none">
        {/* Rail Top: Branding */}
        <div>
          <div 
            onClick={() => setActiveTab('overview')}
            className="p-4 border-b border-white/10 cursor-pointer group flex items-center gap-3 bg-[#080D14]/80 hover:bg-[#101722] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#101722] border border-white/15 flex items-center justify-center text-[#E53935] group-hover:border-[#E53935]/60 transition-colors shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-[#E53935]/20 to-transparent" />
              <ShieldAlert className="w-5 h-5 text-[#E53935] relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-[#F8FAFC]">AERONEX</span>
                <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#E53935]/20 text-[#E53935] border border-[#E53935]/40 font-mono">
                  SAR
                </span>
              </div>
              <p className="text-[9px] font-bold tracking-widest text-[#8C9AAA] uppercase font-mono leading-tight">
                AUTONOMOUS RESCUE
              </p>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#182230] text-white border border-white/15 shadow-md'
                      : item.highlight && criticalAlertsCount > 0
                      ? 'bg-[#FF3347]/15 text-[#FF3347] border border-[#FF3347]/30 hover:bg-[#FF3347]/25'
                      : 'text-[#8C9AAA] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-[#35C8FF]' 
                        : item.highlight && criticalAlertsCount > 0 
                        ? 'text-[#FF3347]' 
                        : 'text-slate-500'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.highlight
                        ? 'bg-[#FF3347] text-white animate-pulse'
                        : 'bg-white/10 text-[#35C8FF]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rail Bottom: Dedicated DRONE-01 Physical Hardware Status Panel */}
        <div className="p-3 border-t border-white/10 bg-[#080D14]/90">
          <div className="rounded-xl bg-[#101722] border border-white/10 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-white">DRONE-01</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                ONLINE / DEMO
              </span>
            </div>

            <div className="space-y-1 text-[10px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>MODEL:</span>
                <span className="text-slate-200 font-bold">ANX-SAR-03 Custom</span>
              </div>
              <div className="flex justify-between">
                <span>FRAME:</span>
                <span className="text-[#E53935] font-bold">Quad 2-Red/2-White</span>
              </div>
              <div className="flex justify-between">
                <span>MONITOR:</span>
                <span className="text-[#35C8FF] font-bold">Central 7" HUD Screen</span>
              </div>
              <div className="flex justify-between">
                <span>GNSS:</span>
                <span className="text-[#35C8FF] font-bold">±1.8cm RTK Fix</span>
              </div>
              <div className="flex justify-between">
                <span>ONBOARD:</span>
                <span className="text-[#22C55E] font-bold">Jetson Orin (42.4 FPS)</span>
              </div>
            </div>

            {/* Mini Battery / Signal Bars */}
            <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-1 text-slate-300">
                <span className="text-slate-500">BAT:</span>
                <span className="text-[#22C55E] font-bold">78%</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="text-slate-500">LINK:</span>
                <span className="text-[#35C8FF] font-bold">99.2%</span>
              </div>
              <button
                onClick={() => setActiveTab('mission-control')}
                className="text-[10px] text-[#35C8FF] hover:underline flex items-center gap-0.5"
                title="View in Mission Control"
              >
                <span>LOCATE</span>
                <Crosshair className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN VIEWPORT & TOP OPERATIONAL STATUS STRIP               */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Operational Status Strip (Sticky Command Bar) */}
        <header className="sticky top-0 z-20 bg-[#080D14]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xl shrink-0">
          {/* Mobile Menu Button (Only on smaller screens) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#101722] border border-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <span className="font-bold tracking-tight text-white">AERONEX SAR</span>
          </div>

          {/* Left Operational Telemetry Strip */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#22C55E] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>LIVE EMERGENCY NETWORK</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500">MISSION:</span>
              <span className="font-bold text-white">MISSION-04 // WAYANAD LANDSLIDE SAR</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="hidden xl:flex items-center gap-1.5 text-slate-400">
              <span>STATUS:</span>
              <span className="text-[#22C55E] font-bold">ACTIVE SEARCH DEPLOYMENT</span>
            </div>
          </div>

          {/* Right Live Drone Diagnostics & Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-3 text-slate-400">
              <span>11.5365°N, 76.1265°E</span>
              <span className="text-[#35C8FF] font-bold">124m AGL</span>
              <span className="text-slate-300 font-bold">42.0 km/h</span>
              <span className="text-[#22C55E] font-bold">BAT 78%</span>
            </div>

            {/* Quick Demo Mode Button */}
            <button
              onClick={startDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                isDemoActive
                  ? 'bg-[#F59E0B] text-slate-950 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
              title="Run 11-step complete automated mission demonstration"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDemoActive ? 'DEMO RUNNING' : 'DEMO MODE'}</span>
            </button>

            {/* System Status Drawer Toggle */}
            <button
              onClick={() => setIsSystemDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101722] hover:bg-[#182230] border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
              title="Open full system diagnostics drawer"
            >
              <Cpu className="w-3.5 h-3.5 text-[#35C8FF]" />
              <span className="hidden sm:inline">TELEMETRY</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer (When toggled on mobile) */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 bg-[#0C121B] border-b border-white/10 space-y-2 font-mono text-xs z-30">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  activeTab === item.id ? 'bg-[#182230] text-white' : 'text-slate-400'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">{item.badge}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Main Work Area Container */}
        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {children}
        </main>

        {/* Tactical Command Footer */}
        <footer className="mt-auto border-t border-white/10 bg-[#080D14] py-4 px-6 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="font-bold text-white">AERONEX AUTONOMOUS SAR ARCHITECTURE</span>
            <span>•</span>
            <span className="text-slate-500">BUILD 2.5.0-COMMAND</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>EDGE INFERENCE: <strong className="text-white">ORIN NX 42.4 FPS</strong></span>
            <span>•</span>
            <span>GNSS: <strong className="text-[#35C8FF]">±1.8cm RTK FIX</strong></span>
            <span>•</span>
            <span>NETWORK: <strong className="text-[#22C55E]">MIMO MESH 24.8 Mbps</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
};
