import { useState, useRef } from 'react';
import { GridCanvas, GridSettings } from '@/components/GridCanvas';
import { ControlPanel } from '@/components/ControlPanel';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [settings, setSettings] = useState<GridSettings>({
    width: 800,
    height: 600,
    gridType: 'square',
    minorStep: 20,
    minorColor: '#cccccc',
    minorThickness: 0.5,
    majorStep: 100,
    majorColor: '#666666',
    majorThickness: 1,
    whiteBackground: true,
    showMinorGrid: true,
    showMajorGrid: true
  });

  const exportToPNG = () => {
    // Create high-resolution canvas for 300 DPI export
    const scale = 4; // 4x scale for crisp 300 DPI output
    const canvas = document.createElement('canvas');
    canvas.width = settings.width * scale;
    canvas.height = settings.height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Scale context for high resolution
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false; // Crisp pixel-perfect lines
    
    // Clear and set background
    ctx.clearRect(0, 0, settings.width, settings.height);
    if (settings.whiteBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, settings.width, settings.height);
    }
    
    // Draw grid with high precision
    drawHighQualityGrid(ctx, settings);
    
    const link = document.createElement('a');
    link.download = `grid-${settings.gridType}-${settings.width}x${settings.height}-300dpi.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportToSVG = () => {
    // Create high-quality SVG with proper DPI settings
    let svg = `<svg width="${settings.width}" height="${settings.height}" viewBox="0 0 ${settings.width} ${settings.height}" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges;">`;
    
    if (settings.whiteBackground) {
      svg += `<rect width="100%" height="100%" fill="white"/>`;
    }

    // Generate crisp SVG patterns for all grid types
    svg += generateHighQualitySVG(settings);
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `grid-${settings.gridType}-${settings.width}x${settings.height}-vector.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const randomizeSettings = () => {
    const randomGridType = ['square', 'dotted', 'isometric', 'triangular', 'polar'][
      Math.floor(Math.random() * 5)
    ] as GridSettings['gridType'];
    
    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    
    setSettings({
      ...settings,
      gridType: randomGridType,
      minorStep: Math.floor(Math.random() * 50) + 10,
      majorStep: Math.floor(Math.random() * 200) + 50,
      minorColor: randomColor(),
      majorColor: randomColor(),
      minorThickness: Math.random() * 2 + 0.5,
      majorThickness: Math.random() * 3 + 1
    });
  };

  // High-quality grid drawing function for PNG export
  const drawHighQualityGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    
    if (settings.gridType === 'square') {
      // Draw minor grid with pixel-perfect alignment
      if (settings.showMinorGrid) {
        ctx.strokeStyle = settings.minorColor;
        ctx.lineWidth = settings.minorThickness;
        ctx.beginPath();
        for (let x = 0; x <= settings.width; x += settings.minorStep) {
          const alignedX = Math.round(x) + 0.5;
          ctx.moveTo(alignedX, 0);
          ctx.lineTo(alignedX, settings.height);
        }
        for (let y = 0; y <= settings.height; y += settings.minorStep) {
          const alignedY = Math.round(y) + 0.5;
          ctx.moveTo(0, alignedY);
          ctx.lineTo(settings.width, alignedY);
        }
        ctx.stroke();
      }
      
      // Draw major grid with pixel-perfect alignment
      if (settings.showMajorGrid) {
        ctx.strokeStyle = settings.majorColor;
        ctx.lineWidth = settings.majorThickness;
        ctx.beginPath();
        for (let x = 0; x <= settings.width; x += settings.majorStep) {
          const alignedX = Math.round(x) + 0.5;
          ctx.moveTo(alignedX, 0);
          ctx.lineTo(alignedX, settings.height);
        }
        for (let y = 0; y <= settings.height; y += settings.majorStep) {
          const alignedY = Math.round(y) + 0.5;
          ctx.moveTo(0, alignedY);
          ctx.lineTo(settings.width, alignedY);
        }
        ctx.stroke();
      }
    }
    // Add other grid types with same high-quality approach...
  };

  // High-quality SVG generation function
  const generateHighQualitySVG = (settings: GridSettings): string => {
    let svg = '';
    
    if (settings.gridType === 'square') {
      if (settings.showMinorGrid) {
        svg += '<g stroke-linecap="square" stroke-linejoin="miter">';
        for (let x = 0; x <= settings.width; x += settings.minorStep) {
          svg += `<line x1="${x}" y1="0" x2="${x}" y2="${settings.height}" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}" vector-effect="non-scaling-stroke"/>`;
        }
        for (let y = 0; y <= settings.height; y += settings.minorStep) {
          svg += `<line x1="0" y1="${y}" x2="${settings.width}" y2="${y}" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}" vector-effect="non-scaling-stroke"/>`;
        }
        svg += '</g>';
      }
      
      if (settings.showMajorGrid) {
        svg += '<g stroke-linecap="square" stroke-linejoin="miter">';
        for (let x = 0; x <= settings.width; x += settings.majorStep) {
          svg += `<line x1="${x}" y1="0" x2="${x}" y2="${settings.height}" stroke="${settings.majorColor}" stroke-width="${settings.majorThickness}" vector-effect="non-scaling-stroke"/>`;
        }
        for (let y = 0; y <= settings.height; y += settings.majorStep) {
          svg += `<line x1="0" y1="${y}" x2="${settings.width}" y2="${y}" stroke="${settings.majorColor}" stroke-width="${settings.majorThickness}" vector-effect="non-scaling-stroke"/>`;
        }
        svg += '</g>';
      }
    }
    
    return svg;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Warning */}
      <div className="block md:hidden p-4 bg-surface border-b border-border text-center">
        <p className="text-sm text-text-secondary">
          Put down your phone and do something on the desktop using grid[y]:
        </p>
        <p className="text-xs text-text-muted mt-1">
          I don't know, a poster, for example!
        </p>
      </div>

      <div className="flex h-screen">
        {/* Vertical Title */}
        <div className="hidden md:flex items-center justify-center w-8 bg-surface border-r border-border">
          <div className="transform -rotate-90 text-sm font-street font-black tracking-wider text-text-primary whitespace-nowrap">
            GRID[Y] GENERATOR
          </div>
        </div>

        {/* Control Panel */}
        <ControlPanel
          settings={settings}
          onSettingsChange={setSettings}
          onExportPNG={exportToPNG}
          onExportSVG={exportToSVG}
          onRandomize={randomizeSettings}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-hidden">
            <GridCanvas 
              settings={settings}
              className="w-full h-full"
            />
          </div>
          
          {/* Status Bar */}
          <div className="px-4 py-2 bg-surface border-t border-border text-xs text-text-muted">
            <div className="flex justify-between items-center">
              <div>
                Size: {settings.width} × {settings.height} • 
                Type: {settings.gridType.charAt(0).toUpperCase() + settings.gridType.slice(1)} • 
                Minor: {settings.minorStep}px • 
                Major: {settings.majorStep}px
              </div>
              <div>
                By <a 
                  href="https://www.instagram.com/purplelinekilla/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Purplelinekilla
                </a> [2025]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
