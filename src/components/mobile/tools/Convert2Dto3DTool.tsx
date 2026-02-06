import { useState, useRef, useEffect, useCallback } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

interface Room2D {
  id: string;
  label: string;
  x: number; y: number;
  w: number; h: number;
  color: string;
  wallHeight: number;
}

const TEMPLATES: { id: string; ar: string; en: string; rooms: Omit<Room2D, 'id'>[] }[] = [
  {
    id: 'studio', ar: 'استوديو', en: 'Studio',
    rooms: [
      { label: 'Living', x: 10, y: 10, w: 120, h: 80, color: '#2AA676', wallHeight: 40 },
      { label: 'Kitchen', x: 130, y: 10, w: 60, h: 40, color: '#F59E0B', wallHeight: 35 },
      { label: 'Bath', x: 130, y: 50, w: 60, h: 40, color: '#3B82F6', wallHeight: 30 },
    ],
  },
  {
    id: '1bhk', ar: 'غرفة وصالة', en: '1 BHK',
    rooms: [
      { label: 'Living', x: 10, y: 10, w: 80, h: 70, color: '#2AA676', wallHeight: 40 },
      { label: 'Bedroom', x: 90, y: 10, w: 80, h: 55, color: '#8B5CF6', wallHeight: 40 },
      { label: 'Kitchen', x: 10, y: 80, w: 60, h: 40, color: '#F59E0B', wallHeight: 35 },
      { label: 'Bath', x: 90, y: 65, w: 40, h: 35, color: '#3B82F6', wallHeight: 30 },
      { label: 'Balcony', x: 130, y: 65, w: 40, h: 35, color: '#6B7280', wallHeight: 15 },
    ],
  },
  {
    id: '2bhk', ar: 'غرفتين وصالة', en: '2 BHK',
    rooms: [
      { label: 'Living', x: 10, y: 10, w: 90, h: 60, color: '#2AA676', wallHeight: 40 },
      { label: 'Master', x: 100, y: 10, w: 70, h: 55, color: '#8B5CF6', wallHeight: 40 },
      { label: 'Bedroom', x: 10, y: 70, w: 65, h: 50, color: '#EC4899', wallHeight: 40 },
      { label: 'Kitchen', x: 75, y: 70, w: 45, h: 30, color: '#F59E0B', wallHeight: 35 },
      { label: 'Bath 1', x: 75, y: 100, w: 30, h: 20, color: '#3B82F6', wallHeight: 30 },
      { label: 'Bath 2', x: 120, y: 65, w: 30, h: 25, color: '#3B82F6', wallHeight: 30 },
      { label: 'Hall', x: 105, y: 90, w: 65, h: 30, color: '#C8A86A', wallHeight: 40 },
    ],
  },
  {
    id: 'villa', ar: 'فيلا', en: 'Villa',
    rooms: [
      { label: 'Majlis', x: 10, y: 10, w: 80, h: 60, color: '#C8A86A', wallHeight: 50 },
      { label: 'Living', x: 90, y: 10, w: 80, h: 60, color: '#2AA676', wallHeight: 45 },
      { label: 'Master', x: 10, y: 70, w: 70, h: 50, color: '#8B5CF6', wallHeight: 45 },
      { label: 'Bedroom', x: 80, y: 70, w: 55, h: 50, color: '#EC4899', wallHeight: 45 },
      { label: 'Kitchen', x: 135, y: 70, w: 35, h: 30, color: '#F59E0B', wallHeight: 40 },
      { label: 'Bath', x: 135, y: 100, w: 35, h: 20, color: '#3B82F6', wallHeight: 30 },
    ],
  },
];

const SCALE_3D = 1.0;

export function Convert2Dto3DTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);

  const [rooms, setRooms] = useState<Room2D[]>([]);
  const [viewMode, setViewMode] = useState<'split' | '2d' | '3d'>('split');
  const [rotY, setRotY] = useState(35);
  const [rotX, setRotX] = useState(25);
  const [showLabels, setShowLabels] = useState(true);

  const genId = () => `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const draw2D = useCallback(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#FAFAF9';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    rooms.forEach(room => {
      // Fill
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = room.color;
      ctx.fillRect(room.x, room.y, room.w, room.h);
      ctx.globalAlpha = 1;

      // Border
      ctx.strokeStyle = room.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(room.x, room.y, room.w, room.h);

      // Label
      if (showLabels) {
        ctx.fillStyle = '#1F3D2B';
        ctx.font = 'bold 9px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(room.label, room.x + room.w / 2, room.y + room.h / 2);
      }
    });

    // Title
    ctx.fillStyle = '#9CA3AF';
    ctx.font = 'bold 10px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isEn ? '2D Floor Plan' : 'مسقط أفقي 2D', W / 2, H - 6);
  }, [rooms, showLabels, isEn]);

  const project3D = useCallback((x: number, y: number, z: number, cx: number, cy: number) => {
    const radY = (rotY * Math.PI) / 180;
    const radX = (rotX * Math.PI) / 180;
    const cosY = Math.cos(radY), sinY = Math.sin(radY);
    const cosX = Math.cos(radX), sinX = Math.sin(radX);
    const rx = x * cosY - z * sinY;
    const rz = x * sinY + z * cosY;
    const ry = y * cosX - rz * sinX;
    return { x: cx + rx * SCALE_3D, y: cy - ry * SCALE_3D };
  }, [rotY, rotX]);

  const draw3D = useCallback(() => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H * 0.65;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(42,166,118,0.08)';
    ctx.lineWidth = 0.5;
    for (let i = -100; i <= 100; i += 20) {
      const p1 = project3D(i, 0, -100, cx, cy);
      const p2 = project3D(i, 0, 100, cx, cy);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      const p3 = project3D(-100, 0, i, cx, cy);
      const p4 = project3D(100, 0, i, cx, cy);
      ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
    }

    // Sort rooms
    const sorted = [...rooms].sort((a, b) => {
      const da = project3D(a.x + a.w / 2, 0, a.y + a.h / 2, cx, cy);
      const db = project3D(b.x + b.w / 2, 0, b.y + b.h / 2, cx, cy);
      return da.y - db.y;
    });

    // Offset to center
    const totalW = rooms.reduce((m, r) => Math.max(m, r.x + r.w), 0);
    const totalH = rooms.reduce((m, r) => Math.max(m, r.y + r.h), 0);
    const ox = -totalW / 2, oz = -totalH / 2;

    sorted.forEach(room => {
      const wh = room.wallHeight;
      const rx = room.x + ox, rz = room.y + oz;

      // Floor
      const f = [
        project3D(rx, 0, rz, cx, cy),
        project3D(rx + room.w, 0, rz, cx, cy),
        project3D(rx + room.w, 0, rz + room.h, cx, cy),
        project3D(rx, 0, rz + room.h, cx, cy),
      ];
      const drawPoly = (pts: { x: number; y: number }[], color: string) => {
        ctx.fillStyle = color;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Floor
      const r = parseInt(room.color.slice(1, 3), 16);
      const g = parseInt(room.color.slice(3, 5), 16);
      const b = parseInt(room.color.slice(5, 7), 16);

      drawPoly(f, `rgba(${r},${g},${b},0.3)`);

      // Walls
      const wallFaces = [
        [project3D(rx, 0, rz, cx, cy), project3D(rx + room.w, 0, rz, cx, cy), project3D(rx + room.w, wh, rz, cx, cy), project3D(rx, wh, rz, cx, cy)],
        [project3D(rx, 0, rz + room.h, cx, cy), project3D(rx + room.w, 0, rz + room.h, cx, cy), project3D(rx + room.w, wh, rz + room.h, cx, cy), project3D(rx, wh, rz + room.h, cx, cy)],
        [project3D(rx, 0, rz, cx, cy), project3D(rx, 0, rz + room.h, cx, cy), project3D(rx, wh, rz + room.h, cx, cy), project3D(rx, wh, rz, cx, cy)],
        [project3D(rx + room.w, 0, rz, cx, cy), project3D(rx + room.w, 0, rz + room.h, cx, cy), project3D(rx + room.w, wh, rz + room.h, cx, cy), project3D(rx + room.w, wh, rz, cx, cy)],
      ];

      const shades = [0.6, 0.5, 0.7, 0.55];
      wallFaces.forEach((face, i) => {
        const s = shades[i];
        drawPoly(face, `rgba(${Math.round(r * s)},${Math.round(g * s)},${Math.round(b * s)},0.7)`);
      });

      // Label
      if (showLabels) {
        const center = project3D(rx + room.w / 2, wh + 5, rz + room.h / 2, cx, cy);
        ctx.fillStyle = '#F0E8DA';
        ctx.font = 'bold 8px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.label, center.x, center.y);
      }
    });

    // Title
    ctx.fillStyle = '#4B5563';
    ctx.font = 'bold 10px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isEn ? '3D View' : 'منظور 3D', W / 2, H - 6);
  }, [rooms, rotY, rotX, showLabels, project3D, isEn]);

  useEffect(() => { draw2D(); draw3D(); }, [draw2D, draw3D]);

  const loadTemplate = (t: typeof TEMPLATES[0]) => {
    setRooms(t.rooms.map(r => ({ ...r, id: genId() })));
  };

  return (
    <SimpleToolShell
      title={isEn ? '2D to 3D Converter' : 'محوّل من 2D إلى 3D'}
      subtitle={isEn ? 'Convert floor plans to 3D models' : 'حوّل المخططات الأفقية إلى نماذج ثلاثية الأبعاد'}
      onBack={onBack}
      icon="🔄"
      gradientFrom="#2AA676"
      gradientTo="#1F6F50"
      backLabel={isEn ? 'Back' : 'رجوع'}
    >
      <div className="space-y-4 p-4" dir="rtl">
        {/* Templates */}
        <div>
          <label className="text-xs font-bold text-[#1F3D2B]/70 mb-2 block" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Choose a Floor Plan' : 'اختر مخطط'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => loadTemplate(t)}
                className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-[#1F3D2B] hover:bg-green-50 hover:border-green-300 transition-all"
                style={{ fontFamily: fontCairo }}>
                {isEn ? t.en : t.ar}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
          {([
            { id: 'split' as const, ar: 'مقسّم', en: 'Split' },
            { id: '2d' as const, ar: '2D فقط', en: '2D Only' },
            { id: '3d' as const, ar: '3D فقط', en: '3D Only' },
          ]).map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === m.id ? 'bg-white text-[#2AA676] shadow-sm' : 'text-gray-500'
              }`} style={{ fontFamily: fontCairo }}>
              {isEn ? m.en : m.ar}
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div className={`${viewMode === 'split' ? 'grid grid-cols-2 gap-2' : ''}`}>
          {(viewMode === 'split' || viewMode === '2d') && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <canvas ref={canvas2dRef} width={viewMode === 'split' ? 180 : 340} height={viewMode === 'split' ? 140 : 200} className="w-full" />
            </div>
          )}
          {(viewMode === 'split' || viewMode === '3d') && (
            <div className="bg-[#111318] rounded-2xl border border-gray-700 shadow-sm overflow-hidden">
              <canvas ref={canvas3dRef} width={viewMode === 'split' ? 180 : 340} height={viewMode === 'split' ? 140 : 200} className="w-full" />
            </div>
          )}
        </div>

        {/* 3D Rotation */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1F3D2B]/60 w-16" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Angle Y' : 'زاوية Y'}
            </span>
            <input type="range" min={0} max={360} value={rotY} onChange={e => setRotY(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #2AA676 ${(rotY / 360) * 100}%, #E5E7EB ${(rotY / 360) * 100}%)` }} />
            <span className="text-xs text-gray-400 w-8 text-center">{rotY}°</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1F3D2B]/60 w-16" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Angle X' : 'زاوية X'}
            </span>
            <input type="range" min={5} max={80} value={rotX} onChange={e => setRotX(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #2AA676 ${((rotX - 5) / 75) * 100}%, #E5E7EB ${((rotX - 5) / 75) * 100}%)` }} />
            <span className="text-xs text-gray-400 w-8 text-center">{rotX}°</span>
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-2">
          <button onClick={() => setShowLabels(l => !l)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${showLabels ? 'bg-[#2AA676] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500'}`}
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Labels' : 'تسميات'} {showLabels ? '✓' : ''}
          </button>
          <button onClick={() => setRooms([])}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-red-500 hover:bg-red-50"
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Clear' : 'مسح'}
          </button>
        </div>

        {/* Rooms Info */}
        {rooms.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Rooms' : 'الغرف'} ({rooms.length})
            </h4>
            <div className="space-y-1.5">
              {rooms.map(r => (
                <div key={r.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: r.color }} />
                  <span className="flex-1 text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: fontCairo }}>{r.label}</span>
                  <span className="text-[10px] text-gray-400">
                    {isEn ? `Wall: ${r.wallHeight}px` : `جدار: ${r.wallHeight}`}
                  </span>
                  <input type="range" min={10} max={60} value={r.wallHeight}
                    onChange={e => setRooms(prev => prev.map(rm => rm.id === r.id ? { ...rm, wallHeight: Number(e.target.value) } : rm))}
                    className="w-20 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to left, ${r.color} ${((r.wallHeight - 10) / 50) * 100}%, #E5E7EB ${((r.wallHeight - 10) / 50) * 100}%)` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700" style={{ fontFamily: fontCairo }}>
          {isEn
            ? 'Select a template, then rotate the 3D view to explore. Adjust wall heights per room.'
            : 'اختر قالباً ثم قم بتدوير المنظور ثلاثي الأبعاد لاستكشافه. عدّل ارتفاع الجدران لكل غرفة.'}
        </div>
      </div>
    </SimpleToolShell>
  );
}
