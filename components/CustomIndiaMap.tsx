'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { drawPath, stateCode } from './map-constants';

interface StateData {
  id: string;
  name: string;
  _count: {
    places: number;
    cities: number;
  };
}

const PASTEL_COLORS = [
  '#fecaca', '#fed7aa', '#fef08a', '#d9f99d', '#bbf7d0',
  '#a7f3d0', '#99f6e4', '#a5f3fc', '#bae6fd', '#bfdbfe',
  '#c7d2fe', '#e9d5ff', '#fbcfe8', '#fecdd3', '#fca5a5',
  '#fdba74', '#fcd34d', '#bef264', '#86efac', '#6ee7b7',
  '#5eead4', '#67e8f9', '#7dd3fc', '#93c5fd', '#a5b4fc',
  '#c4b5fd', '#d8b4fe', '#f0abfc', '#f9a8d4', '#fda4af'
];

export default function CustomIndiaMap({ dbStates }: { dbStates: StateData[] }) {
  const router = useRouter();
  
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState<string>('0 0 1000 1000'); // Fallback

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      if (bbox.width > 0 && bbox.height > 0) {
        // Add a bit of padding around the bounding box
        setViewBox(`${bbox.x - 10} ${bbox.y - 10} ${bbox.width + 20} ${bbox.height + 20}`);
      }
    }
  }, []);

  // Pre-assign a random pastel color to each state code based on its index
  const stateColors = useMemo(() => {
    const colors: Record<string, string> = {};
    stateCode.forEach((code, index) => {
      // mix it up a bit rather than sequential
      const colorIndex = (index * 13 + 7) % PASTEL_COLORS.length;
      colors[code] = PASTEL_COLORS[colorIndex];
    });
    return colors;
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (stateNameStr: string) => {
    // Need to match stateNameStr (which is a code or name from the map) to dbStates
    const foundState = dbStates.find(
      (s) => s.name.toLowerCase() === stateNameStr.toLowerCase() || 
             s.name.toLowerCase().includes(stateNameStr.toLowerCase()) ||
             stateNameStr.toLowerCase().includes(s.name.toLowerCase())
    );

    if (foundState) {
      router.push(`/states/${foundState.id}`);
    } else {
      alert(`No destinations found in ${stateNameStr} yet!`);
    }
  };

  // Find the hovered dbState for the tooltip stats
  const hoveredDbState = useMemo(() => {
    if (!hoveredStateCode) return null;
    return dbStates.find(
      (s) => s.name.toLowerCase() === hoveredStateCode.toLowerCase() || 
             s.name.toLowerCase().includes(hoveredStateCode.toLowerCase()) ||
             hoveredStateCode.toLowerCase().includes(s.name.toLowerCase())
    );
  }, [hoveredStateCode, dbStates]);

  return (
    <div 
      style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
      <div style={{ maxWidth: '600px', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem', backgroundColor: 'var(--bg-card)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'violet' }}>Interactive Map</h3>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>Click on any state to explore destinations</p>
        
        <svg 
          ref={svgRef}
          version="1.1" 
          x="0px" 
          y="0px" 
          viewBox={viewBox} 
          style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))' }}
        >
          {stateCode.map((code) => {
            const isHovered = hoveredStateCode === code;
            return (
              <path
                key={code}
                d={drawPath[code as keyof typeof drawPath]}
                fill={isHovered ? 'var(--primary)' : stateColors[code]}
                stroke={isHovered ? 'white' : 'rgba(255,255,255,0.6)'}
                strokeWidth={isHovered ? "2" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={() => setHoveredStateCode(code)}
                onMouseLeave={() => setHoveredStateCode(null)}
                onClick={() => handleClick(code)}
              />
            );
          })}
        </svg>
      </div>

      {/* Custom Tooltip */}
      {hoveredStateCode && (
        <div style={{
          position: 'fixed',
          top: mousePos.y + 15,
          left: mousePos.x + 15,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none',
          zIndex: 1000,
          minWidth: '150px'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'violet', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {hoveredDbState ? hoveredDbState.name : hoveredStateCode}
          </h4>
          {hoveredDbState ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Places:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{hoveredDbState._count.places}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cities:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{hoveredDbState._count.cities}</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No data available</div>
          )}
        </div>
      )}
    </div>
  );
}
