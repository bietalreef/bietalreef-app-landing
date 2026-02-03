import React, { useState, useEffect } from 'react';
import { ToolPageLayout } from '../ui/ToolPageLayout';
import { EngineeringToolLayout } from '../ui/EngineeringToolLayout';
import { RoomPlanner2DLogic } from '../special/RoomPlanner2DLogic'; // Import the new Logic
import { RoomBuilder3DLogic } from '../special/RoomBuilder3DLogic'; // Import the 3D Logic
import { TOOLS_CONTENT } from '../data/ToolContent';
import { useTranslation } from '../../../../contexts/LanguageContext';
import { Plus, ArrowRight } from 'lucide-react';

const EMPTY_TOOL_CONTENT = (
  <div className="h-64 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-[20px] bg-gray-50">
    <span className="font-cairo font-bold mb-2">أداة تحت التطوير</span>
    <span className="text-xs">Tool Under Development</span>
  </div>
);

const EMPTY_TEMPLATES: any[] = [];
const EMPTY_SAMPLES: string[] = [];

// --- Standard AI Tool Factory ---
const createStandardTool = (id: string) => {
  return ({ onBack }: { onBack: () => void }) => {
    const { language } = useTranslation();
    const lang = language === 'ar' ? 'ar' : 'en';
    const content = TOOLS_CONTENT[id][lang];

    return (
      <ToolPageLayout
        toolId={id as any}
        content={content}
        onBack={onBack}
        templates={EMPTY_TEMPLATES}
        sampleImages={EMPTY_SAMPLES}
        onUseTemplate={() => {}}
      >
        {EMPTY_TOOL_CONTENT}
      </ToolPageLayout>
    );
  };
};

// --- Hybrid Tool Factory (Generic Engineering) ---
const createHybridTool = (id: string, CustomLogicComponent?: React.ComponentType<{ onBack: () => void }>) => {
  return ({ onBack, onFullscreenToggle }: { onBack: () => void, onFullscreenToggle?: (v: boolean) => void }) => {
    const { language, dir } = useTranslation();
    const lang = language === 'ar' ? 'ar' : 'en';
    const isRTL = dir === 'rtl';
    const content = TOOLS_CONTENT[id][lang];
    
    const [isEditorOpen, setEditorOpen] = useState(false);

    // Handle Fullscreen Toggle Side Effects
    useEffect(() => {
        if (onFullscreenToggle) {
            onFullscreenToggle(isEditorOpen);
        }
        return () => {
            // Cleanup: ensure fullscreen is off when unmounting
            if (onFullscreenToggle) {
                onFullscreenToggle(false);
            }
        };
    }, [isEditorOpen, onFullscreenToggle]);

    const handleOpenEditor = () => {
        setEditorOpen(true);
    };

    const handleCloseEditor = () => {
        setEditorOpen(false);
    };

    // If Editor is active
    if (isEditorOpen) {
      // If a custom logic component exists (like RoomPlanner2DLogic), use it
      if (CustomLogicComponent) {
        return <CustomLogicComponent onBack={handleCloseEditor} />;
      }
      
      // Otherwise use the generic framework
      return (
        <EngineeringToolLayout 
          toolName={content.title} 
          onBack={handleCloseEditor} 
        />
      );
    }

    // Standard Layout (Overview)
    return (
      <ToolPageLayout
        toolId={id as any}
        content={content}
        onBack={onBack}
        templates={EMPTY_TEMPLATES}
        sampleImages={EMPTY_SAMPLES}
        onUseTemplate={handleOpenEditor}
      >
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[24px] border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#007AFF]">
              <Plus className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-bold text-[#1A1A1A] font-cairo mb-2">
             {isRTL ? 'بدء مشروع جديد' : 'Start New Project'}
           </h3>
           <p className="text-gray-500 text-sm font-cairo mb-6 max-w-xs text-center">
             {isRTL 
               ? 'ابدأ بتصميم مساحتك من الصفر باستخدام أدوات هندسية دقيقة' 
               : 'Start designing your space from scratch using precise engineering tools'}
           </p>
           <button 
             onClick={handleOpenEditor}
             className="flex items-center gap-2 bg-[#007AFF] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold font-cairo transition-all shadow-lg shadow-blue-200"
           >
             <span>{isRTL ? 'افتح المحرر' : 'Open Editor'}</span>
             {isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
           </button>
        </div>
      </ToolPageLayout>
    );
  };
};

// --- 1. Engineering Tools (Hybrid) ---
export const RoomPlanner2D = createHybridTool('2d-planner', RoomPlanner2DLogic); // Use the new Logic here
export const RoomBuilder3D = createHybridTool('3d-builder', RoomBuilder3DLogic);
export const PhotoMeasure = createHybridTool('photo-measure');

// --- 2. AI & Standard Tools (Standard) ---
export const SmartFurniture = createStandardTool('smart-furniture');
export const Convert2DTo3D = createStandardTool('2d-to-3d');
export const MaterialTester = createStandardTool('material-tester');
export const StyleDetector = createStandardTool('style-detector');
export const Vendor3D = createStandardTool('vendor-3d');
export const VRWalkthrough = createStandardTool('vr-walkthrough');
export const StoreIntegration = createStandardTool('store-integration');
export const SaveExport = createStandardTool('save-export');
