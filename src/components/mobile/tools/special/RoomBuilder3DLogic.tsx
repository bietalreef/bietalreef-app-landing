import React, { useState, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

const RoomPlanner3D = React.lazy(() => import('./RoomPlanner3D').then(module => ({ default: module.RoomPlanner3D })));


// --- Default Data for New Project ---
const DEFAULT_NODES = [
    { id: 'n1', x: 100, y: 100 },
    { id: 'n2', x: 500, y: 100 },
    { id: 'n3', x: 500, y: 400 },
    { id: 'n4', x: 100, y: 400 },
];

const DEFAULT_WALLS = [
    { id: 'w1', startNodeId: 'n1', endNodeId: 'n2', thickness: 20, height: 280 },
    { id: 'w2', startNodeId: 'n2', endNodeId: 'n3', thickness: 20, height: 280 },
    { id: 'w3', startNodeId: 'n3', endNodeId: 'n4', thickness: 20, height: 280 },
    { id: 'w4', startNodeId: 'n4', endNodeId: 'n1', thickness: 20, height: 280 },
];

const DEFAULT_OBJECTS = [
    { id: 'd1', type: 'DOOR', wallId: 'w1', t: 0.5, width: 100, height: 210, leafCount: 1 },
    { id: 'wi1', type: 'WINDOW', wallId: 'w2', t: 0.5, width: 120, height: 120, sillHeight: 90 },
] as any[];

// Mock Furniture Catalog
const FURNITURE_CATALOG = [
    { id: 'chair_1', name: 'كرسي مودرن', type: 'chair', width: 0.5, depth: 0.5, height: 0.8, color: '#ef4444' },
    { id: 'table_1', name: 'طاولة طعام', type: 'table', width: 1.2, depth: 0.8, height: 0.75, color: '#3b82f6' },
    { id: 'sofa_1', name: 'كنبة مريحة', type: 'sofa', width: 2.0, depth: 0.9, height: 0.85, color: '#10b981' },
    { id: 'plant_1', name: 'نبتة زينة', type: 'decor', width: 0.4, depth: 0.4, height: 1.2, color: '#22c55e' },
];

export function RoomBuilder3DLogic({ onBack }: { onBack: () => void }) {
    // State for the 3D Room
    // In the future, this will be fully editable.
    const [nodes, setNodes] = useState(DEFAULT_NODES);
    const [walls, setWalls] = useState(DEFAULT_WALLS);
    const [objects, setObjects] = useState(DEFAULT_OBJECTS);
    const [furniture, setFurniture] = useState<any[]>([]);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    const handleAddFurniture = (item: any) => {
        const newFurniture = {
            id: `f_${Date.now()}`,
            catalogId: item.id,
            name: item.name,
            width: item.width,
            depth: item.depth,
            height: item.height,
            color: item.color,
            position: [2.5, 0, 2.5], // Default center (approx)
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        };
        setFurniture([...furniture, newFurniture]);
        setIsCatalogOpen(false);
    };

    const handleUpdateFurniture = (id: string, newData: any) => {
        setFurniture(prev => prev.map(f => f.id === id ? { ...f, ...newData } : f));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 relative">
             {/* We reuse the RoomPlanner3D component but we render it directly as the main page content.
                 RoomPlanner3D currently has a "fixed inset-0" layout which is good for full screen.
                 We just need to make sure it handles the 'onClose' correctly.
             */}
             <Suspense fallback={<div className="flex items-center justify-center h-full">جاري تحميل بيئة التصميم...</div>}>
                <RoomPlanner3D 
                    nodes={nodes} 
                    walls={walls} 
                    objects={objects}
                    furniture={furniture}
                    onFurnitureUpdate={handleUpdateFurniture}
                    onClose={onBack} 
                />
             </Suspense>

             {/* Floating Action Button for Catalog */}
             <div className="fixed bottom-8 right-4 z-[70]">
                <button 
                    onClick={() => setIsCatalogOpen(true)}
                    className="bg-black text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 font-bold"
                >
                    <span>+</span>
                    <span>أثاث</span>
                </button>
             </div>

             {/* Catalog Drawer */}
             {isCatalogOpen && (
                 <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/20 backdrop-blur-sm" onClick={() => setIsCatalogOpen(false)}>
                     <div className="bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-lg">اختر قطعة أثاث</h3>
                             <button onClick={() => setIsCatalogOpen(false)} className="p-2 bg-gray-100 rounded-full">✕</button>
                         </div>
                         <div className="grid grid-cols-4 gap-4">
                             {FURNITURE_CATALOG.map(item => (
                                 <button 
                                    key={item.id}
                                    onClick={() => handleAddFurniture(item)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                 >
                                     <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: item.color }}></div>
                                     <span className="text-xs font-medium text-center">{item.name}</span>
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
}
