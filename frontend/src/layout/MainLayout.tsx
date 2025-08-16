import AudioPlayer from '../components/AudioPlayer.tsx';
import FriendsActivity from '../components/FriendsActivity.tsx';
import LeftSidebar from '../components/LeftSidebar.tsx';
import React, { useState, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';

interface ResizeHandleProps {
  onResize: (deltaX: number) => void;
  className?: string;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX.current;
    onResize(deltaX);
    startX.current = e.clientX;
  }, [isDragging, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize transition-colors duration-200 ${className} ${
        isDragging ? 'bg-blue-500' : ''
      }`}
      onMouseDown={handleMouseDown}
    />
  );
};

const MainLayout: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(25); // 20% initial
  const [rightWidth, setRightWidth] = useState(25); // 25% initial
  
  const minWidth = 10; // Minimum 10% for any panel
  const maxWidth = 45; // Maximum 45% for side panels

  const handleLeftResize = useCallback((deltaX: number) => {
    const containerWidth = window.innerWidth;
    const deltaPercent = (deltaX / containerWidth) * 100;
    
    setLeftWidth(prev => {
      const newWidth = Math.max(minWidth, Math.min(maxWidth, prev + deltaPercent));
      return newWidth;
    });
  }, []);

  const handleRightResize = useCallback((deltaX: number) => {
    const containerWidth = window.innerWidth;
    const deltaPercent = (deltaX / containerWidth) * 100;
    
    setRightWidth(prev => {
      const newWidth = Math.max(minWidth, Math.min(maxWidth, prev - deltaPercent));
      return newWidth;
    });
  }, []);

  const middleWidth = 100 - leftWidth - rightWidth;

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Panel */}
      <div 
        className="bg-gray-800 text-white flex flex-col"
        style={{ width: `${leftWidth}%` }}
      >
        <AudioPlayer/>
        <div className="border-b border-gray-700">
          <LeftSidebar/>
        </div>
      </div>

      {/* Left Resize Handle */}
      <ResizeHandle onResize={handleLeftResize} />

      {/* Middle Panel (Main Content) */}
      <div 
        className="bg-white flex flex-col min-w-0"
        style={{ width: `${middleWidth}%` }}
      >
        <div className="flex-1 overflow-auto">
          {/* This is where the Outlet renders */}
          <div className="min-w-0">
            <Outlet />
        </div>
      </div>
      </div>

      {/* Right Resize Handle */}
      <ResizeHandle onResize={handleRightResize} />

      {/* Right Panel */}
      <div 
        className="bg-gray-50 border-l border-gray-200 flex flex-col"
        style={{ width: `${rightWidth}%` }}
      >
      <FriendsActivity/>
      </div>
    </div>
  );
};

export default MainLayout;