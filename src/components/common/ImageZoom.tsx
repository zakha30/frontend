
import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailClassName?: string;
}

export const ImageZoom = ({ src, alt, className = '', thumbnailClassName = '' }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      {/* Thumbnail with zoom hint */}
      <div className="group relative cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <img
          src={src}
          alt={alt}
          className={`transition-transform duration-200 group-hover:scale-110 ${thumbnailClassName || className}`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
        <ZoomIn size={14} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white drop-shadow transition-opacity" />
      </div>

      {/* Fullscreen zoom modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsZoomed(false)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              title="Close (Esc)"
            >
              ✕
            </button>
            <p className="text-center text-white text-sm mt-4">Click to close</p>
          </div>
        </div>
      )}
    </>
  );
};