import { useState, useRef, useEffect, useCallback } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

type ShapeType = 'rect' | 'circle' | 'line' | 'text' | 'wall';
type ToolMode = 'select' | 'draw' | 'erase';

interface Shape2D {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label?: string;
  rotation?: number;
}

const COLORS = ['#2AA676', '#1F3D2B', '#C8A86A', '#D4AF37', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#F59E0B', '#6B7280'];

const PRESETS: { id: string; ar: string; en: string; shapes: Omit<Shape2D, 'id'>[] }[] = [
  {
    id: 'room', ar: 'غرفة فارغة', en: 'Empty Room',
    shapes: [
      { type: 'wall', x: 20, y: 20, w: 260, h: 10, color: '#1F3D2B' },
      { type: 'wall', x: 20, y: 20, w: 10, h: 200, color: '#1F3D2B' },
      { type: 'wall', x: 20, y: 210, w: 260, h: 10, color: '#1F3D2B' },
      { type: 'wall', x: 270, y: 20, w: 10, h: 200, color: '#1F3D2B' },
    ],
  },
  {
    id: 'living', ar: 'غرفة معيشة', en: 'Living Room',
    shapes: [
      { type: 'wall', x: 10, y: 10, w: 280, h: 8, color: '#1F3D2B' },
      { type: 'wall', x: 10, y: 10, w: 8, h: 220, color: '#1F3D2B' },
      { type: 'wall', x: 10, y: 222, w: 280, h: 8, color: '#1F3D2B' },
      { type: 'wall', x: 282, y: 10, w: 8, h: 220, color: '#1F3D2B' },
      { type: 'rect', x: 30, y: 30, w: 100, h: 50, color: '#8B5CF6', label: 'Sofa' },
      { type: 'rect', x: 60, y: 100, w: 40, h: 30, color: '#C8A86A', label: 'Table' },
      { type: 'rect', x: 200, y: 30, w: 60, h: 15, color: '#3B82F6', label: 'TV' },
    ],
  },
  {
    id: 'office', ar: 'مكتب', en: 'Office',
    shapes: [
      { type: 'wall', x: 10, y: 10, w: 280, h: 8, color: '#1F3D2B' },
      { type: 'wall', x: 10, y: 10, w: 8, h: 220, color: '#1F3D2B' },
      { type: 'wall', x: 10, y: 222, w: 280, h: 8, color: '#1F3D2B' },
      { type: 'wall', x: 282, y: 10, w: 8, h: 220, color: '#1F3D2B' },
      { type: 'rect', x: 40, y: 40, w: 80, h: 50, color: '#6B7280', label: 'Desk' },
      { type: 'circle', x: 70, y: 110, w: 30, h: 30, color: '#2AA676', label: 'Chair' },
      { type: 'rect', x: 200, y: 30, w: 60, h: 120, color: '#C8A86A', label: 'Shelf' },
    ],
  },
];

export function Design2DTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape2D[]>([]);
  const [currentColor, setCurrentColor] = useState('#2AA676');
  const [currentShape, setCurrentShape] = useState<ShapeType>('rect');
  const [toolMode, setToolMode] = useState<ToolMode>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gridVisible, setGridVisible] = useState(true);

  const genId = () => `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#FAFAF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    if (gridVisible) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Shapes
    shapes.forEach(shape => {
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = selectedId === shape.id ? '#EF4444' : 'transparent';
      ctx.lineWidth = selectedId === shape.id ? 2 : 0;

      if (shape.type === 'rect' || shape.type === 'wall') {
        ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
        if (selectedId === shape.id) ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.ellipse(shape.x + shape.w / 2, shape.y + shape.h / 2, shape.w / 2, shape.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (selectedId === shape.id) ctx.stroke();
      } else if (shape.type === 'line') {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.w, shape.y + shape.h);
        ctx.stroke();
      }

      // Label
      if (shape.label && shape.type !== 'line') {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(shape.label, shape.x + shape.w / 2, shape.y + shape.h / 2);
      }
    });
  }, [shapes, selectedId, gridVisible]);

  useEffect(() => { drawAll(); }, [drawAll]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);

    if (toolMode === 'select') {
      const clicked = [...shapes].reverse().find(s => pos.x >= s.x && pos.x <= s.x + s.w && pos.y >= s.y && pos.y <= s.y + s.h);
      setSelectedId(clicked?.id || null);
      return;
    }

    if (toolMode === 'erase') {
      const clicked = [...shapes].reverse().find(s => pos.x >= s.x && pos.x <= s.x + s.w && pos.y >= s.y && pos.y <= s.y + s.h);
      if (clicked) setShapes(prev => prev.filter(s => s.id !== clicked.id));
      return;
    }

    setIsDrawing(true);
    setStartPos(pos);
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startPos) { setIsDrawing(false); return; }

    const pos = 'changedTouches' in e
      ? (() => { const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect(); const scX = canvas.width / rect.width; const scY = canvas.height / rect.height; return { x: (e.changedTouches[0].clientX - rect.left) * scX, y: (e.changedTouches[0].clientY - rect.top) * scY }; })()
      : getCanvasPos(e as React.MouseEvent);

    const w = Math.abs(pos.x - startPos.x);
    const h = Math.abs(pos.y - startPos.y);
    if (w < 5 && h < 5) { setIsDrawing(false); setStartPos(null); return; }

    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);

    const newShape: Shape2D = {
      id: genId(),
      type: currentShape,
      x, y,
      w: currentShape === 'line' ? pos.x - startPos.x : w,
      h: currentShape === 'line' ? pos.y - startPos.y : h,
      color: currentColor,
    };

    setShapes(prev => [...prev, newShape]);
    setIsDrawing(false);
    setStartPos(null);
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setShapes(preset.shapes.map(s => ({ ...s, id: genId() })));
    setSelectedId(null);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setShapes(prev => prev.filter(s => s.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearAll = () => { setShapes([]); setSelectedId(null); };

  return (
    <SimpleToolShell
      title={isEn ? '2D Floor Plan Designer' : 'مصمم المخططات ثنائية الأبعاد'}
      subtitle={isEn ? 'Draw rooms, walls & furniture' : 'ارسم الغرف والجدران والأثاث'}
      onBack={onBack}
      icon="✏️"
      gradientFrom="#6366F1"
      gradientTo="#3B82F6"
      backLabel={isEn ? 'Back' : 'رجوع'}
    >
      <div className="space-y-4 p-4" dir="rtl">
        {/* Presets */}
        <div>
          <label className="text-xs font-bold text-[#1F3D2B]/70 mb-2 block" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Quick Templates' : 'قوالب جاهزة'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => loadPreset(p)}
                className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-[#1F3D2B] hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                style={{ fontFamily: fontCairo }}>
                {isEn ? p.en : p.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Mode */}
        <div className="flex gap-2">
          {([
            { id: 'draw' as ToolMode, icon: '✏️', ar: 'رسم', en: 'Draw' },
            { id: 'select' as ToolMode, icon: '👆', ar: 'تحديد', en: 'Select' },
            { id: 'erase' as ToolMode, icon: '🗑️', ar: 'مسح', en: 'Erase' },
          ]).map(m => (
            <button key={m.id} onClick={() => setToolMode(m.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                toolMode === m.id ? 'bg-indigo-500 text-white shadow-md' : 'bg-white border border-gray-200 text-[#1F3D2B]'
              }`} style={{ fontFamily: fontCairo }}>
              <span>{m.icon}</span> {isEn ? m.en : m.ar}
            </button>
          ))}
        </div>

        {/* Shape Type */}
        {toolMode === 'draw' && (
          <div className="flex gap-2">
            {([
              { id: 'rect' as ShapeType, icon: '▪️', ar: 'مستطيل', en: 'Rect' },
              { id: 'circle' as ShapeType, icon: '⚪', ar: 'دائرة', en: 'Circle' },
              { id: 'wall' as ShapeType, icon: '🧱', ar: 'جدار', en: 'Wall' },
              { id: 'line' as ShapeType, icon: '📏', ar: 'خط', en: 'Line' },
            ]).map(s => (
              <button key={s.id} onClick={() => setCurrentShape(s.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  currentShape === s.id ? 'bg-[#2AA676] text-white shadow-md' : 'bg-white border border-gray-200 text-[#1F3D2B]'
                }`} style={{ fontFamily: fontCairo }}>
                <span className="text-sm">{s.icon}</span> {isEn ? s.en : s.ar}
              </button>
            ))}
          </div>
        )}

        {/* Colors */}
        {toolMode === 'draw' && (
          <div className="flex gap-1.5 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => setCurrentColor(c)}
                className={`w-8 h-8 rounded-lg transition-all ${currentColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        )}

        {/* Canvas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            width={300}
            height={240}
            className="w-full touch-none cursor-crosshair"
            style={{ imageRendering: 'crisp-edges' }}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => setGridVisible(v => !v)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${gridVisible ? 'bg-gray-200 text-[#1F3D2B]' : 'bg-white border border-gray-200 text-gray-400'}`}
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Grid' : 'شبكة'} {gridVisible ? '✓' : ''}
          </button>
          {selectedId && (
            <button onClick={deleteSelected}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200"
              style={{ fontFamily: fontCairo }}>
              {isEn ? 'Delete Selected' : 'حذف المحدد'}
            </button>
          )}
          <button onClick={clearAll}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
            style={{ fontFamily: fontCairo }}>
            {isEn ? 'Clear All' : 'مسح الكل'}
          </button>
        </div>

        {/* Info */}
        <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700" style={{ fontFamily: fontCairo }}>
          {isEn
            ? `${shapes.length} shapes on canvas. Draw by dragging on the canvas.`
            : `${shapes.length} عنصر على اللوحة. ارسم بالسحب على الشاشة.`}
        </div>
      </div>
    </SimpleToolShell>
  );
}
