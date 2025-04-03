import React, { useEffect, useState } from 'react';
import { Lock, Eye, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface SecureViewerProps {
  fileUrl: string;
  title: string;
}

const SecureNotesViewer: React.FC<SecureViewerProps> = ({ fileUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [showViewer, setShowViewer] = useState(false);
  const [screenshotAttempted, setScreenshotAttempted] = useState(false);

  useEffect(() => {
    // Add screenshot detection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect print screen or common screenshot key combinations
      if (
        e.key === 'PrintScreen' || 
        (e.ctrlKey && e.key === 'p') || 
        (e.metaKey && e.key === 'p') ||
        (e.ctrlKey && e.shiftKey && e.key === 'p')
      ) {
        e.preventDefault();
        setScreenshotAttempted(true);
        return false;
      }
    };

    // Detect context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleViewNotes = () => {
    setShowViewer(true);
  };

  // Function to extract file extension
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase();
  };

  const extension = getFileExtension(fileUrl);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {screenshotAttempted && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Screenshot attempt detected! Taking screenshots of notes is not allowed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <h3 className="text-lg font-medium text-indigo-900 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-indigo-600" />
          {title}
        </h3>
      </div>

      {!showViewer ? (
        <div className="p-6 flex flex-col items-center justify-center">
          <Lock className="h-12 w-12 text-indigo-400 mb-4" />
          <p className="text-gray-600 mb-4 text-center">
            Notes are available for viewing only. You cannot download or take screenshots of the content.
          </p>
          <button
            onClick={handleViewNotes}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View Notes
          </button>
        </div>
      ) : (
        <div className="p-4 relative">
          <div 
            className="select-none" 
            style={{ 
              userSelect: 'none', 
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            {/* Watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-10">
              <div className="transform rotate-45 text-gray-500 text-2xl font-bold">
                {user?.email || 'StudyNotes'} - View Only
              </div>
            </div>
            
            {/* Secure iframe for PDF viewing */}
            {extension === 'pdf' && (
              <div className="relative w-full h-[70vh] border border-gray-200 rounded">
                <iframe 
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                  className="w-full h-full"
                  style={{ pointerEvents: 'none' }}
                  title="PDF Viewer"
                />
                <div className="absolute inset-0" style={{ pointerEvents: 'none' }}></div>
              </div>
            )}
            
            {/* Image viewer */}
            {['jpg', 'jpeg', 'png', 'gif'].includes(extension || '') && (
              <div className="relative w-full max-h-[70vh] overflow-hidden border border-gray-200 rounded">
                <img 
                  src={fileUrl} 
                  alt={title} 
                  className="w-full object-contain"
                  style={{ 
                    filter: 'blur(0.3px)',
                    pointerEvents: 'none'
                  }}
                />
                <div className="absolute inset-0" style={{ pointerEvents: 'none' }}></div>
              </div>
            )}
            
            {/* For other file types, show a message */}
            {!['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(extension || '') && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700">
                  This file type ({extension}) cannot be previewed securely. Please contact support.
                </p>
              </div>
            )}
          </div>
          
          {/* Anti-copy layer */}
          <div 
            className="absolute inset-0 bg-transparent" 
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          ></div>
        </div>
      )}
      
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          This content is protected. Copying, downloading, or taking screenshots is prohibited.
        </p>
      </div>
    </div>
  );
};

export default SecureNotesViewer;