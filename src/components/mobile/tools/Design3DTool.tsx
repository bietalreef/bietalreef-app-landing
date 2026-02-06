import { useState, useRef, useEffect, useCallback } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

interface Box3D {
  id: string;
  x: number; y: number; z: number;
  w: number; h: number; d: number;
  color: string;
  label?: string;
}

const ISO_ANGLE = Math.PI / 6; // 30 degrees
const SCALE = 1.2;

const PRESETS: { id: string; ar: string; en: string; boxes: Omit<Box3D, 'id'>[] }[] = [
  {
    id: 'room', ar: 'غرفة فارغة', en: 'Empty Room',
    boxes: [
      { x: 0, y: 0, z: 0, w: 140, h: 5, d: 100, color: '#E8E4D9', label: '' }, // Floor
      { x: 0, y: 0, z: 0, w: 5, h: 70, d: 100, color: '#D4CFC4' }, // Left wall
      { x: 0, y: 0, z: 95, w: 140, h: 70, d: 5, color: '#C4BFB3' }, // Back wall
    ],
  },
  {
    id: 'living', ar: 'غرفة معيشة', en: 'Living Room',
    boxes: [
      { x: 0, y: 0, z: 0, w: 140, h: 3, d: 100, color: '#D4CFC4' }, // Floor
      { x: 0, y: 0, z: 0, w: 3, h: 60, d: 100, color: '#B8B0A2' },
      { x: 0, y: 0, z: 97, w: 140, h: 60, d: 3, color: '#A69B8D' },
      { x: 15, y: 3, z: 15, w: 55, h: 20, d: 30, color: '#8B5CF6', label: 'Sofa' },
      { x: 30, y: 3, z: 55, w: 25, h: 12, d: 25, color: '#C8A86A', label: 'Table' },
      { x: 100, y: 3, z: 30, w: 5, h: 35, d: 30, color: '#3B82F6', label: 'TV' },
    ],
  },
  {
    id: 'bedroom', ar: 'غرفة نوم', en: 'Bedroom',
    boxes: [
      { x: 0, y: 0, z: 0, w: 120, h: 3, d: 100, color: '#E8E4D9' },
      { x: 0, y: 0, z: 0, w: 3, h: 60, d: 100, color: '#D4CFC4' },
      { x: 0, y: 0, z: 97, w: 120, h: 60, d: 3, color: '#C4BFB3' },
      { x: 20, y: 3, z: 30, w: 60, h: 15, d: 50, color: '#2AA676', label: 'Bed' },
      { x: 10, y: 3, z: 10, w: 20, h: 12, d: 18, color: '#C8A86A', label: 'Nightstand' },
      { x: 90, y: 3, z: 10, w: 25, h: 55, d: 20, color: '#6B7280', label: 'Wardrobe' },
    ],
  },
];

const COLORS = ['#2AA676', '#1F3D2B', '#C8A86A', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#F59E0B', '#6B7280', '#D4CFC4'];

export function Design3DTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boxes, setBoxes] = useState<Box3D[]>([]);
  const [rotY, setRotY] = useState(45);
  const [rotX, setRotX] = useState(30);
  const [showGrid, setShowGrid] = useState(true);
  const [newBox, setNewBox] = useState({ w: 40, h: 25, d: 30, color: '#2AA676', label: '' });

  const genId = () => `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const project = useCallback((x: number, y: number, z: number, cx: number, cy: number) => {
    const radY = (rotY * Math.PI) / 180;
    const radX = (rotX * Math.PI) / 180;
    const cosY = Math.cos(radY), sinY = Math.sin(radY);
    const cosX = Math.cos(radX), sinX = Math.sin(radX);

    // Rotate around Y
    const rx = x * cosY - z * sinY;
    const rz = x * sinY + z * cosY;
    // Rotate around X
    const ry = y * cosX - rz * sinX;
    const rz2 = y * sinX + rz * cosX;

    return {
      x: cx + rx * SCALE,
      y: cy - ry * SCALE,
      z: rz2,
    };
  }, [rotY, rotX]);

  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H * 0.6;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, W, H);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(42, 166, 118, 0.12)';
      ctx.lineWidth = 0.5;
      for (let i = -80; i <= 80; i += 20) {
        const p1 = project(i, 0, -80, cx, cy);
        const p2 = project(i, 0, 80, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        const p3 = project(-80, 0, i, cx, cy);
        const p4 = project(80, 0, i, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }
    }

    // Sort boxes by depth for correct rendering
    const sorted = [...boxes].sort((a, b) => {
      const pa = project(a.x + a.w / 2, a.y + a.h / 2, a.z + a.d / 2, cx, cy);
      const pb = project(b.x + b.w / 2, b.y + b.h / 2, b.z + b.d / 2, cx, cy);
      return pb.z - pa.z;
    });

    sorted.forEach(box => {
      // 8 corners
      const corners = [
        project(box.x, box.y, box.z, cx, cy),
        project(box.x + box.w, box.y, box.z, cx, cy),
        project(box.x + box.w, box.y, box.z + box.d, cx, cy),
        project(box.x, box.y, box.z + box.d, cx, cy),
        project(box.x, box.y + box.h, box.z, cx, cy),
        project(box.x + box.w, box.y + box.h, box.z, cx, cy),
        project(box.x + box.w, box.y + box.h, box.z + box.d, cx, cy),
        project(box.x, box.y + box.h, box.z + box.d, cx, cy),
      ];

      const drawFace = (indices: number[], shade: number) => {
        const r = parseInt(box.color.slice(1, 3), 16);
        const g = parseInt(box.color.slice(3, 5), 16);
        const b = parseInt(box.color.slice(5, 7), 16);
        ctx.fillStyle = `rgb(${Math.round(r * shade)}, ${Math.round(g * shade)}, ${Math.round(b * shade)})`;
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(corners[indices[0]].x, corners[indices[0]].y);
        for (let i = 1; i < indices.length; i++) {
          ctx.lineTo(corners[indices[i]].x, corners[indices[i]].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Draw visible faces (top, front-left, front-right)
      drawFace([4, 5, 6, 7], 1.0); // Top
      drawFace([0, 1, 5, 4], 0.75); // Front
      drawFace([1, 2, 6, 5], 0.6); // Right
      drawFace([3, 0, 4, 7], 0.65); // Left
      drawFace([2, 3, 7, 6], 0.55); // Back

      // Label
      if (box.label) {
        const center = project(box.x + box.w / 2, box.y + box.h + 2, box.z + box.d / 2, cx, cy);
        ctx.fillStyle = '#F0E8DA';
        ctx.font = 'bold 9px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(box.label, center.x, center.y);
      }
    });
  }, [boxes, rotY, rotX, showGrid, project]);

  useEffect(() => { drawAll(); }, [drawAll]);

  const loadPreset = (p: typeof PRESETS[0]) => {
    setBoxes(p.boxes.map(b => ({ ...b, id: genId() })));
  };

  const addBox = () => {
    setBoxes(prev => [...prev, {
      id: genId(),
      x: Math.random() * 40 - 20,
      y: 0,
      z: Math.random() * 40 - 20,
      ...newBox,
    }]);
  };

  const removeLastBox = () => setBoxes(prev => prev.slice(0, -1));
  const clearAll = () => setBoxes([]);

  return (
    <SimpleToolShell
      title={isEn ? '3D Room Visualizer' : 'عارض الغرف ثلاثي الأبعاد'}
      subtitle={isEn ? 'Visualize rooms & furniture in 3D' : 'تصوّر الغرف والأثاث بشكل ثلاثي الأبعاد'}
      onBack={onBack}
      icon="🧊"
      gradientFrom="#8B5CF6"
      gradientTo="#6D28D9"
      backLabel={isEn ? 'Back' : 'رجوع'}
    >
      <div className="space-y-4 p-4" dir="rtl">
        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => loadPreset(p)}
              className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-[#1F3D2B] hover:bg-purple-50 hover:border-purple-300 transition-all"
              style={{ fontFamily: fontCairo }}>
              {isEn ? p.en : p.ar}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="bg-[#111318] rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
          <canvas ref={canvasRef} width={340} height={260} className="w-full" />
        </div>

        {/* Rotation Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1F3D2B]/60 w-20" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Rotate Y' : 'دوران Y'}
            </span>
            <input type="range" min={0} max={360} value={rotY} onChange={e => setRotY(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #8B5CF6 ${(rotY / 360) * 100}%, #E5E7EB ${(rotY / 360) * 100}%)` }} />
            <span className="text-xs text-[#1F3D2B]/50 w-8 text-center">{rotY}°</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1F3D2B]/60 w-20" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Rotate X' : 'دوران X'}
            </span>
            <input type="range" min={0} max={90} value={rotX} onChange={e => setRotX(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #8B5CF6 ${(rotX / 90) * 100}%, #E5E7EB ${(rotX / 90) * 100}%)` }} />
            <span className="text-xs text-[#1F3D2B]/50 w-8 text-center">{rotX}°</span>
          </div>
        </div>

        {/* Add Box Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h4 className="text-sm font-bold text-[#1F3D2B] mb-3" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Add Object' : 'إضافة عنصر'}
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="text-[10px] text-gray-400 block" style={{ fontFamily: fontCairo }}>{isEn ? 'Width' : 'العرض'}</label>
              <input type="number" value={newBox.w} onChange={e => setNewBox(p => ({ ...p, w: Number(e.target.value) }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center" dir="ltr" />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block" style={{ fontFamily: fontCairo }}>{isEn ? 'Height' : 'الارتفاع'}</label>
              <input type="number" value={newBox.h} onChange={e => setNewBox(p => ({ ...p, h: Number(e.target.value) }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center" dir="ltr" />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block" style={{ fontFamily: fontCairo }}>{isEn ? 'Depth' : 'العمق'}</label>
              <input type="number" value={newBox.d} onChange={e => setNewBox(p => ({ ...p, d: Number(e.target.value) }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center" dir="ltr" />
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap mb-3">
            {COLORS.map(c => (
              <button key={c} onClick={() => setNewBox(p => ({ ...p, color: c }))}
                className={`w-7 h-7 rounded-lg transition-all ${newBox.color === c ? 'ring-2 ring-offset-1 ring-purple-500 scale-110' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>

          <input type="text" value={newBox.label} onChange={e => setNewBox(p => ({ ...p, label: e.target.value }))}
            placeholder={isEn ? 'Label (optional)' : 'تسمية (اختياري)'}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs mb-3"
            style={{ fontFamily: fontCairo }} />

          <button onClick={addBox}
            className="w-full bg-gradient-to-l from-purple-500 to-violet-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg"
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Add to Scene' : 'إضافة للمشهد'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => setShowGrid(g => !g)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${showGrid ? 'bg-gray-200 text-[#1F3D2B]' : 'bg-white border border-gray-200 text-gray-400'}`}
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Grid' : 'شبكة'} {showGrid ? '✓' : ''}
          </button>
          <button onClick={removeLastBox} disabled={boxes.length === 0}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-500 disabled:opacity-30"
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Undo' : 'تراجع'}
          </button>
          <button onClick={clearAll}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-red-500 hover:bg-red-50"
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Clear' : 'مسح'}
          </button>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-700" style={{ fontFamily: fontCairo }}>
          {isEn
            ? `${boxes.length} objects in scene. Use sliders to rotate the view.`
            : `${boxes.length} عنصر في المشهد. استخدم المنزلقات لتدوير المنظور.`}
        </div>
      </div>
    </SimpleToolShell>
  );
}
