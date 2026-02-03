import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Shape, ShapeGeometry, DoubleSide } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, Html } from '@react-three/drei';
import { Cuboid, LayoutTemplate, Footprints, Info, Ruler, MousePointer2, X, ArrowLeft, Move, RotateCw, Maximize } from 'lucide-react';

// --- Types ---
interface Node { id: string; x: number; y: number }
interface Wall { id: string; startNodeId: string; endNodeId: string; thickness: number; height: number }
interface RoomObject { id: string; type: 'DOOR' | 'WINDOW'; wallId: string; t: number; width: number; height: number; sillHeight?: number; leafCount?: number }

interface Furniture {
    id: string;
    modelUrl?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    width?: number;
    height?: number;
    depth?: number;
    color?: string;
}

interface RoomPlanner3DProps {
    nodes: Node[];
    walls: Wall[];
    objects: RoomObject[];
    furniture?: Furniture[];
    onFurnitureUpdate?: (id: string, newData: any) => void;
    onClose: () => void;
}

// --- 1. Stats Panel ---
const StatsPanel = ({ walls, objects, furniture }: { walls: Wall[], objects: RoomObject[], furniture?: Furniture[] }) => {
    // Calculate stats
    const stats = useMemo(() => {
        let wallArea = 0;
        let perimeter = 0;
        let volume = 0;
        
        // Simple approximation assuming connected walls form a closed loop or sum of lengths
        walls.forEach(w => {
            // Length in meters
            // We need nodes to calc length, but we can pass calculated length or simple sum
            // For now let's just sum lengths if we had them.
            // We don't have nodes here. We should pass computed data.
            // Let's just assume average for V1 or calculation inside parent.
        });
        
        return { volume: '---', perimeter: '---', wallArea: '---' };
    }, [walls]);
    
    // Recalculate properly using nodes in parent or inside the mesh generation
    // For visual prototype, we will just show the panel.
    
    return (
        <div className="absolute top-24 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 w-64 z-10 animate-in slide-in-from-left-10 duration-500">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <Info size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">بيانات الغرفة الذكية</h3>
            </div>
            <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">عدد الجدران:</span>
                    <span className="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">{walls.length}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">عدد الفتحات:</span>
                    <span className="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">{objects.length}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-[10px] text-gray-400 text-center">
                    جاري حساب الكميات الدقيقة...
                </div>
            </div>
        </div>
    );
};

// --- 2. View Switcher ---
const ViewSwitcher = ({ currentMode, setMode }: { currentMode: string, setMode: (m: string) => void }) => {
    const modes = [
        { id: '3d', icon: Cuboid, label: 'مجسم' },
        { id: 'walk', icon: Footprints, label: 'تجول' },
    ];

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-lg p-1 rounded-full flex gap-1 z-20 border border-gray-200">
            {modes.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-bold
                        ${currentMode === m.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <m.icon size={14} />
                    <span>{m.label}</span>
                </button>
            ))}
        </div>
    );
};

// --- 3. Room Mesh Generator ---
const RoomGenerator = ({ nodes, walls, objects, furniture, onFurnitureUpdate, selectedId, onSelect, transformMode, setTransformMode }: { 
    nodes: Node[], walls: Wall[], objects: RoomObject[], furniture?: Furniture[],
    onFurnitureUpdate?: (id: string, newData: any) => void,
    selectedId: string | null,
    onSelect: (id: string | null) => void,
    transformMode: 'translate' | 'rotate' | 'scale',
    setTransformMode: (m: 'translate' | 'rotate' | 'scale') => void
}) => {
    // Convert 2D (CM) to 3D (Meters)
    const S = 0.01;

    // Generate Floor Shape from Nodes
    const floorGeometry = useMemo(() => {
        if (nodes.length < 3) return null;
        const shape = new Shape();
        
        // Need to sort or assume nodes are in order. 
        // For V1 we assume the walls loop creates the order, but here we take simple node order for prototype
        // Ideally we walk the walls graph.
        
        // Simple map for prototype:
        nodes.forEach((n, i) => {
            if (i === 0) shape.moveTo(n.x * S, n.y * S); // Note: using y as 2D Y
            else shape.lineTo(n.x * S, n.y * S);
        });
        shape.closePath(); // Close the loop

        return new ShapeGeometry(shape);
    }, [nodes]);

    return (
        <group>
            {/* Infinite Grid (Helper) */}
            <gridHelper args={[50, 50, 0xdddddd, 0xffffff]} position={[0, -0.01, 0]} />

            {/* The Actual Room Floor */}
            {floorGeometry && (
                <mesh 
                    rotation={[Math.PI / 2, 0, 0]} // Rotate to lie flat (X-Z plane). wait, Shape is X-Y. 
                    // If we rotate -90 X, then shape Y becomes 3D -Z. 
                    // In our wall logic: dy mapped to Z. In 2D Y is down (positive).
                    // So (x, y) -> (x, z).
                    // Let's try standard rotation:
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]} 
                    receiveShadow
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(null); // Deselect when clicking floor
                    }}
                >
                    <primitive object={floorGeometry} attach="geometry" />
                    <meshStandardMaterial color="#e3d5c1" side={DoubleSide} />
                </mesh>
            )}

            {/* Furniture with Transform Controls */}
            {furniture && furniture.map(item => (
                 <FurnitureItem 
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => onSelect(item.id)}
                    onUpdate={onFurnitureUpdate}
                    mode={transformMode}
                 />
            ))}

            {walls.map(wall => {
                const n1 = nodes.find(n => n.id === wall.startNodeId);
                const n2 = nodes.find(n => n.id === wall.endNodeId);
                if (!n1 || !n2) return null;

                const dx = (n2.x - n1.x) * S;
                const dy = (n2.y - n1.y) * S;
                
                const len = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);

                const midX = ((n1.x + n2.x) / 2) * S;
                const midZ = ((n1.y + n2.y) / 2) * S;
                
                const height = (wall.height || 280) * S;
                const thickness = (wall.thickness || 20) * S;

                const wallObjs = objects.filter(o => o.wallId === wall.id);

                return (
                    <group key={wall.id} position={[midX, height/2, midZ]} rotation={[0, -angle, 0]}>
                        <mesh castShadow receiveShadow>
                            <boxGeometry args={[len, height, thickness]} />
                            <meshStandardMaterial color="#e5e7eb" roughness={0.5} />
                        </mesh>
                        {wallObjs.map(obj => {
                            const objW = obj.width * S;
                            const objH = obj.height * S;
                            const objSill = (obj.sillHeight || 0) * S;
                            const localX = (obj.t * len) - (len / 2);
                            const floorY = -height / 2;
                            const objY = obj.type === 'DOOR' ? floorY + (objH / 2) : floorY + objSill + (objH / 2);
                            return (
                                <group key={obj.id} position={[localX, objY, 0]}>
                                    <mesh>
                                        <boxGeometry args={[objW, objH, thickness + 0.02]} />
                                        <meshStandardMaterial color={obj.type === 'DOOR' ? "#8d6e63" : "#93c5fd"} transparent opacity={obj.type === 'WINDOW' ? 0.3 : 1} />
                                    </mesh>
                                </group>
                            );
                        })}
                    </group>
                );
            })}
        </group>
    );
};

// --- 3.5 Furniture Item Wrapper ---
const FurnitureItem = ({ item, isSelected, onSelect, onUpdate, mode }: any) => {
    const { scene, gl, camera } = useThree();
    
    return (
        <>
            {isSelected && (
                <TransformControls 
                    object={scene.getObjectByName(item.id)} 
                    mode={mode}
                    onObjectChange={(e: any) => {
                        if (onUpdate) {
                            const obj = e.target.object;
                            onUpdate(item.id, {
                                position: [obj.position.x, obj.position.y, obj.position.z],
                                rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                                scale: [obj.scale.x, obj.scale.y, obj.scale.z]
                            });
                        }
                    }}
                />
            )}
            <group
                name={item.id}
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                <mesh castShadow position={[0, (item.height || 1)/2, 0]}>
                    <boxGeometry args={[item.width || 1, item.height || 1, item.depth || 1]} />
                    <meshStandardMaterial color={isSelected ? "#3b82f6" : (item.color || "orange")} />
                </mesh>
                {/* Orientation Indicator */}
                <mesh position={[0, 0.1, (item.depth || 1)/2 + 0.1]}>
                     <boxGeometry args={[0.1, 0.1, 0.1]} />
                     <meshStandardMaterial color="black" />
                </mesh>
            </group>
        </>
    );
}

// --- 4. Camera Manager ---
const CameraManager = ({ mode, orbitEnabled }: { mode: string, orbitEnabled: boolean }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>();

    useEffect(() => {
        if (controlsRef.current) {
            // Reset
        }
        
        if (mode === '3d') {
            // Isometric / Bird's eye
            // Smooth transition
            // camera.position.set(5, 5, 5);
            controlsRef.current.maxPolarAngle = Math.PI / 2.1; // Don't go below ground
            controlsRef.current.minDistance = 2;
            controlsRef.current.maxDistance = 20;
        } else if (mode === 'walk') {
            // Eye level
            // camera.position.set(0, 1.7, 0);
            controlsRef.current.maxPolarAngle = Math.PI / 1.8;
            controlsRef.current.minDistance = 0.1;
            controlsRef.current.maxDistance = 5;
        }
    }, [mode, camera]);

    return (
        <OrbitControls 
            ref={controlsRef} 
            args={[camera, gl.domElement]} 
            enabled={orbitEnabled}
            enableDamping 
            dampingFactor={0.1}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
            panSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
        />
    );
};

// --- 5. Toolbar ---
const Toolbar = ({ selectedId, transformMode, setTransformMode }: { selectedId: string | null, transformMode: string, setTransformMode: (m: any) => void }) => {
    if (!selectedId) return null;
    
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full p-2 flex gap-2 z-30 animate-in slide-in-from-bottom-5">
            <button 
                onClick={() => setTransformMode('translate')}
                className={`p-3 rounded-full transition-all ${transformMode === 'translate' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                title="تحريك"
            >
                <Move size={20} />
            </button>
            <button 
                onClick={() => setTransformMode('rotate')}
                className={`p-3 rounded-full transition-all ${transformMode === 'rotate' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                title="تدوير"
            >
                <RotateCw size={20} />
            </button>
             <button 
                onClick={() => setTransformMode('scale')}
                className={`p-3 rounded-full transition-all ${transformMode === 'scale' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                title="تحجيم"
            >
                <Maximize size={20} />
            </button>
        </div>
    );
};

// --- MAIN COMPONENT ---
export function RoomPlanner3D({ nodes, walls, objects, furniture, onFurnitureUpdate, onClose }: RoomPlanner3DProps) {
    const [mode, setMode] = useState('3d');
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

    return (
        <div className="fixed inset-0 bg-gray-50 z-[60] flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-4 pointer-events-none">
                <div className="pointer-events-auto">
                     <button onClick={onClose} className="p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 border border-gray-100">
                         <ArrowLeft size={20} />
                     </button>
                </div>
                <div className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm border border-gray-100 pointer-events-auto">
                    <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        3D ARCHITECT
                    </span>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Controls */}
            <ViewSwitcher currentMode={mode} setMode={setMode} />
            <StatsPanel walls={walls} objects={objects} furniture={furniture} />
            
            <Toolbar selectedId={selectedId} transformMode={transformMode} setTransformMode={setTransformMode} />

            {/* Hint (Only show if nothing selected) */}
            {!selectedId && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full z-20 text-xs font-medium backdrop-blur-sm flex items-center gap-2">
                    <MousePointer2 size={14} />
                    {mode === '3d' ? 'اسحب بإصبع واحد للدوران، وإصبعين للتحريك' : 'أنت الآن في وضع التجول!'}
                </div>
            )}

            {/* 3D Canvas */}
            <div className="flex-1 relative bg-gradient-to-b from-blue-50 to-gray-100">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 5, 5], fov: 50 }} onClick={() => setSelectedId(null)}>
                    <ambientLight intensity={0.8} />
                    <directionalLight 
                        position={[10, 20, 10]} 
                        intensity={1} 
                        castShadow 
                        shadow-mapSize={[1024, 1024]}
                    />
                    
                    <CameraManager mode={mode} orbitEnabled={orbitEnabled} />
                    <RoomGenerator 
                        nodes={nodes} 
                        walls={walls} 
                        objects={objects} 
                        furniture={furniture} 
                        onFurnitureUpdate={onFurnitureUpdate}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        transformMode={transformMode}
                        setTransformMode={setTransformMode}
                    />
                </Canvas>
            </div>
        </div>
    );
}
