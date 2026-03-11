"use client"

import { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Trash2, Video, Server, Network, ShieldAlert, Monitor, Box, Zap, ZoomIn, Pencil, Maximize, Printer, Wifi, Router, Expand, Circle as CircleIcon, Activity, RotateCcw, Radar, Globe, Download } from 'lucide-react';
import { Stage, Layer, Rect, Text, Group, Transformer, Path, Line, Circle, Wedge } from 'react-konva';

type PlannerRoom = { id: string; x: number; y: number; width: number; height: number; type: 'room' | 'circle' | 'radius' };
type DeviceCategory = 'cctv' | 'lan' | 'fire' | 'arch';
type DeviceType = 'camera' | 'nvr' | 'switch' | 'monitor' | 'rack' | 'socket' | 'smoke' | 'panel' | 'pc' | 'router' | 'printer' | 'wifi' | 'lan_switch';
type PlannerDevice = { id: string; x: number; y: number; rotation: number; type: DeviceType; category: DeviceCategory; label: string };
type DrawnLine = { id: string; points: number[]; type: 'trunk' | 'corrugation' | 'cable'; category: DeviceCategory };
type Lang = 'ru' | 'en' | 'kz';

const M_PER_PX = 0.1;
const SNAP_SIZE = 20; // Размер ячейки сетки для магнита

const translations = {
  ru: {
    arch: 'Архитектура', cctv: 'Видеонаблюдение', lan: 'ЛВС & Сеть', fire: 'ОПС (Пожарка)',
    block: 'Блок', circle: 'Круг', radiusZone: 'Зона/Радиус', trunk: 'К/Канал', corrugation: 'Гофра',
    camera: 'Камера', switch: 'Switch', nvr: 'NVR', monitor: 'Монитор', line: 'Трасса',
    router: 'Роутер', rack: 'Шкаф', lan_switch: 'Коммутатор', wifi: 'Wi-Fi Точка', pc: 'Раб. Место', printer: 'Принтер', socket: 'Розетка',
    smoke: 'Датчик Дыма', panel: 'ППКП',
    undo: 'Назад', autoRoute: 'Авто-Трасса', cancelDraw: 'Отменить рисование',
    drawHint: '[РЕЖИМ РИСОВАНИЯ] КЛИКНИТЕ ДЛЯ НАЧАЛА ЛИНИИ, ЗАТЕМ КЛИКНИТЕ ДЛЯ ЗАВЕРШЕНИЯ',
    emptyHint: 'ДОБАВЬТЕ БЛОК ИЛИ УСТРОЙСТВО ДЛЯ НАЧАЛА ПРОЕКТИРОВАНИЯ',
    betaHint: 'Продукт создан для ознакомительных целей',
    controlsHint: 'С ЗАЖАТЫМ CTRL + КОЛЕСИКО ДЛЯ ЗУМА | ЛКМ ДЛЯ ПАНОРАМЫ',
    autoMeters: 'Авто-Трасса', manualMeters: 'Ручная (Линии)', radius: 'РАДИУС',
    savePng: 'Сохранить PNG',
    magnet: 'Магнит'
  },
  en: {
    arch: 'Architecture', cctv: 'CCTV', lan: 'LAN & Network', fire: 'Fire Alarm',
    block: 'Block', circle: 'Circle', radiusZone: 'Zone/Radius', trunk: 'Trunking', corrugation: 'Corrugation',
    camera: 'Camera', switch: 'Switch', nvr: 'NVR', monitor: 'Monitor', line: 'Cable',
    router: 'Router', rack: 'Rack', lan_switch: 'Network Switch', wifi: 'Wi-Fi AP', pc: 'Workstation', printer: 'Printer', socket: 'Socket',
    smoke: 'Smoke Detector', panel: 'FACP',
    undo: 'Undo', autoRoute: 'Auto-Route', cancelDraw: 'Cancel Drawing',
    drawHint: '[DRAW MODE] CLICK TO START LINE, CLICK AGAIN TO FINISH',
    emptyHint: 'ADD A BLOCK OR DEVICE TO START DESIGNING',
    betaHint: 'This product is created for informational purposes only',
    controlsHint: 'HOLD CTRL + MOUSE WHEEL TO ZOOM | LMB TO PAN',
    autoMeters: 'Auto-Route', manualMeters: 'Manual (Lines)', radius: 'RADIUS',
    savePng: 'Save PNG',
    magnet: 'Snap'
  },
  kz: {
    arch: 'Сәулет', cctv: 'Бейнебақылау', lan: 'ЖЕЖ & Желі', fire: 'Өрт дабылы',
    block: 'Блок', circle: 'Шеңбер', radiusZone: 'Аймақ/Радиус', trunk: 'Кабель-канал', corrugation: 'Гофра',
    camera: 'Камера', switch: 'Свитч', nvr: 'NVR', monitor: 'Монитор', line: 'Трасса',
    router: 'Роутер', rack: 'Шкаф', lan_switch: 'Коммутатор', wifi: 'Wi-Fi Нүктесі', pc: 'Жұмыс орны', printer: 'Принтер', socket: 'Розетка',
    smoke: 'Түтін датчигі', panel: 'ӨБҚА',
    undo: 'Артқа', autoRoute: 'Авто-Трасса', cancelDraw: 'Сызуды болдырмау',
    drawHint: '[СЫЗУ РЕЖИМІ] СЫЗЫҚТЫ БАСТАУ ҮШІН БАСЫҢЫЗ, АЯҚТАУ ҮШІН ҚАЙТА БАСЫҢЫЗ',
    emptyHint: 'ЖОБАЛАУДЫ БАСТАУ ҮШІН БЛОК НЕМЕСЕ ҚҰРЫЛҒЫ ҚОСЫҢЫЗ',
    betaHint: 'Өнім таныстыру мақсатында жасалған',
    controlsHint: 'МАСШТАБТАУ ҮШІН CTRL + ТІНТУІР ДОҢҒАЛАҒЫ | ЖЫЛЖЫТУ ҮШІН ТІНТУІРДІҢ СОЛ ЖАҚ БАТЫРМАСЫ',
    autoMeters: 'Авто-Трасса', manualMeters: 'Қолмен (Сызықтар)', radius: 'РАДИУС',
    savePng: 'PNG сақтау',
    magnet: 'Магнит'
  }
};

export const SbaPlanner = () => {
  const [lang, setLang] = useState<Lang>('ru');
  const t = translations[lang];

  const [rooms, setRooms] = useState<PlannerRoom[]>([]);
  const [devices, setDevices] = useState<PlannerDevice[]>([]);
  const [drawnLines, setDrawnLines] = useState<DrawnLine[]>([]);
  const [drawMode, setDrawMode] = useState<{ active: boolean, type: 'trunk' | 'corrugation' | 'cable', category: DeviceCategory }>({ active: false, type: 'cable', category: 'arch' });
  const [currentLinePoints, setCurrentLinePoints] = useState<number[] | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'arch' | 'cctv' | 'lan' | 'fire'>('arch');
  
  // ТУМБЛЕРЫ
  const [isAutoCable, setIsAutoCable] = useState(true);
  const [isMagnetEnabled, setIsMagnetEnabled] = useState(true);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const saveToHistory = () => {
    const stateStr = JSON.stringify({ rooms, devices, drawnLines });
    setHistory(prev => [...prev.slice(-20), stateStr]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastStateStr = history[history.length - 1];
    const lastState = JSON.parse(lastStateStr);
    setRooms(lastState.rooms); setDevices(lastState.devices); setDrawnLines(lastState.drawnLines);
    setHistory(prev => prev.slice(0, -1)); setSelectedId(null);
  };

  const handleExportPng = () => {
    setSelectedId(null);
    setDrawMode({ active: false, type: 'cable', category: 'arch' });
    setTimeout(() => {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `sba-plan-${Date.now()}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 50);
  };

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => { if (containerRef.current) setStageSize({ width: containerRef.current.offsetWidth, height: isFullscreen ? window.innerHeight - 150 : 600 }); };
    handleResize(); window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  useEffect(() => {
    if (selectedId && trRef.current) {
      if (selectedId.startsWith('line')) { trRef.current.nodes([]); trRef.current.getLayer().batchDraw(); return; }
      
      let node = stageRef.current.findOne('#' + selectedId);
      if (selectedId.includes('camera')) {
         node = stageRef.current.findOne('#cam_body_' + selectedId); 
      }

      if (node) {
        trRef.current.nodes([node]);
        const isRoom = selectedId.startsWith('room');
        const isCamera = selectedId.includes('camera');
        if (isRoom) {
            trRef.current.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'left-center', 'right-center']);
            trRef.current.rotateEnabled(false);
        } else if (isCamera) {
            trRef.current.enabledAnchors([]); trRef.current.rotateEnabled(true);
        } else {
            trRef.current.enabledAnchors([]); trRef.current.rotateEnabled(false);
        }
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) { trRef.current.nodes([]); }
  }, [selectedId, rooms, devices]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { containerRef.current?.requestFullscreen().catch(err => console.error(err)); setIsFullscreen(true); } 
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  const handleWheel = (e: any) => {
    if (!e.evt.ctrlKey) return; 
    e.evt.preventDefault();
    const scaleBy = 1.1; const stage = stageRef.current; if (!stage) return;
    const oldScale = stage.scaleX(); const pointer = stage.getPointerPosition(); if (!pointer) return;
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.max(0.2, Math.min(newScale, 4));
    setScale(limitedScale); setPosition({ x: pointer.x - mousePointTo.x * limitedScale, y: pointer.y - mousePointTo.y * limitedScale });
  };

  const addRoom = (type: 'room' | 'circle' | 'radius' = 'room') => {
    saveToHistory();
    const centerX = (stageSize.width / 2 - position.x) / scale; const centerY = (stageSize.height / 2 - position.y) / scale;
    const newRoom: PlannerRoom = { id: `room-${Date.now()}`, x: centerX - 100, y: centerY - 75, width: 200, height: (type === 'circle' || type === 'radius') ? 200 : 150, type };
    setRooms([...rooms, newRoom]); setSelectedId(newRoom.id);
  };

  const addDevice = (type: DeviceType, category: DeviceCategory, label: string) => {
    saveToHistory();
    const centerX = (stageSize.width / 2 - position.x) / scale; const centerY = (stageSize.height / 2 - position.y) / scale;
    const newDev: PlannerDevice = { id: `dev-${type}-${Date.now()}`, x: centerX, y: centerY, rotation: 0, type, category, label };
    setDevices([...devices, newDev]); setSelectedId(newDev.id);
  };

  const startDrawMode = (type: 'trunk' | 'corrugation' | 'cable', category: DeviceCategory) => {
    setDrawMode({ active: true, type, category }); setSelectedId(null);
  };

  const getRelativePointerPosition = (node: any) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage().getPointerPosition();
    return transform.point(pos);
  };

  const handleStagePointerDown = (e: any) => {
    if (drawMode.active) {
      const pos = getRelativePointerPosition(e.target.getStage());
      
      // Магнит для точек линий
      let finalX = pos.x; let finalY = pos.y;
      if (isMagnetEnabled) {
         finalX = Math.round(pos.x / SNAP_SIZE) * SNAP_SIZE;
         finalY = Math.round(pos.y / SNAP_SIZE) * SNAP_SIZE;
      }

      if (!currentLinePoints) { 
        setCurrentLinePoints([finalX, finalY, finalX, finalY]); 
      } else {
        saveToHistory();
        setDrawnLines([...drawnLines, { id: `line-${Date.now()}`, points: [currentLinePoints[0], currentLinePoints[1], finalX, finalY], type: drawMode.type, category: drawMode.category }]);
        setCurrentLinePoints(null); setDrawMode({ active: false, type: 'cable', category: 'arch' });
      }
      return;
    }
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  const handleStagePointerMove = (e: any) => {
    if (drawMode.active && currentLinePoints) {
      const pos = getRelativePointerPosition(e.target.getStage());
      let finalX = pos.x; let finalY = pos.y;
      if (isMagnetEnabled) {
         finalX = Math.round(pos.x / SNAP_SIZE) * SNAP_SIZE;
         finalY = Math.round(pos.y / SNAP_SIZE) * SNAP_SIZE;
      }
      setCurrentLinePoints([currentLinePoints[0], currentLinePoints[1], finalX, finalY]);
    } else if (!drawMode.active && !selectedId && e.evt.buttons === 1) {
      setPosition({ x: position.x + e.evt.movementX, y: position.y + e.evt.movementY });
    }
  };

  const computedCables = useMemo(() => {
    let lines: any[] = []; let totalAuto = 0;
    if (isAutoCable) {
      const cctvNvr = devices.find(d => d.type === 'nvr' && d.category === 'cctv'); const cctvSwitches = devices.filter(d => d.type === 'switch' && d.category === 'cctv');
      devices.filter(d => d.category === 'cctv' && (d.type === 'camera' || d.type === 'monitor')).forEach(dev => {
        let target = cctvNvr; let minDist = target ? Math.hypot(dev.x - target.x, dev.y - target.y) : Infinity;
        if (dev.type === 'camera') cctvSwitches.forEach(sw => { const d = Math.hypot(dev.x - sw.x, dev.y - sw.y); if (d < minDist) { minDist = d; target = sw; } });
        if (target) { totalAuto += (Math.abs(dev.x - target.x) + Math.abs(dev.y - target.y)) * M_PER_PX; lines.push({ points: [dev.x, dev.y, target.x, dev.y, target.x, target.y], color: '#06b6d4', dash: [5, 5] }); }
      });
      if (cctvNvr) cctvSwitches.forEach(sw => { totalAuto += (Math.abs(sw.x - cctvNvr.x) + Math.abs(sw.y - cctvNvr.y)) * M_PER_PX; lines.push({ points: [sw.x, sw.y, cctvNvr.x, sw.y, cctvNvr.x, cctvNvr.y], color: '#3b82f6', dash: [5, 5] }); });

      const lanHead = devices.find(d => (d.type === 'router' || d.type === 'rack') && d.category === 'lan'); const lanSwitches = devices.filter(d => d.type === 'lan_switch' && d.category === 'lan');
      devices.filter(d => d.category === 'lan' && (d.type === 'pc' || d.type === 'socket' || d.type === 'printer' || d.type === 'wifi')).forEach(dev => {
          let target = lanHead; let minDist = target ? Math.hypot(dev.x - target.x, dev.y - target.y) : Infinity;
          lanSwitches.forEach(sw => { const d = Math.hypot(dev.x - sw.x, dev.y - sw.y); if (d < minDist) { minDist = d; target = sw; } });
          if (target) { totalAuto += (Math.abs(dev.x - target.x) + Math.abs(dev.y - target.y)) * M_PER_PX; lines.push({ points: [dev.x, dev.y, target.x, dev.y, target.x, target.y], color: '#22c55e', dash: [5, 5] }); }
      });
      if (lanHead) lanSwitches.forEach(sw => { totalAuto += (Math.abs(sw.x - lanHead.x) + Math.abs(sw.y - lanHead.y)) * M_PER_PX; lines.push({ points: [sw.x, sw.y, lanHead.x, sw.y, lanHead.x, lanHead.y], color: '#16a34a', dash: [5, 5] }); });

      const firePanel = devices.find(d => d.type === 'panel' && d.category === 'fire');
      if (firePanel) devices.filter(d => d.category === 'fire' && d.type === 'smoke').forEach(dev => {
          totalAuto += (Math.abs(dev.x - firePanel.x) + Math.abs(dev.y - firePanel.y)) * M_PER_PX; lines.push({ points: [dev.x, dev.y, firePanel.x, dev.y, firePanel.x, firePanel.y], color: '#ef4444', dash: [5, 5] });
      });
    }
    return { lines, totalAuto: Math.round(totalAuto) };
  }, [devices, isAutoCable]);

  const totalMeters = useMemo(() => {
    let total = 0; drawnLines.forEach(line => { total += Math.hypot(line.points[2] - line.points[0], line.points[3] - line.points[1]) * M_PER_PX; });
    return Math.round(total);
  }, [drawnLines]);

  if (!isMounted) return <div className="h-[600px] w-full bg-muted/20 animate-pulse rounded-md" />;

  return (
    <div ref={containerRef} className={`flex flex-col w-full bg-background dark:bg-[#0d1117] overflow-hidden border border-border shadow-sm transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'rounded-md'}`}>
      
      {/* TABS - GITHUB STYLE */}
      <div className="flex bg-muted/20 border-b border-border text-xs sm:text-sm font-medium overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('arch')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'arch' ? 'border-[#fd8c73] text-foreground font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.arch}</button>
        <button onClick={() => setActiveTab('cctv')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'cctv' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.cctv}</button>
        <button onClick={() => setActiveTab('lan')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'lan' ? 'border-green-500 text-green-600 dark:text-green-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.lan}</button>
        <button onClick={() => setActiveTab('fire')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'fire' ? 'border-red-500 text-red-600 dark:text-red-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.fire}</button>
      </div>

      {/* TOOLBAR - GITHUB STYLE */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-muted/10 border-b border-border gap-3">
        <div className="flex flex-wrap gap-2">
          {activeTab === 'arch' && (
            <>
             <button onClick={() => addRoom('room')} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-xs font-medium"><Plus size={14} /> {t.block}</button>
             <button onClick={() => addRoom('circle')} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-xs font-medium"><CircleIcon size={14} /> {t.circle}</button>
             <button onClick={() => addRoom('radius')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 rounded-md transition-all text-xs font-medium shadow-sm"><Radar size={14} /> {t.radiusZone}</button>
             <div className="w-px h-6 bg-border mx-1" />
             <button onClick={() => startDrawMode('trunk', 'arch')} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all text-xs font-medium ${drawMode.active && drawMode.type === 'trunk' ? 'bg-muted border-border text-foreground shadow-inner' : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted'}`}><Box size={14} /> {t.trunk}</button>
             <button onClick={() => startDrawMode('corrugation', 'arch')} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all text-xs font-medium ${drawMode.active && drawMode.type === 'corrugation' ? 'bg-muted border-border text-foreground shadow-inner' : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted'}`}><Activity size={14} /> {t.corrugation}</button>
            </>
          )}
          {activeTab === 'cctv' && (
            <>
              <button onClick={() => addDevice('camera', 'cctv', t.camera)} className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-xs font-medium"><Video size={14} /> {t.camera}</button>
              <button onClick={() => addDevice('switch', 'cctv', t.switch)} className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-xs font-medium"><Network size={14} /> {t.switch}</button>
              <button onClick={() => addDevice('nvr', 'cctv', t.nvr)} className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-xs font-medium"><Server size={14} /> {t.nvr}</button>
              <button onClick={() => addDevice('monitor', 'cctv', t.monitor)} className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-xs font-medium"><Monitor size={14} /> {t.monitor}</button>
              <div className="w-px h-6 bg-border mx-1" />
              <button onClick={() => startDrawMode('cable', 'cctv')} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all text-xs font-medium ${drawMode.active && drawMode.category === 'cctv' ? 'bg-cyan-600 text-white border-cyan-700 shadow-inner' : 'bg-transparent border-transparent text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30'}`}><Pencil size={14} /> {t.line}</button>
            </>
          )}
          {activeTab === 'lan' && (
             <>
               <button onClick={() => addDevice('router', 'lan', t.router)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Router size={14} /> {t.router}</button>
               <button onClick={() => addDevice('rack', 'lan', t.rack)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Box size={14} /> {t.rack}</button>
               <button onClick={() => addDevice('lan_switch', 'lan', t.lan_switch)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Network size={14} /> {t.lan_switch}</button>
               <button onClick={() => addDevice('wifi', 'lan', t.wifi)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Wifi size={14} /> {t.wifi}</button>
               <button onClick={() => addDevice('pc', 'lan', t.pc)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Monitor size={14} /> {t.pc}</button>
               <button onClick={() => addDevice('printer', 'lan', t.printer)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Printer size={14} /> {t.printer}</button>
               <button onClick={() => addDevice('socket', 'lan', t.socket)} className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-xs font-medium"><Zap size={14} /> {t.socket}</button>
               <div className="w-px h-6 bg-border mx-1" />
               <button onClick={() => startDrawMode('cable', 'lan')} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all text-xs font-medium ${drawMode.active && drawMode.category === 'lan' ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'bg-transparent border-transparent text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'}`}><Pencil size={14} /> {t.line}</button>
             </>
          )}
          {activeTab === 'fire' && (
             <>
               <button onClick={() => addDevice('smoke', 'fire', t.smoke)} className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-xs font-medium"><ShieldAlert size={14} /> {t.smoke}</button>
               <button onClick={() => addDevice('panel', 'fire', t.panel)} className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-xs font-medium"><Server size={14} /> {t.panel}</button>
               <div className="w-px h-6 bg-border mx-1" />
               <button onClick={() => startDrawMode('cable', 'fire')} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all text-xs font-medium ${drawMode.active && drawMode.category === 'fire' ? 'bg-red-600 text-white border-red-700 shadow-inner' : 'bg-transparent border-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'}`}><Pencil size={14} /> {t.line}</button>
             </>
          )}
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          {history.length > 0 && (
              <button onClick={handleUndo} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-xs font-medium" title={t.undo}>
                 <RotateCcw size={14} /> {t.undo}
              </button>
          )}

          {/* ТУМБЛЕРЫ (МАГНИТ И АВТО-ТРАССА) */}
          <div className="flex items-center gap-4 px-3 py-1.5 border border-border rounded-md bg-secondary/50">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{t.magnet}</span>
                <button onClick={() => setIsMagnetEnabled(!isMagnetEnabled)} className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${isMagnetEnabled ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}>
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isMagnetEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{t.autoRoute}</span>
                <button onClick={() => setIsAutoCable(!isAutoCable)} className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${isAutoCable ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}>
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isAutoCable ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
          </div>
          
          {drawMode.active && (
              <button onClick={() => { setDrawMode({active: false, type: 'cable', category: 'arch'}); setCurrentLinePoints(null); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-900 rounded-md text-xs font-medium animate-pulse shrink-0">
                  {t.cancelDraw}
              </button>
          )}
          
          <div className="flex items-center gap-1 bg-secondary rounded-md border border-border p-0.5 shrink-0">
             <button onClick={handleExportPng} className="flex items-center justify-center p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors" title={t.savePng}>
                <Download size={14} />
              </button>
             <button onClick={toggleFullscreen} className="flex items-center justify-center p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors" title="Fullscreen">
                {isFullscreen ? <Expand size={14} /> : <Maximize size={14} />}
              </button>
             <button onClick={resetView} className="flex items-center justify-center p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors" title="Reset View">
                <ZoomIn size={14} />
              </button>
              <div className="px-2 py-1 text-[10px] font-mono text-muted-foreground border-l border-border cursor-pointer hover:text-foreground transition-colors" onClick={resetView}>
                  {Math.round(scale * 100)}%
              </div>
          </div>
        </div>
      </div>
      
      {drawMode.active && (
         <div className="bg-yellow-50 dark:bg-yellow-900/20 border-y border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-500 text-xs text-center py-1.5 font-medium shadow-inner">
            {t.drawHint}
         </div>
      )}

      {/* ХОЛСТ */}
      <div className={`relative bg-[#f6f8fa] dark:bg-[#0d1117] overflow-hidden flex justify-center border-b border-border ${drawMode.active ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'} h-full min-h-[500px]`}>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} scaleX={scale} scaleY={scale} x={position.x} y={position.y}
          onWheel={handleWheel}
          onPointerDown={handleStagePointerDown}
          onPointerMove={handleStagePointerMove}
        >
          <Layer>
            {/* АВТО-ЛИНИИ */}
            {computedCables.lines.map((l, i) => (
              <Line key={i} points={l.points} stroke={l.color} strokeWidth={1} opacity={0.6} dash={l.dash} lineJoin="round" listening={false} />
            ))}

            {/* ЛИНИЯ В ПРОЦЕССЕ РИСОВАНИЯ */}
            {currentLinePoints && (
               <Line 
                  points={currentLinePoints} 
                  stroke={drawMode.category === 'cctv' ? '#06b6d4' : drawMode.category === 'lan' ? '#22c55e' : drawMode.category === 'fire' ? '#ef4444' : '#a3a3a3'} 
                  strokeWidth={drawMode.type === 'cable' ? 1 : drawMode.type === 'corrugation' ? 3 : 5} 
                  dash={drawMode.type === 'cable' ? [5, 5] : drawMode.type === 'corrugation' ? [6, 4] : []}
                  opacity={0.8} 
                  lineCap="round" 
               />
            )}

            {/* НАРИСОВАННЫЕ ЛИНИИ */}
            {drawnLines.map((line) => {
               const isArchLine = line.type === 'trunk' || line.type === 'corrugation';
               const color = isArchLine ? '#a3a3a3' : (line.category === 'cctv' ? '#06b6d4' : line.category === 'lan' ? '#22c55e' : '#ef4444');
               const strokeWidth = line.type === 'cable' ? 1 : line.type === 'corrugation' ? 3 : 5;
               const dash = line.type === 'cable' ? [5, 5] : line.type === 'corrugation' ? [6, 4] : [];
               
               return (
                  <Group key={line.id} id={line.id}>
                      <Line points={line.points} stroke="transparent" strokeWidth={20} onPointerDown={(e) => { if(!drawMode.active) { e.cancelBubble = true; setSelectedId(line.id); } }} />
                      <Line points={line.points} stroke={color} strokeWidth={strokeWidth} dash={dash} opacity={selectedId === line.id ? 1 : 0.8} lineCap="round" listening={false} />
                  </Group>
               )
            })}

            {/* КОМНАТЫ И РАДИУСЫ */}
            {rooms.map((room) => {
              // МАГНИТ ДЛЯ КОМНАТ (SNAP_SIZE)
              const handleDragMove = (e: any) => {
                 if (isMagnetEnabled) {
                     const node = e.target;
                     const finalX = Math.round(node.x() / SNAP_SIZE) * SNAP_SIZE;
                     const finalY = Math.round(node.y() / SNAP_SIZE) * SNAP_SIZE;
                     node.position({ x: finalX, y: finalY });
                 }
              };

              return (
                  <Group key={room.id} id={room.id} draggable={!drawMode.active} x={room.x} y={room.y} 
                    onPointerDown={(e) => { if(!drawMode.active) { e.cancelBubble = true; setSelectedId(room.id); } }}
                    onDragStart={() => saveToHistory()}
                    onDragMove={handleDragMove}
                    onDragEnd={(e) => { e.cancelBubble = true; setRooms(prev => prev.map(r => r.id === room.id ? { ...r, x: e.target.x(), y: e.target.y() } : r)); }}
                    onTransformStart={() => saveToHistory()}
                    onTransform={(e) => {
                      const node = e.target;
                      let newW = Math.max(40, node.width() * node.scaleX());
                      let newH = Math.max(40, node.height() * node.scaleY());
                      
                      if (isMagnetEnabled) {
                         newW = Math.round(newW / SNAP_SIZE) * SNAP_SIZE;
                         newH = Math.round(newH / SNAP_SIZE) * SNAP_SIZE;
                      }

                      node.setAttrs({ width: newW, height: newH, scaleX: 1, scaleY: 1 });
                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, width: newW, height: newH } : r));
                    }}
                  >
                    {room.type === 'room' && (
                       <Rect width={room.width} height={room.height} fill="#a3a3a3" opacity={0.05} stroke={selectedId === room.id ? "#2563eb" : "#d1d5db"} strokeWidth={selectedId === room.id ? 2 : 1} />
                    )}
                    {room.type === 'circle' && (
                       <Circle x={room.width/2} y={room.height/2} radius={room.width/2} fill="#a3a3a3" opacity={0.05} stroke={selectedId === room.id ? "#2563eb" : "#d1d5db"} strokeWidth={selectedId === room.id ? 2 : 1} />
                    )}
                    {room.type === 'radius' && (
                       <Group>
                           <Circle x={room.width/2} y={room.height/2} radius={room.width/2} fill="#3b82f6" opacity={0.05} stroke={selectedId === room.id ? "#2563eb" : "#3b82f6"} strokeWidth={1} dash={[5,5]} />
                           <Text text={`${t.radius}: ${((room.width/2) * M_PER_PX).toFixed(1)} М`} x={0} y={room.height + 5} width={room.width} align="center" fill="#3b82f6" opacity={0.8} fontSize={10} fontStyle="bold" listening={false} />
                       </Group>
                    )}
                    
                    {room.type !== 'radius' && (
                       <Text text={`${(room.width * M_PER_PX).toFixed(1)}x${(room.height * M_PER_PX).toFixed(1)}`} width={room.width} height={room.height} align="center" verticalAlign="middle" fill="#9ca3af" opacity={0.8} fontSize={12} fontFamily="monospace" listening={false} />
                    )}
                  </Group>
              )
            })}

            {/* ПРОФЕССИОНАЛЬНЫЕ ИКОНКИ */}
            {devices.map((dev) => {
               const color = dev.category === 'cctv' ? '#06b6d4' : dev.category === 'lan' ? '#22c55e' : '#ef4444';
               
               const handleDragMove = (e: any) => {
                 if (isMagnetEnabled) {
                     const node = e.target;
                     const finalX = Math.round(node.x() / SNAP_SIZE) * SNAP_SIZE;
                     const finalY = Math.round(node.y() / SNAP_SIZE) * SNAP_SIZE;
                     node.position({ x: finalX, y: finalY });
                 }
               };

               return (
                  <Group key={dev.id} id={dev.id} draggable={!drawMode.active} x={dev.x} y={dev.y}
                    onPointerDown={(e) => { if(!drawMode.active) { e.cancelBubble = true; setSelectedId(dev.id); } }}
                    onDragStart={() => saveToHistory()}
                    onDragMove={handleDragMove}
                    onDragEnd={(e) => { e.cancelBubble = true; setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, x: e.target.x(), y: e.target.y() } : d)); }}
                  >
                    
                    {/* ЗОНА ОБЗОРА КАМЕРЫ (Не выделяется рамкой Трансформера) */}
                    {dev.type === 'camera' && (
                       <Group rotation={dev.rotation}>
                           <Wedge radius={140} angle={60} rotation={-30} fill="#06b6d4" opacity={0.15} x={10} y={0} listening={false}/>
                       </Group>
                    )}

                    {/* САМ БЛОК УСТРОЙСТВА (Вращается и выделяется Трансформером) */}
                    <Group id={dev.type === 'camera' ? `cam_body_${dev.id}` : undefined} rotation={dev.type === 'camera' ? dev.rotation : 0}
                       onTransformStart={() => saveToHistory()}
                       onTransform={(e) => setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, rotation: e.target.rotation() } : d))}
                    >
                        {selectedId === dev.id && dev.type !== 'camera' && <Circle r={24} fill="#2563eb" opacity={0.1} listening={false} />}
                        {selectedId === dev.id && dev.type === 'camera' && <Circle r={16} fill="#2563eb" opacity={0.1} listening={false} />}

                        {/* CCTV */}
                        {dev.type === 'camera' && <Group><Rect width={20} height={12} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={3} x={-10} y={-6}/><Path data="M 10,-4 L 16,-8 L 16,8 L 10,4 Z" fill={color}/><Circle r={2} fill="#ef4444" x={14} y={0}/></Group>}
                        {dev.type === 'nvr' && <Group><Rect width={28} height={20} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-14} y={-10}/><Rect width={18} height={3} fill={color} x={-9} y={-5} cornerRadius={1}/><Circle r={1.5} fill="#22c55e" x={-9} y={4}/><Circle r={1.5} fill="#3b82f6" x={-4} y={4}/></Group>}
                        {dev.type === 'switch' && <Group><Rect width={32} height={16} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-16} y={-8}/><Rect width={4} height={4} fill={color} x={-12} y={-2}/><Rect width={4} height={4} fill={color} x={-5} y={-2}/><Rect width={4} height={4} fill={color} x={2} y={-2}/><Rect width={4} height={4} fill={color} x={9} y={-2}/></Group>}
                        {dev.type === 'monitor' && <Group><Rect width={28} height={20} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-14} y={-12}/><Rect width={22} height={14} fill={color} opacity={0.2} x={-11} y={-9}/><Line points={[-6,8, -10,14, 10,14, 6,8]} fill={color} closed/></Group>}

                        {/* LAN */}
                        {dev.type === 'router' && <Group><Rect width={24} height={14} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={3} x={-12} y={-7}/><Line points={[-6,-7, -8,-14]} stroke={color} strokeWidth={2} lineCap="round"/><Line points={[6,-7, 8,-14]} stroke={color} strokeWidth={2} lineCap="round"/><Circle r={1.5} fill={color} x={-6} y={1}/><Circle r={1.5} fill={color} x={-1} y={1}/><Circle r={1.5} fill={color} x={4} y={1}/></Group>}
                        {dev.type === 'rack' && <Group><Rect width={30} height={46} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-15} y={-23}/><Rect width={24} height={6} fill={color} opacity={0.4} x={-12} y={-18}/><Rect width={24} height={6} fill={color} opacity={0.4} x={-12} y={-10}/><Rect width={24} height={6} fill={color} opacity={0.4} x={-12} y={-2}/><Rect width={24} height={6} fill={color} opacity={0.4} x={-12} y={10}/></Group>}
                        {dev.type === 'lan_switch' && <Group><Rect width={32} height={16} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-16} y={-8}/><Rect width={4} height={4} fill={color} x={-12} y={-2}/><Rect width={4} height={4} fill={color} x={-5} y={-2}/><Rect width={4} height={4} fill={color} x={2} y={-2}/><Rect width={4} height={4} fill={color} x={9} y={-2}/></Group>}
                        {dev.type === 'wifi' && <Group><Circle r={90} fill="#22c55e" opacity={0.08} stroke="#22c55e" strokeWidth={1} dash={[5,5]} listening={false} /><Rect width={16} height={16} x={-8} y={-8} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={8} /><Circle r={3} fill={color} /><Path data="M-6,-10 Q0,-16 6,-10 M-10,-14 Q0,-24 10,-14" stroke={color} strokeWidth={2} fill="transparent" strokeLineCap="round"/></Group>}
                        {dev.type === 'pc' && <Group><Rect width={22} height={14} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-11} y={-12}/><Rect width={26} height={6} fill={color} x={-13} y={6} cornerRadius={1}/><Line points={[-8,9, 8,9]} stroke="#ffffff" strokeWidth={1}/></Group>}
                        {dev.type === 'printer' && <Group><Rect width={24} height={12} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-12} y={-2}/><Rect width={16} height={8} fill={color} opacity={0.4} x={-8} y={-10}/><Rect width={12} height={6} fill={color} opacity={0.7} x={-6} y={10}/></Group>}
                        {dev.type === 'socket' && <Group><Rect width={18} height={18} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={4} x={-9} y={-9}/><Circle r={1.5} fill={color} x={-3} y={0}/><Circle r={1.5} fill={color} x={3} y={0}/></Group>}

                        {/* FIRE */}
                        {dev.type === 'smoke' && <Group><Circle r={60} fill="#ef4444" opacity={0.08} stroke="#ef4444" strokeWidth={1} dash={[5,5]} listening={false} /><Rect width={16} height={16} x={-8} y={-8} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={8} /><Circle r={4} fill={color} opacity={0.5} /><Circle r={1.5} fill="#ff0000" x={4} y={-4} shadowColor="#ff0000" shadowBlur={4} /></Group>}
                        {dev.type === 'panel' && <Group><Rect width={26} height={36} fill="#ffffff" stroke={color} strokeWidth={2} cornerRadius={2} x={-13} y={-18}/><Rect width={18} height={8} fill={color} opacity={0.3} x={-9} y={-14}/><Circle r={2} fill={color} x={-5} y={0}/><Circle r={2} fill={color} x={5} y={0}/><Circle r={2} fill={color} x={0} y={6}/></Group>}
                    </Group>

                    {/* Текст не вращается (вынесен за пределы вращающейся группы) */}
                    <Text text={dev.label} y={dev.type === 'rack' || dev.type === 'panel' ? 30 : 20} x={-40} width={80} align="center" fill="#6b7280" opacity={0.9} fontSize={10} fontStyle="bold" listening={false} />
                  </Group>
               )
            })}

            <Transformer ref={trRef} flipEnabled={false} anchorFill="#ffffff" anchorStroke="#2563eb" anchorSize={8} borderStroke="#2563eb" keepRatio={false} />
          </Layer>
        </Stage>

        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <div className="flex bg-background/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-sm items-center gap-4 pointer-events-none">
            <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{t.autoMeters}</p>
                <p className="text-green-600 dark:text-green-500 font-bold text-lg font-mono">{computedCables.totalAuto} М</p>
            </div>
            <div className="text-right border-l border-border pl-4">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{t.manualMeters}</p>
                <p className="text-yellow-600 dark:text-yellow-500 font-bold text-lg font-mono">{totalMeters} М</p>
            </div>
          </div>

          {selectedId && !drawMode.active && (
            <button onClick={() => { 
                saveToHistory();
                setRooms(rooms.filter(r => r.id !== selectedId)); 
                setDevices(devices.filter(d => d.id !== selectedId)); 
                setDrawnLines(drawnLines.filter(l => l.id !== selectedId)); 
                setSelectedId(null); 
              }}
              className="p-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900 rounded-lg transition-all shadow-sm">
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        {/* ВЫБОР ЯЗЫКА */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-background/90 backdrop-blur-md border border-border rounded-lg p-1.5 shadow-sm">
           <Globe size={14} className="text-muted-foreground ml-1" />
           <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="bg-transparent text-xs font-medium text-foreground outline-none cursor-pointer border-none py-1 pr-2">
              <option value="ru">Русский</option>
              <option value="kz">Қазақша</option>
              <option value="en">English</option>
           </select>
        </div>

        {position.x === 0 && scale === 1 && rooms.length === 0 && devices.length === 0 && drawnLines.length === 0 && !drawMode.active && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40 text-center pointer-events-none">
                <p className="font-mono text-sm font-bold uppercase">{t.emptyHint}</p>
                <p className="text-xs mt-1 opacity-70 italic">{t.betaHint}</p>
                <p className="text-[10px] mt-4 font-mono">{t.controlsHint}</p>
            </div>
        )}
      </div>
    </div>
  );
};