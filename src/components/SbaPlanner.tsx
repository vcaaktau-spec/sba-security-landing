"use client"

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Trash2, Video, Server, Network, ShieldAlert, Monitor, Box, Zap, 
  ZoomIn, Pencil, Maximize, Printer, Wifi, Router, Expand, Circle as CircleIcon, 
  Activity, RotateCcw, Radar, Download, DoorClosed, Thermometer, ScanLine, 
  BellRing, SquareTerminal, Hand, Lock, CreditCard, LogOut, Cpu 
} from 'lucide-react';
import { Stage, Layer, Rect, Text, Group, Transformer, Path, Line, Circle, Wedge } from 'react-konva';
import type Konva from 'konva';
import { useUser } from '@clerk/clerk-react';

type PlannerRoom = { id: string; x: number; y: number; width: number; height: number; type: 'room' | 'circle' | 'radius' };
type DeviceCategory = 'cctv' | 'lan' | 'fire' | 'arch' | 'acs';
type DeviceType = 'camera' | 'nvr' | 'switch' | 'monitor' | 'rack' | 'socket' | 'smoke' | 'panel' | 'pc' | 'router' | 'printer' | 'wifi' | 'lan_switch' | 'door' | 'heat' | 'linear' | 'siren' | 'tableau' | 'call_point' | 'lock' | 'reader' | 'acs_switch' | 'exit_btn' | 'controller';
type PlannerDevice = { id: string; x: number; y: number; rotation: number; scaleX?: number; scaleY?: number; type: DeviceType; category: DeviceCategory; label: string; radius?: number; price?: number };
type DrawnLine = { id: string; points: number[]; type: 'trunk' | 'corrugation' | 'cable'; category: DeviceCategory; x?: number; y?: number };
type AutoCableLine = { points: number[]; color: string; dash: number[] };
type PlannerText = { id: string; x: number; y: number; rotation: number; content: string; fontSize: 12 | 18 | 28; bold: boolean };

const M_PER_PX = 0.1;
const SNAP_SIZE = 10;
const SNAP_DISTANCE = 5;

const t = {
  arch: 'Архитектура', cctv: 'Видеонаблюдение', lan: 'Локалка (ЛВС)', fire: 'ОПС (Пожарная)', acs: 'СКУД IP',
  block: 'Блок', circle: 'Круг', radiusZone: 'Зона/Радиус', trunk: 'К/Канал', corrugation: 'Гофра', door: 'Дверь',
  text: 'Текст', textContent: 'Текст:', textSize: 'Размер:', textSizeS: 'S', textSizeM: 'M', textSizeL: 'L',
  priceLabel: 'Цена (₸):',
  savePlan: 'Сохранить', myPlans: 'Мои планы', planNamePlaceholder: 'Название плана', noSavedPlans: 'Нет сохранённых планов', loadPlan: 'Загрузить',
  camera: 'Камера', switch: 'Свитч', nvr: 'Регистратор', monitor: 'Монитор', line: 'Трасса', rack: 'Шкаф',
  router: 'Роутер', lan_switch: 'Коммутатор', wifi: 'Wi-Fi Точка', pc: 'Раб. Место', printer: 'Принтер', socket: 'Розетка',
  smoke: 'Датчик Дымовой', heat: 'Датчик Тепловой', linear: 'Датчик Линейный', siren: 'Сирена', tableau: 'Табло', call_point: 'ИПР', panel: 'ППК',
  lock: 'Замок', reader: 'Считыватель', exit_btn: 'Кнопка Выхода', controller: 'Контроллер', acs_switch: 'Свитч',
  undo: 'Назад', autoRoute: 'Авто-Трасса', cancelDraw: 'Отменить рисование',
  drawHint: '[РЕЖИМ РИСОВАНИЯ] КЛИКНИТЕ ДЛЯ НАЧАЛА ЛИНИИ, ЗАТЕМ КЛИКНИТЕ ДЛЯ ЗАВЕРШЕНИЯ',
  emptyHint: 'ДОБАВЬТЕ БЛОК ИЛИ УСТРОЙСТВО ДЛЯ НАЧАЛА ПРОЕКТИРОВАНИЯ',
  betaHint: 'Продукт создан для ознакомительных целей',
  controlsHint: 'С ЗАЖАТЫМ CTRL + КОЛЕСИКО ДЛЯ ЗУМА | ЛКМ ДЛЯ ПАНОРАМЫ',
  autoMeters: 'Авто-Трасса', manualMeters: 'Ручная (Линии)', totalMeters: 'Общая', radius: 'РАДИУС',
  savePng: 'Сохранить PNG',
  magnet: 'Магнит',
  largeIcons: 'Крупные иконки'
};

const DEVICE_PATHS: Record<string, string> = {
  camera: "M-10,-6 H6 V6 H-10 Z M6,-4 L16,-8 V8 L6,4 Z",
  nvr: "M-14,-10 H14 V10 H-14 Z M-10,-4 H10 M-10,0 H10 M-10,4 H10",
  switch: "M-14,-8 H14 V8 H-14 Z M-8,-2 H-4 M-2,-2 H2 M4,-2 H8",
  lan_switch: "M-14,-8 H14 V8 H-14 Z M-8,-2 H-4 M-2,-2 H2 M4,-2 H8",
  acs_switch: "M-14,-8 H14 V8 H-14 Z M-8,-2 H-4 M-2,-2 H2 M4,-2 H8",
  monitor: "M-14,-12 H14 V8 H-14 Z M-6,8 V14 M6,8 V14 M-8,14 H8",
  router: "M-12,-6 H12 V8 H-12 Z M-8,-6 V-12 M0,-6 V-12 M8,-6 V-12",
  rack: "M-12,-20 H12 V20 H-12 Z M-12,-10 H12 M-12,0 H12 M-12,10 H12 M-8,-20 L-8,20 M8,-20 L8,20",
  pc: "M-10,-12 H10 V4 H-10 Z M-14,8 H14 V12 H-14 Z M-4,4 V8 M4,4 V8",
  printer: "M-12,-4 H12 V8 H-12 Z M-8,-10 H8 V-4 H-8 Z M-6,8 H6 V12 H-6 Z",
  socket: "M-8,0 A8,8 0 0,1 8,0 Z M0,0 V-10",
  wifi: "M-2,2 A2,2 0 1,1 2,2 Z M-6,-2 A6,6 0 0,1 6,-2 M-10,-6 A10,10 0 0,1 10,-6",
  smoke: "M-10,-10 H10 V10 H-10 Z M-2,0 A2,2 0 1,1 2,0 A2,2 0 1,1 -2,0",
  heat: "M-10,-10 H10 V10 H-10 Z M-4,-5 V5 M4,-5 V5",
  linear: "M-12,-6 H12 V6 H-12 Z M-12,0 L-6,-6 V6 Z M12,0 L6,-6 V6 Z",
  siren: "M-4,-4 L8,-10 V10 L-4,4 Z M-8,-4 H-4 V4 H-8 Z",
  tableau: "M-14,-8 H14 V8 H-14 Z M-8,-4 L-2,0 L-8,4 M2,-4 V4 M8,-4 V4 M4,0 H8",
  call_point: "M-10,-10 H10 V10 H-10 Z M-4,-4 H4 V4 H-4 Z M0,-4 V4 M-4,0 H4",
  panel: "M-14,-16 H14 V16 H-14 Z M-14,-8 L14,16 M-14,-2 H14 M-14,6 H14",
  lock: "M-6,-10 H6 V10 H-6 Z M-6,-2 H6",
  reader: "M-8,-12 H8 V12 H-8 Z M-3,-6 A3,3 0 0,1 3,-6 M-1,-2 A1,1 0 0,1 1,-2",
  exit_btn: "M-8,-8 H8 V8 H-8 Z M-3,0 A3,3 0 1,1 3,0 A3,3 0 1,1 -3,0",
  controller: "M-14,-18 H14 V18 H-14 Z M-10,-12 H10 V-4 H-10 Z M-10,2 H10 V10 H-10 Z",
};

export const SbaPlanner = () => {
  const [rooms, setRooms] = useState<PlannerRoom[]>([]);
  const [devices, setDevices] = useState<PlannerDevice[]>([]);
  const [drawnLines, setDrawnLines] = useState<DrawnLine[]>([]);
  const [texts, setTexts] = useState<PlannerText[]>([]);
  const { user } = useUser();
  const [planId, setPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [savedPlans, setSavedPlans] = useState<{ id: string; name: string; updatedAt: string }[]>([]);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [drawMode, setDrawMode] = useState<{ active: boolean, type: 'trunk' | 'corrugation' | 'cable', category: DeviceCategory }>({ active: false, type: 'cable', category: 'arch' });
  const [currentLinePoints, setCurrentLinePoints] = useState<number[] | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'arch' | 'cctv' | 'lan' | 'fire' | 'acs'>('arch');
  
  const [isAutoCable, setIsAutoCable] = useState(true);
  const [isMagnetEnabled, setIsMagnetEnabled] = useState(true);
  const [isLargeIcons, setIsLargeIcons] = useState(false);
  const iconScale = isLargeIcons ? 1 : 0.5;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const trRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);
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
    const handleResize = () => { if (containerRef.current) setStageSize({ width: containerRef.current.offsetWidth, height: isFullscreen ? window.innerHeight - 190 : 600 }); };
    handleResize(); window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawMode({ active: false, type: 'cable', category: 'arch' });
        setCurrentLinePoints(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedId && trRef.current) {
      if (selectedId.startsWith('line')) {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
        return;
      }

      let node = stageRef.current?.findOne('#' + selectedId);
      if (selectedId.startsWith('dev-')) {
         node = stageRef.current?.findOne('#dev_body_' + selectedId);
      }

      if (node) {
        trRef.current.nodes([node]);
        const isRoom = selectedId.startsWith('room');
        const isDoor = selectedId.startsWith('dev-door');
        const isText = selectedId.startsWith('text-');

        if (isRoom || isDoor) {
            trRef.current.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'left-center', 'right-center']);
            trRef.current.rotateEnabled(true);
            if (isRoom) trRef.current.rotateEnabled(false);
        } else if (isText) {
            trRef.current.enabledAnchors([]);
            trRef.current.rotateEnabled(true);
        } else {
            trRef.current.enabledAnchors([]);
            trRef.current.rotateEnabled(true);
        }
        trRef.current.getLayer()?.batchDraw();
      }
    } else if (trRef.current) { trRef.current.nodes([]); }
  }, [selectedId, rooms, devices]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { containerRef.current?.requestFullscreen().catch(err => console.error(err)); setIsFullscreen(true); } 
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
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
    
    let defaultRadius = undefined;
    if (type === 'wifi') defaultRadius = 100; // 10m
    if (type === 'smoke') defaultRadius = 85; // 8.5m
    if (type === 'heat') defaultRadius = 50;  // 5m

    const newDev: PlannerDevice = { 
        id: `dev-${type}-${Date.now()}`, x: centerX, y: centerY, rotation: 0, scaleX: 1, scaleY: 1, type, category, label, radius: defaultRadius 
    };
    setDevices([...devices, newDev]); setSelectedId(newDev.id);
  };

  const addText = () => {
    saveToHistory();
    const centerX = (stageSize.width / 2 - position.x) / scale;
    const centerY = (stageSize.height / 2 - position.y) / scale;
    const newText: PlannerText = { id: `text-${Date.now()}`, x: centerX, y: centerY, rotation: 0, content: t.text, fontSize: 18, bold: false };
    setTexts([...texts, newText]);
    setSelectedId(newText.id);
  };

  const handleSave = async () => {
    if (!user || !planName.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/sba-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: planId ?? undefined,
          userId: user.id,
          name: planName.trim(),
          data: { rooms, devices, drawnLines, texts },
        }),
      });
      if (!res.ok) throw new Error('save failed');
      const saved = await res.json();
      setPlanId(saved.id);
    } catch (err) {
      console.error('Не удалось сохранить план:', err);
      alert('Не удалось сохранить план. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchSavedPlans = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/get-sba-plans?userId=${encodeURIComponent(user.id)}`);
      if (!res.ok) throw new Error('list failed');
      setSavedPlans(await res.json());
    } catch (err) {
      console.error('Не удалось получить список планов:', err);
    }
  };

  const handleLoad = async (id: string) => {
    try {
      const res = await fetch(`/api/get-sba-plan?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('load failed');
      const plan = await res.json();
      saveToHistory();
      setRooms(plan.data.rooms ?? []);
      setDevices(plan.data.devices ?? []);
      setDrawnLines(plan.data.drawnLines ?? []);
      setTexts(plan.data.texts ?? []);
      setPlanId(plan.id);
      setPlanName(plan.name);
      setSelectedId(null);
      setIsPlansOpen(false);
    } catch (err) {
      console.error('Не удалось загрузить план:', err);
      alert('Не удалось загрузить план.');
    }
  };

  const startDrawMode = (type: 'trunk' | 'corrugation' | 'cable', category: DeviceCategory) => {
    setDrawMode({ active: true, type, category }); setSelectedId(null);
  };

  const getRelativePointerPosition = (node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pointerPos = node.getStage()?.getPointerPosition() ?? { x: 0, y: 0 };
    return transform.point(pointerPos);
  };

  const getSnapPos = (x: number, y: number) => {
    let finalX = x; let finalY = y;
    if (isMagnetEnabled) {
       const snapX = Math.round(x / SNAP_SIZE) * SNAP_SIZE;
       const snapY = Math.round(y / SNAP_SIZE) * SNAP_SIZE;
       if (Math.abs(x - snapX) < SNAP_DISTANCE) finalX = snapX;
       if (Math.abs(y - snapY) < SNAP_DISTANCE) finalY = snapY;
    }
    return { x: finalX, y: finalY };
  };

  const handleStagePointerDown = (e: Konva.KonvaEventObject<PointerEvent | TouchEvent>) => {
    if (drawMode.active) {
      const stageNode = e.target.getStage();
      if (!stageNode) return;
      const pos = getRelativePointerPosition(stageNode);
      const { x: finalX, y: finalY } = getSnapPos(pos.x, pos.y);

      if (!currentLinePoints) { 
        setCurrentLinePoints([finalX, finalY, finalX, finalY]); 
      } else {
        saveToHistory();
        setDrawnLines([...drawnLines, { id: `line-${Date.now()}`, points: [currentLinePoints[0], currentLinePoints[1], finalX, finalY], type: drawMode.type, category: drawMode.category, x: 0, y: 0 }]);
        setCurrentLinePoints(null); setDrawMode({ active: false, type: 'cable', category: 'arch' });
      }
      return;
    }
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  const handleStagePointerMove = (e: Konva.KonvaEventObject<PointerEvent | TouchEvent>) => {
    if (drawMode.active && currentLinePoints) {
      const stageNode = e.target.getStage();
      if (!stageNode) return;
      const pos = getRelativePointerPosition(stageNode);
      const { x: finalX, y: finalY } = getSnapPos(pos.x, pos.y);
      setCurrentLinePoints([currentLinePoints[0], currentLinePoints[1], finalX, finalY]);
    } else if (!drawMode.active && !selectedId && "buttons" in e.evt && e.evt.buttons === 1) {
      setPosition({ x: position.x + e.evt.movementX, y: position.y + e.evt.movementY });
    }
  };

  // Вспомогательная функция для рендера профессиональных типов трасс
  const renderCustomLine = (points: number[], type: string, color: string, isSelected: boolean) => {
    const [x1, y1, x2, y2] = points;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) return null;

    if (type === 'trunk') { // Кабель-канал (2 параллельные линии)
        const nx = -dy / len;
        const ny = dx / len;
        const offset = 2.5; 
        return (
            <Group>
                <Line points={[x1 + nx*offset, y1 + ny*offset, x2 + nx*offset, y2 + ny*offset]} stroke={color} strokeWidth={1} opacity={isSelected ? 1 : 0.8} listening={false} />
                <Line points={[x1 - nx*offset, y1 - ny*offset, x2 - nx*offset, y2 - ny*offset]} stroke={color} strokeWidth={1} opacity={isSelected ? 1 : 0.8} listening={false} />
            </Group>
        )
    }
    
    if (type === 'corrugation') { // Гофра (волнистая линия)
        const nx = -dy / len;
        const ny = dx / len;
        const wavePoints = [];
        const step = 8; 
        const steps = Math.max(2, Math.floor(len / step));
        
        for(let i=0; i<=steps; i++) {
            const t = i / steps;
            const bx = x1 + dx * t;
            const by = y1 + dy * t;
            const wave = (i === 0 || i === steps) ? 0 : (i % 2 === 0 ? 1 : -1) * 3; 
            wavePoints.push(bx + nx * wave, by + ny * wave);
        }
        return <Line points={wavePoints} stroke={color} strokeWidth={1.5} tension={0.4} opacity={isSelected ? 1 : 0.8} listening={false} />
    }
    
    // Обычный кабель
    return <Line points={points} stroke={color} strokeWidth={1.5} dash={[5, 5]} opacity={isSelected ? 1 : 0.8} listening={false} />
  };

  const computedCables = useMemo(() => {
    const lines: AutoCableLine[] = []; let totalAuto = 0;
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
      if (firePanel) devices.filter(d => d.category === 'fire' && (d.type === 'smoke' || d.type === 'heat' || d.type === 'linear' || d.type === 'siren' || d.type === 'tableau' || d.type === 'call_point')).forEach(dev => {
          totalAuto += (Math.abs(dev.x - firePanel.x) + Math.abs(dev.y - firePanel.y)) * M_PER_PX; lines.push({ points: [dev.x, dev.y, firePanel.x, dev.y, firePanel.x, firePanel.y], color: '#ef4444', dash: [5, 5] });
      });

      const acsController = devices.find(d => d.type === 'controller' && d.category === 'acs'); const acsSwitches = devices.filter(d => d.type === 'acs_switch' && d.category === 'acs');
      devices.filter(d => d.category === 'acs' && (d.type === 'lock' || d.type === 'reader' || d.type === 'exit_btn')).forEach(dev => {
          let target = acsController; let minDist = target ? Math.hypot(dev.x - target.x, dev.y - target.y) : Infinity;
          acsSwitches.forEach(sw => { const d = Math.hypot(dev.x - sw.x, dev.y - sw.y); if (d < minDist) { minDist = d; target = sw; } });
          if (target) { totalAuto += (Math.abs(dev.x - target.x) + Math.abs(dev.y - target.y)) * M_PER_PX; lines.push({ points: [dev.x, dev.y, target.x, dev.y, target.x, target.y], color: '#eab308', dash: [5, 5] }); }
      });
      if (acsController) acsSwitches.forEach(sw => { totalAuto += (Math.abs(sw.x - acsController.x) + Math.abs(sw.y - acsController.y)) * M_PER_PX; lines.push({ points: [sw.x, sw.y, acsController.x, sw.y, acsController.x, acsController.y], color: '#d97706', dash: [5, 5] }); });
    }
    return { lines, totalAuto: Math.round(totalAuto) };
  }, [devices, isAutoCable]);

  const totalMeters = useMemo(() => {
    let total = 0; drawnLines.forEach(line => { total += Math.hypot(line.points[2] - line.points[0], line.points[3] - line.points[1]) * M_PER_PX; });
    return Math.round(total);
  }, [drawnLines]);

  const watermarkGrid = useMemo(() => {
      const grid = [];
      for (let i = -5; i <= 5; i++) {
          for (let j = -5; j <= 5; j++) {
              grid.push({ x: i * 800, y: j * 800 });
          }
      }
      return grid;
  }, []);

  if (!isMounted) return <div className="h-[600px] w-full bg-muted/20 animate-pulse rounded-md" />;

  return (
    <div ref={containerRef} className={`flex flex-col w-full bg-background dark:bg-[#0d1117] overflow-hidden border border-border shadow-sm transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'rounded-md'}`}>
      
      {/* 1. СТРОКА ВКЛАДОК */}
      <div className="flex bg-muted/20 border-b border-border text-xs sm:text-sm font-medium overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('arch')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'arch' ? 'border-[#fd8c73] text-foreground font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.arch}</button>
        <button onClick={() => setActiveTab('cctv')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'cctv' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.cctv}</button>
        <button onClick={() => setActiveTab('lan')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'lan' ? 'border-green-500 text-green-600 dark:text-green-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.lan}</button>
        <button onClick={() => setActiveTab('fire')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'fire' ? 'border-red-500 text-red-600 dark:text-red-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.fire}</button>
        <button onClick={() => setActiveTab('acs')} className={`px-4 py-3 transition-colors whitespace-nowrap border-b-2 ${activeTab === 'acs' ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}>{t.acs}</button>
      </div>

      {/* 2. СТРОКА УСТРОЙСТВ */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-muted/10 border-b border-border min-h-[56px] overflow-y-auto max-h-[120px] sm:max-h-none custom-scrollbar">
          {activeTab === 'arch' && (
            <>
             <button onClick={() => addRoom('room')} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Plus size={14} /> {t.block}</button>
             <button onClick={() => addRoom('circle')} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><CircleIcon size={14} /> {t.circle}</button>
             <button onClick={() => addRoom('radius')} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 rounded-md transition-all text-[10px] sm:text-xs font-medium shadow-sm whitespace-nowrap"><Radar size={14} /> {t.radiusZone}</button>
             <div className="w-px h-6 bg-border mx-1 shrink-0 hidden sm:block" />
             <button onClick={() => addDevice('door', 'arch', t.door)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><DoorClosed size={14} /> {t.door}</button>
             <button onClick={addText} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><SquareTerminal size={14} /> {t.text}</button>
             <div className="w-px h-6 bg-border mx-1 shrink-0 hidden sm:block" />
             <button onClick={() => startDrawMode('trunk', 'arch')} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap ${drawMode.active && drawMode.type === 'trunk' ? 'bg-muted border-border text-foreground shadow-inner' : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted'}`}><Box size={14} /> {t.trunk}</button>
             <button onClick={() => startDrawMode('corrugation', 'arch')} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap ${drawMode.active && drawMode.type === 'corrugation' ? 'bg-muted border-border text-foreground shadow-inner' : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted'}`}><Activity size={14} /> {t.corrugation}</button>
            </>
          )}
          {activeTab === 'cctv' && (
            <>
              <button onClick={() => addDevice('camera', 'cctv', t.camera)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Video size={14} /> {t.camera}</button>
              <button onClick={() => addDevice('switch', 'cctv', t.switch)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Network size={14} /> {t.switch}</button>
              <button onClick={() => addDevice('monitor', 'cctv', t.monitor)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Monitor size={14} /> {t.monitor}</button>
              <button onClick={() => addDevice('nvr', 'cctv', t.nvr)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Server size={14} /> {t.nvr}</button>
              <button onClick={() => addDevice('rack', 'cctv', t.rack)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Box size={14} /> {t.rack}</button>
              <div className="w-px h-6 bg-border mx-1 shrink-0 hidden sm:block" />
              <button onClick={() => startDrawMode('cable', 'cctv')} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap ${drawMode.active && drawMode.category === 'cctv' ? 'bg-cyan-600 text-white border-cyan-700 shadow-inner' : 'bg-transparent border-transparent text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30'}`}><Pencil size={14} /> {t.line}</button>
            </>
          )}
          {activeTab === 'lan' && (
             <>
               <button onClick={() => addDevice('router', 'lan', t.router)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Router size={14} /> {t.router}</button>
               <button onClick={() => addDevice('rack', 'lan', t.rack)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Box size={14} /> {t.rack}</button>
               <button onClick={() => addDevice('lan_switch', 'lan', t.lan_switch)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Network size={14} /> {t.lan_switch}</button>
               <button onClick={() => addDevice('wifi', 'lan', t.wifi)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Wifi size={14} /> {t.wifi}</button>
               <button onClick={() => addDevice('pc', 'lan', t.pc)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Monitor size={14} /> {t.pc}</button>
               <button onClick={() => addDevice('printer', 'lan', t.printer)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Printer size={14} /> {t.printer}</button>
               <button onClick={() => addDevice('socket', 'lan', t.socket)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Zap size={14} /> {t.socket}</button>
               <div className="w-px h-6 bg-border mx-1 shrink-0 hidden sm:block" />
               <button onClick={() => startDrawMode('cable', 'lan')} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap ${drawMode.active && drawMode.category === 'lan' ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'bg-transparent border-transparent text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'}`}><Pencil size={14} /> {t.line}</button>
             </>
          )}
          {activeTab === 'fire' && (
             <>
               <button onClick={() => addDevice('smoke', 'fire', t.smoke)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><ShieldAlert size={14} /> {t.smoke}</button>
               <button onClick={() => addDevice('heat', 'fire', t.heat)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Thermometer size={14} /> {t.heat}</button>
               <button onClick={() => addDevice('linear', 'fire', t.linear)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><ScanLine size={14} /> {t.linear}</button>
               <button onClick={() => addDevice('siren', 'fire', t.siren)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><BellRing size={14} /> {t.siren}</button>
               <button onClick={() => addDevice('tableau', 'fire', t.tableau)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><SquareTerminal size={14} /> {t.tableau}</button>
               <button onClick={() => addDevice('call_point', 'fire', t.call_point)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Hand size={14} /> {t.call_point}</button>
               <button onClick={() => addDevice('panel', 'fire', t.panel)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Server size={14} /> {t.panel}</button>
               <div className="w-px h-6 bg-border mx-1 shrink-0 hidden sm:block" />
               <button onClick={() => startDrawMode('cable', 'fire')} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap ${drawMode.active && drawMode.category === 'fire' ? 'bg-red-600 text-white border-red-700 shadow-inner' : 'bg-transparent border-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'}`}><Pencil size={14} /> {t.line}</button>
             </>
          )}
          {activeTab === 'acs' && (
             <>
               <button onClick={() => addDevice('lock', 'acs', t.lock)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Lock size={14} /> {t.lock}</button>
               <button onClick={() => addDevice('reader', 'acs', t.reader)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><CreditCard size={14} /> {t.reader}</button>
               <button onClick={() => addDevice('acs_switch', 'acs', t.acs_switch)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Network size={14} /> {t.acs_switch}</button>
               <button onClick={() => addDevice('exit_btn', 'acs', t.exit_btn)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><LogOut size={14} /> {t.exit_btn}</button>
               <button onClick={() => addDevice('controller', 'acs', t.controller)} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><Cpu size={14} /> {t.controller}</button>
               <div className="w-px h-6 bg-border mx-1 shrink-0 hidden sm:block" />
               <button onClick={() => startDrawMode('cable', 'acs')} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap ${drawMode.active && drawMode.category === 'acs' ? 'bg-amber-600 text-white border-amber-700 shadow-inner' : 'bg-transparent border-transparent text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'}`}><Pencil size={14} /> {t.line}</button>
             </>
          )}
      </div>

      {/* 3. СТРОКА НАСТРОЕК И УПРАВЛЕНИЯ */}
      <div className="flex flex-wrap items-center justify-between p-2 sm:p-3 bg-muted/5 border-b border-border gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          <button onClick={handleUndo} disabled={history.length === 0} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border rounded-md transition-all text-[10px] sm:text-xs font-medium ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}`} title={t.undo}>
              <RotateCcw size={14} /> <span className="hidden sm:inline">{t.undo}</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 border border-border rounded-md bg-secondary/50">
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder={t.planNamePlaceholder}
              className="text-xs sm:text-sm bg-transparent outline-none w-24 sm:w-36 text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSave}
              disabled={!planName.trim() || isSaving}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${!planName.trim() || isSaving ? 'opacity-50 cursor-not-allowed text-muted-foreground' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30'}`}
            >
              {t.savePlan}
            </button>
            <div className="relative">
              <button
                onClick={() => { setIsPlansOpen(!isPlansOpen); if (!isPlansOpen) fetchSavedPlans(); }}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                {t.myPlans}
              </button>
              {isPlansOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {savedPlans.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground">{t.noSavedPlans}</p>
                  ) : (
                    savedPlans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleLoad(p.id)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-muted border-b border-border last:border-0"
                      >
                        {p.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 px-2.5 sm:px-3 py-1.5 border border-border rounded-md bg-secondary/50">
            <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden lg:inline">{t.magnet}</span>
                <button onClick={() => setIsMagnetEnabled(!isMagnetEnabled)} className={`relative inline-flex h-3 w-6 sm:h-4 sm:w-8 items-center rounded-full transition-colors focus:outline-none ${isMagnetEnabled ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}>
                  <span className={`inline-block h-2 w-2 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${isMagnetEnabled ? 'translate-x-3.5 sm:translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden lg:inline">{t.autoRoute}</span>
                <button onClick={() => setIsAutoCable(!isAutoCable)} className={`relative inline-flex h-3 w-6 sm:h-4 sm:w-8 items-center rounded-full transition-colors focus:outline-none ${isAutoCable ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}>
                  <span className={`inline-block h-2 w-2 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${isAutoCable ? 'translate-x-3.5 sm:translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden lg:inline">{t.largeIcons}</span>
                <button onClick={() => setIsLargeIcons(!isLargeIcons)} className={`relative inline-flex h-3 w-6 sm:h-4 sm:w-8 items-center rounded-full transition-colors focus:outline-none ${isLargeIcons ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}>
                  <span className={`inline-block h-2 w-2 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${isLargeIcons ? 'translate-x-3.5 sm:translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
          </div>
          
          {drawMode.active && (
              <button onClick={() => { setDrawMode({active: false, type: 'cable', category: 'arch'}); setCurrentLinePoints(null); }} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-900 rounded-md text-[10px] sm:text-xs font-medium animate-pulse shrink-0">
                  <span className="hidden sm:inline">{t.cancelDraw}</span>
                  <span className="sm:hidden">X</span>
              </button>
          )}
        </div>
        
        <div className="flex items-center gap-0.5 sm:gap-1 bg-secondary rounded-md border border-border p-0.5 shrink-0">
            <button onClick={handleExportPng} className="flex items-center justify-center p-1 sm:p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors" title={t.savePng}>
              <Download size={14} />
            </button>
            <button onClick={toggleFullscreen} className="flex items-center justify-center p-1 sm:p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors" title="На весь экран">
              {isFullscreen ? <Expand size={14} /> : <Maximize size={14} />}
            </button>
            <button onClick={resetView} className="flex items-center justify-center p-1 sm:p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors" title="Сбросить зум">
              <ZoomIn size={14} />
            </button>
            <div className="px-1.5 sm:px-2 py-1 text-[9px] sm:text-[10px] font-mono text-muted-foreground border-l border-border cursor-pointer hover:text-foreground transition-colors" onClick={resetView}>
                {Math.round(scale * 100)}%
            </div>
        </div>
      </div>
      
      {drawMode.active && (
         <div className="bg-yellow-50 dark:bg-yellow-900/20 border-y border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-500 text-[10px] sm:text-xs text-center py-1.5 font-medium shadow-inner">
            {t.drawHint}
         </div>
      )}

      {/* ХОЛСТ */}
      <div className={`relative bg-[#f6f8fa] dark:bg-[#0d1117] overflow-hidden flex justify-center border-b border-border ${drawMode.active ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'} h-[500px] sm:h-full`}>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] [background-size:10px_10px]" />
        
        <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} scaleX={scale} scaleY={scale} x={position.x} y={position.y}
          onWheel={handleWheel}
          onPointerDown={handleStagePointerDown}
          onPointerMove={handleStagePointerMove}
          onTouchStart={handleStagePointerDown}
          onTouchMove={handleStagePointerMove}
        >
          {/* Слой с Вотермарками (на самом дне) */}
          <Layer listening={false}>
             <Group listening={false}>
                {watermarkGrid.map((pos, idx) => (
                    <Text 
                       key={`wm-${idx}`} 
                       x={pos.x} y={pos.y} 
                       rotation={-30} 
                       text="RS STUDIO" 
                       fontSize={60} 
                       fontFamily="monospace" 
                       fontWeight="bold"
                       fill="#888" 
                       opacity={0.03} 
                       listening={false} 
                    />
                ))}
             </Group>
          </Layer>

          {/* Основной Слой (Комнаты, Линии, Оборудование) */}
          <Layer>
            {/* АВТО-ЛИНИИ */}
            {computedCables.lines.map((l, i) => (
              <Line key={i} points={l.points} stroke={l.color} strokeWidth={1} opacity={0.6} dash={l.dash} lineJoin="round" listening={false} />
            ))}

            {/* ЛИНИЯ В ПРОЦЕССЕ РИСОВАНИЯ */}
            {currentLinePoints && (
               renderCustomLine(
                  currentLinePoints, 
                  drawMode.type, 
                  drawMode.category === 'cctv' ? '#06b6d4' : drawMode.category === 'lan' ? '#22c55e' : drawMode.category === 'fire' ? '#ef4444' : drawMode.category === 'acs' ? '#eab308' : '#a3a3a3', 
                  true
               )
            )}

            {/* НАРИСОВАННЫЕ ЛИНИИ */}
            {drawnLines.map((line) => {
               const isArchLine = line.type === 'trunk' || line.type === 'corrugation';
               const color = isArchLine ? '#a3a3a3' : (line.category === 'cctv' ? '#06b6d4' : line.category === 'lan' ? '#22c55e' : line.category === 'acs' ? '#eab308' : '#ef4444');
               
               return (
                  <Group key={line.id} id={line.id} x={line.x || 0} y={line.y || 0} draggable={!drawMode.active}
                     onPointerDown={(e) => { if(!drawMode.active) { e.cancelBubble = true; setSelectedId(line.id); } }}
                     onDragStart={() => saveToHistory()}
                     onDragEnd={(e) => { 
                       e.cancelBubble = true; 
                       setDrawnLines(prev => prev.map(l => l.id === line.id ? { ...l, x: e.target.x(), y: e.target.y() } : l)); 
                     }}
                  >
                      {/* Невидимая толстая линия для удобного клика/выделения */}
                      <Line points={line.points} stroke="transparent" strokeWidth={20} hitStrokeWidth={20} />
                      {/* Сама визуальная линия (кабель, гофра, или лоток) */}
                      {renderCustomLine(line.points, line.type, color, selectedId === line.id)}
                  </Group>
               )
            })}

            {/* КОМНАТЫ И РАДИУСЫ */}
            {rooms.map((room) => {
              const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
                 const node = e.target;
                 const { x, y } = getSnapPos(node.x(), node.y());
                 node.position({ x, y });
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
                         const snapW = Math.round(newW / SNAP_SIZE) * SNAP_SIZE;
                         const snapH = Math.round(newH / SNAP_SIZE) * SNAP_SIZE;
                         if (Math.abs(newW - snapW) < SNAP_DISTANCE) newW = snapW;
                         if (Math.abs(newH - snapH) < SNAP_DISTANCE) newH = snapH;
                      }

                      node.setAttrs({ width: newW, height: newH, scaleX: 1, scaleY: 1 });
                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, width: newW, height: newH } : r));
                    }}
                  >
                    {room.type === 'room' && (
                       <Rect width={room.width} height={room.height} fill="rgba(163, 163, 163, 0.05)" stroke={selectedId === room.id ? "#2563eb" : "#a3a3a3"} strokeWidth={selectedId === room.id ? 4 : 2} />
                    )}
                    {room.type === 'circle' && (
                       <Circle x={room.width/2} y={room.height/2} radius={room.width/2} fill="rgba(163, 163, 163, 0.05)" stroke={selectedId === room.id ? "#2563eb" : "#a3a3a3"} strokeWidth={selectedId === room.id ? 4 : 2} />
                    )}
                    {room.type === 'radius' && (
                       <Group>
                           <Circle x={room.width/2} y={room.height/2} radius={room.width/2} fill="rgba(59, 130, 246, 0.05)" stroke={selectedId === room.id ? "#2563eb" : "#3b82f6"} strokeWidth={2} dash={[5,5]} />
                           <Text text={`${t.radius}: ${((room.width/2) * M_PER_PX).toFixed(1)} М`} x={0} y={room.height + 5} width={room.width} align="center" fill="#3b82f6" opacity={0.8} fontSize={10} fontStyle="bold" listening={false} />
                       </Group>
                    )}
                    
                    {room.type !== 'radius' && (
                       <Text text={`${(room.width * M_PER_PX).toFixed(1)}x${(room.height * M_PER_PX).toFixed(1)}`} width={room.width} height={room.height} align="center" verticalAlign="middle" fill="#9ca3af" opacity={0.8} fontSize={12} fontFamily="monospace" listening={false} />
                    )}
                  </Group>
              )
            })}

            {/* ТЕКСТОВЫЕ АННОТАЦИИ */}
            {texts.map((txt) => (
              <Text
                key={txt.id}
                id={txt.id}
                text={txt.content}
                x={txt.x}
                y={txt.y}
                rotation={txt.rotation}
                fontSize={txt.fontSize}
                fontStyle={txt.bold ? 'bold' : 'normal'}
                fill={selectedId === txt.id ? '#2563eb' : '#374151'}
                draggable={!drawMode.active}
                onPointerDown={(e) => { if (!drawMode.active) { e.cancelBubble = true; setSelectedId(txt.id); } }}
                onDragStart={() => saveToHistory()}
                onDragMove={(e) => {
                  const node = e.target;
                  const { x, y } = getSnapPos(node.x(), node.y());
                  node.position({ x, y });
                }}
                onDragEnd={(e) => { e.cancelBubble = true; setTexts((prev) => prev.map((t2) => (t2.id === txt.id ? { ...t2, x: e.target.x(), y: e.target.y() } : t2))); }}
                onTransformStart={() => saveToHistory()}
                onTransform={(e) => {
                  const node = e.target;
                  setTexts((prev) => prev.map((t2) => (t2.id === txt.id ? { ...t2, rotation: node.rotation() } : t2)));
                  node.scaleX(1);
                  node.scaleY(1);
                }}
              />
            ))}

            {/* ПРОФЕССИОНАЛЬНЫЕ ИКОНКИ */}
            {devices.map((dev) => {
               const color = dev.category === 'cctv' ? '#06b6d4' : dev.category === 'lan' ? '#22c55e' : dev.category === 'acs' ? '#eab308' : dev.category === 'fire' ? '#ef4444' : '#a3a3a3';
               
               const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
                 const node = e.target;
                 const { x, y } = getSnapPos(node.x(), node.y());
                 node.position({ x, y });
               };

               const radiusColor = dev.type === 'wifi' ? '#22c55e' : '#ef4444';
               const radiusFill = dev.type === 'wifi' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)';

               return (
                  <Group key={dev.id} id={dev.id} draggable={!drawMode.active} x={dev.x} y={dev.y}
                    onPointerDown={(e) => { if(!drawMode.active) { e.cancelBubble = true; setSelectedId(dev.id); } }}
                    onDragStart={() => saveToHistory()}
                    onDragMove={handleDragMove}
                    onDragEnd={(e) => { e.cancelBubble = true; setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, x: e.target.x(), y: e.target.y() } : d)); }}
                  >
                    {/* ЗОНА ОБЗОРА КАМЕРЫ */}
                    {dev.type === 'camera' && (
                       <Group rotation={dev.rotation} scaleX={iconScale} scaleY={iconScale}>
                           <Wedge radius={140} angle={60} rotation={-30} fill="#06b6d4" opacity={0.15} x={10} y={0} listening={false}/>
                       </Group>
                    )}

                    {/* РАДИУСЫ (WI-FI, ПОЖАРКА) */}
                    {['wifi', 'smoke', 'heat'].includes(dev.type) && (
                       <Group rotation={dev.rotation}>
                           <Circle radius={dev.radius || 100} fill={radiusFill} stroke={radiusColor} strokeWidth={1} dash={[5,5]} listening={false} />
                           {selectedId === dev.id && (
                              <Circle 
                                 x={dev.radius || 100} y={0} r={6} fill="#ffffff" stroke="#2563eb" strokeWidth={2} draggable
                                 onDragStart={(e) => { e.cancelBubble = true; saveToHistory(); }}
                                 onDragMove={(e) => {
                                    e.cancelBubble = true;
                                    const node = e.target;
                                    const newRadius = Math.max(20, Math.hypot(node.x(), node.y()));
                                    node.position({ x: newRadius, y: 0 }); // Фиксируем ручку строго по оси X
                                    setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, radius: newRadius } : d));
                                 }}
                                 onDragEnd={(e) => { e.cancelBubble = true; }}
                              />
                           )}
                       </Group>
                    )}

                    {/* САМ БЛОК УСТРОЙСТВА */}
                    <Group id={`dev_body_${dev.id}`} rotation={dev.rotation} 
                       scaleX={dev.type === 'door' ? (dev.scaleX || 1) : iconScale} 
                       scaleY={dev.type === 'door' ? (dev.scaleY || 1) : iconScale}
                       onTransformStart={() => saveToHistory()}
                       onTransform={(e) => {
                           const node = e.target;
                           setDevices(prev => prev.map(d => d.id === dev.id ? { 
                               ...d, 
                               rotation: node.rotation(),
                               scaleX: d.type === 'door' ? node.scaleX() : d.scaleX,
                               scaleY: d.type === 'door' ? node.scaleY() : d.scaleY
                           } : d))
                       }}
                    >
                        {selectedId === dev.id && dev.type !== 'camera' && <Circle r={24} fill="rgba(37, 99, 235, 0.1)" listening={false} />}
                        {selectedId === dev.id && dev.type === 'camera' && <Circle r={16} fill="rgba(37, 99, 235, 0.1)" listening={false} />}

                        {dev.type === 'door' ? (
                           <Group>
                              <Path data="M 0,0 L 0,-30 A 30,30 0 0,1 30,0 Z" stroke={color} strokeWidth={2} fill="transparent" />
                              <Rect width={30} height={3} x={0} y={-1.5} fill={color} />
                              <Line points={[0,0, 0,-30]} stroke={color} strokeWidth={3} />
                           </Group>
                        ) : (
                           <Path 
                              data={DEVICE_PATHS[dev.type] || "M-10,-10 H10 V10 H-10 Z"} 
                              fill={dev.type === 'wifi' ? "transparent" : "#ffffff"} 
                              stroke={color} 
                              strokeWidth={2} 
                              strokeLineCap="round" 
                              strokeLineJoin="round" 
                           />
                        )}
                    </Group>

                    {/* Текст (Скрыт для двери) */}
                    {dev.type !== 'door' && (
                       <Text text={dev.label} y={(dev.type === 'rack' || dev.type === 'panel' || dev.type === 'controller' ? 30 : 20) * iconScale} x={-40} width={80} align="center" fill="#6b7280" opacity={0.9} fontSize={10} fontStyle="bold" listening={false} />
                    )}
                  </Group>
               )
            })}

            <Transformer ref={trRef} flipEnabled={false} anchorFill="#ffffff" anchorStroke="#2563eb" anchorSize={8} borderStroke="#2563eb" keepRatio={false} />
          </Layer>

          {/* Слой с Футером (Поверх всего, привязан к правому нижнему углу) */}
          <Layer listening={false}>
               <Text 
                  text="DEVELOPED BY RS STUDIO FROM TOO SBA"
                  x={-position.x / scale}
                  y={(-position.y + stageSize.height - 25) / scale}
                  width={stageSize.width / scale - 15}
                  align="right"
                  fontSize={12 / scale}
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#6b7280"
                  opacity={0.8}
                  listening={false}
               />
          </Layer>
        </Stage>

        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 max-w-[calc(100vw-32px)]">
          <div className="flex flex-wrap sm:flex-nowrap bg-background/90 backdrop-blur-md border border-border rounded-lg p-2 sm:p-3 shadow-sm items-center gap-3 sm:gap-4 pointer-events-none">
            <div className="text-right">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">{t.autoMeters}</p>
                <p className="text-green-600 dark:text-green-500 font-bold text-base sm:text-lg font-mono">{computedCables.totalAuto} М</p>
            </div>
            <div className="text-right border-l border-border pl-3 sm:pl-4">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">{t.manualMeters}</p>
                <p className="text-yellow-600 dark:text-yellow-500 font-bold text-base sm:text-lg font-mono">{totalMeters} М</p>
            </div>
            <div className="text-right border-l border-border pl-3 sm:pl-4">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">{t.totalMeters}</p>
                <p className="text-blue-600 dark:text-blue-500 font-bold text-base sm:text-lg font-mono">{computedCables.totalAuto + totalMeters} М</p>
            </div>
          </div>

          {selectedId && !drawMode.active && (
            <div className="flex bg-background/90 backdrop-blur-md border border-border rounded-lg p-1.5 shadow-sm items-center gap-2 pointer-events-auto max-w-full overflow-hidden">
                {/* Редактирование Названия */}
                {devices.find(d => d.id === selectedId) && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 border-r border-border shrink-0">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Модель:</span>
                        <input 
                            type="text" 
                            placeholder="Напр. Hikvision"
                            value={devices.find(d => d.id === selectedId)?.label || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setDevices(prev => prev.map(d => d.id === selectedId ? { ...d, label: val } : d));
                            }}
                            onFocus={() => saveToHistory()}
                            className="text-xs sm:text-sm font-medium bg-transparent border-b border-dashed border-muted-foreground/50 outline-none w-20 sm:w-32 text-foreground focus:border-blue-500 py-0.5"
                        />
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase ml-2">{t.priceLabel}</span>
                        <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={devices.find(d => d.id === selectedId)?.price ?? ''}
                            onChange={(e) => {
                                const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                setDevices(prev => prev.map(d => d.id === selectedId ? { ...d, price: val } : d));
                            }}
                            onFocus={() => saveToHistory()}
                            className="text-xs sm:text-sm font-medium bg-transparent border-b border-dashed border-muted-foreground/50 outline-none w-16 sm:w-20 text-foreground focus:border-blue-500 py-0.5"
                        />
                    </div>
                )}

                {/* Настройка радиуса (только для Wi-Fi и Пожарки) */}
                {['wifi', 'smoke', 'heat'].includes(devices.find(d => d.id === selectedId)?.type || '') && (
                     <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 border-r border-border shrink-0">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Радиус (М):</span>
                        <input
                            type="number"
                            value={Math.round((devices.find(d => d.id === selectedId)?.radius || 100) * M_PER_PX)}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setDevices(prev => prev.map(d => d.id === selectedId ? { ...d, radius: val / M_PER_PX } : d));
                            }}
                            className="text-xs sm:text-sm font-medium bg-transparent border-b border-dashed border-muted-foreground/50 outline-none w-10 sm:w-12 text-center text-foreground focus:border-blue-500 py-0.5"
                        />
                    </div>
                )}

                {/* Редактирование текста */}
                {texts.find(t2 => t2.id === selectedId) && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 border-r border-border shrink-0">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">{t.textContent}</span>
                        <input
                            type="text"
                            value={texts.find(t2 => t2.id === selectedId)?.content || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTexts(prev => prev.map(t2 => t2.id === selectedId ? { ...t2, content: val } : t2));
                            }}
                            onFocus={() => saveToHistory()}
                            className="text-xs sm:text-sm font-medium bg-transparent border-b border-dashed border-muted-foreground/50 outline-none w-24 sm:w-40 text-foreground focus:border-blue-500 py-0.5"
                        />
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase ml-1">{t.textSize}</span>
                        {([12, 18, 28] as const).map((size, i) => (
                            <button
                                key={size}
                                onClick={() => { saveToHistory(); setTexts(prev => prev.map(t2 => t2.id === selectedId ? { ...t2, fontSize: size } : t2)); }}
                                className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${texts.find(t2 => t2.id === selectedId)?.fontSize === size ? 'bg-blue-600 text-white border-blue-700' : 'bg-transparent border-border text-muted-foreground hover:bg-muted'}`}
                            >
                                {[t.textSizeS, t.textSizeM, t.textSizeL][i]}
                            </button>
                        ))}
                    </div>
                )}

                <button onClick={() => {
                    saveToHistory();
                    setRooms(rooms.filter(r => r.id !== selectedId));
                    setDevices(devices.filter(d => d.id !== selectedId));
                    setDrawnLines(drawnLines.filter(l => l.id !== selectedId));
                    setTexts(texts.filter(t2 => t2.id !== selectedId));
                    setSelectedId(null);
                  }}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-md transition-all flex items-center justify-center shrink-0">
                  <Trash2 size={16} />
                </button>
            </div>
          )}
        </div>

        {position.x === 0 && scale === 1 && rooms.length === 0 && devices.length === 0 && drawnLines.length === 0 && texts.length === 0 && !drawMode.active && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40 text-center pointer-events-none px-4">
                <p className="font-mono text-xs sm:text-sm font-bold uppercase">{t.emptyHint}</p>
                <p className="text-[10px] sm:text-xs mt-1 opacity-70 italic">{t.betaHint}</p>
                <p className="text-[9px] sm:text-[10px] mt-4 font-mono">{t.controlsHint}</p>
            </div>
        )}
      </div>
    </div>
  );
};