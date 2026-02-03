import { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  height?: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, height = 'h-64' }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${height} rounded-[24px] overflow-hidden cursor-col-resize select-none shadow-[0_10px_30px_rgba(0,0,0,0.1)]`}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <ImageWithFallback 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold font-cairo z-10">
        بعد (After)
      </span>

      {/* Before Image (Foreground with Clip Path) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <ImageWithFallback 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
         <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold font-cairo z-10">
          قبل (Before)
        </span>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-20 flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100 transform hover:scale-110 transition-transform">
          <MoveHorizontal className="w-5 h-5 text-[#1A1A1A]" />
        </div>
      </div>
    </div>
  );
}
