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
    // Get the current canvas and copy its content
    const currentCanvas = document.querySelector('canvas');
    if (!currentCanvas) return;
    
    // Create high-resolution canvas for 300 DPI export
    const scale = 4; // 4x scale for crisp 300 DPI output
    const canvas = document.createElement('canvas');
    canvas.width = settings.width * scale;
    canvas.height = settings.height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Scale context for high resolution and disable smoothing for crisp lines
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    
    // Clear and set background
    ctx.clearRect(0, 0, settings.width, settings.height);
    if (settings.whiteBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, settings.width, settings.height);
    }
    
    // Draw the grid using the same logic as GridCanvas
    drawGridOnCanvas(ctx, settings);
    
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

    // Generate SVG for all grid types
    svg += generateSVGForAllGridTypes(settings);
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

  // Universal grid drawing function that handles all grid types
  const drawGridOnCanvas = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    switch (settings.gridType) {
      case 'square':
        drawSquareGrid(ctx, settings);
        break;
      case 'dotted':
        drawDottedGrid(ctx, settings);
        break;
      case 'isometric':
        drawIsometricGrid(ctx, settings);
        break;
      case 'triangular':
        drawTriangularGrid(ctx, settings);
        break;
      case 'polar':
        drawPolarGrid(ctx, settings);
        break;
      case 'logarithmic':
        drawLogarithmicGrid(ctx, settings);
        break;
      case 'modular':
        drawModularGrid(ctx, settings);
        break;
    }
  };

  // Grid drawing functions (same as in GridCanvas)
  const drawSquareGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    if (settings.showMinorGrid) {
      ctx.strokeStyle = settings.minorColor;
      ctx.lineWidth = settings.minorThickness;
      ctx.beginPath();
      for (let x = 0; x <= settings.width; x += settings.minorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, settings.height);
      }
      for (let y = 0; y <= settings.height; y += settings.minorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(settings.width, y);
      }
      ctx.stroke();
    }

    if (settings.showMajorGrid) {
      ctx.strokeStyle = settings.majorColor;
      ctx.lineWidth = settings.majorThickness;
      ctx.beginPath();
      for (let x = 0; x <= settings.width; x += settings.majorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, settings.height);
      }
      for (let y = 0; y <= settings.height; y += settings.majorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(settings.width, y);
      }
      ctx.stroke();
    }
  };

  const drawDottedGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    if (settings.showMinorGrid) {
      ctx.fillStyle = settings.minorColor;
      for (let x = 0; x <= settings.width; x += settings.minorStep) {
        for (let y = 0; y <= settings.height; y += settings.minorStep) {
          ctx.beginPath();
          ctx.arc(x, y, settings.minorThickness, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    if (settings.showMajorGrid) {
      ctx.fillStyle = settings.majorColor;
      for (let x = 0; x <= settings.width; x += settings.majorStep) {
        for (let y = 0; y <= settings.height; y += settings.majorStep) {
          ctx.beginPath();
          ctx.arc(x, y, settings.majorThickness, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };

  const drawIsometricGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    ctx.strokeStyle = settings.minorColor;
    ctx.lineWidth = settings.minorThickness;
    ctx.beginPath();

    const step = settings.minorStep;
    const height = Math.sqrt(3) / 2 * step;

    for (let y = 0; y <= settings.height + height; y += height) {
      ctx.moveTo(0, y);
      ctx.lineTo(settings.width, y);
    }

    for (let x = 0; x <= settings.width; x += step) {
      for (let y = -settings.height; y <= settings.height * 2; y += height * 2) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + settings.width, y + settings.height);
        ctx.moveTo(x, y);
        ctx.lineTo(x - settings.width, y + settings.height);
      }
    }

    ctx.stroke();
  };

  const drawTriangularGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    ctx.strokeStyle = settings.minorColor;
    ctx.lineWidth = settings.minorThickness;
    ctx.beginPath();

    const step = settings.minorStep;
    const height = Math.sqrt(3) / 2 * step;

    for (let row = 0; row * height <= settings.height; row++) {
      const y = row * height;
      const offset = (row % 2) * (step / 2);
      
      for (let col = 0; col * step - offset <= settings.width; col++) {
        const x = col * step - offset;
        
        if (x >= 0 && x <= settings.width) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + step/2, y + height);
          ctx.lineTo(x - step/2, y + height);
          ctx.lineTo(x, y);
        }
      }
    }

    ctx.stroke();
  };

  const drawPolarGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    const centerX = settings.width / 2;
    const centerY = settings.height / 2;
    const maxRadius = Math.min(centerX, centerY);

    ctx.strokeStyle = settings.minorColor;
    ctx.lineWidth = settings.minorThickness;

    // Circular lines
    for (let r = settings.minorStep; r <= maxRadius; r += settings.minorStep) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Radial lines
    const angleStep = (2 * Math.PI) / (360 / settings.minorStep);
    for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + maxRadius * Math.cos(angle),
        centerY + maxRadius * Math.sin(angle)
      );
      ctx.stroke();
    }
  };

  const drawLogarithmicGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    ctx.strokeStyle = settings.minorColor;
    ctx.lineWidth = settings.minorThickness;
    ctx.beginPath();

    for (let decade = 1; decade <= settings.width; decade *= 10) {
      for (let i = 1; i <= 9; i++) {
        const x = Math.log10(decade * i) * (settings.width / Math.log10(settings.width));
        if (x <= settings.width) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, settings.height);
        }
      }
    }

    for (let decade = 1; decade <= settings.height; decade *= 10) {
      for (let i = 1; i <= 9; i++) {
        const y = Math.log10(decade * i) * (settings.height / Math.log10(settings.height));
        if (y <= settings.height) {
          ctx.moveTo(0, y);
          ctx.lineTo(settings.width, y);
        }
      }
    }

    ctx.stroke();
  };

  const drawModularGrid = (ctx: CanvasRenderingContext2D, settings: GridSettings) => {
    const moduleSize = settings.majorStep;
    
    ctx.strokeStyle = settings.majorColor;
    ctx.lineWidth = settings.majorThickness;
    ctx.beginPath();

    for (let x = 0; x <= settings.width; x += moduleSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, settings.height);
    }

    for (let y = 0; y <= settings.height; y += moduleSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(settings.width, y);
    }

    ctx.stroke();

    if (settings.showMinorGrid) {
      const divisions = Math.floor(moduleSize / settings.minorStep);
      const divisionSize = moduleSize / divisions;
      
      ctx.strokeStyle = settings.minorColor;
      ctx.lineWidth = settings.minorThickness;
      ctx.beginPath();

      for (let x = 0; x <= settings.width; x += divisionSize) {
        if (x % moduleSize !== 0) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, settings.height);
        }
      }

      for (let y = 0; y <= settings.height; y += divisionSize) {
        if (y % moduleSize !== 0) {
          ctx.moveTo(0, y);
          ctx.lineTo(settings.width, y);
        }
      }

      ctx.stroke();
    }
  };

  // SVG generation for all grid types
  const generateSVGForAllGridTypes = (settings: GridSettings): string => {
    let svg = '';
    
    switch (settings.gridType) {
      case 'square':
        if (settings.showMinorGrid) {
          for (let x = 0; x <= settings.width; x += settings.minorStep) {
            svg += `<line x1="${x}" y1="0" x2="${x}" y2="${settings.height}" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}" vector-effect="non-scaling-stroke"/>`;
          }
          for (let y = 0; y <= settings.height; y += settings.minorStep) {
            svg += `<line x1="0" y1="${y}" x2="${settings.width}" y2="${y}" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}" vector-effect="non-scaling-stroke"/>`;
          }
        }
        
        if (settings.showMajorGrid) {
          for (let x = 0; x <= settings.width; x += settings.majorStep) {
            svg += `<line x1="${x}" y1="0" x2="${x}" y2="${settings.height}" stroke="${settings.majorColor}" stroke-width="${settings.majorThickness}" vector-effect="non-scaling-stroke"/>`;
          }
          for (let y = 0; y <= settings.height; y += settings.majorStep) {
            svg += `<line x1="0" y1="${y}" x2="${settings.width}" y2="${y}" stroke="${settings.majorColor}" stroke-width="${settings.majorThickness}" vector-effect="non-scaling-stroke"/>`;
          }
        }
        break;
        
      case 'dotted':
        if (settings.showMinorGrid) {
          for (let x = 0; x <= settings.width; x += settings.minorStep) {
            for (let y = 0; y <= settings.height; y += settings.minorStep) {
              svg += `<circle cx="${x}" cy="${y}" r="${settings.minorThickness}" fill="${settings.minorColor}"/>`;
            }
          }
        }
        if (settings.showMajorGrid) {
          for (let x = 0; x <= settings.width; x += settings.majorStep) {
            for (let y = 0; y <= settings.height; y += settings.majorStep) {
              svg += `<circle cx="${x}" cy="${y}" r="${settings.majorThickness}" fill="${settings.majorColor}"/>`;
            }
          }
        }
        break;
        
      // Add other grid types as needed...
      default:
        // Fallback to square grid for other types
        for (let x = 0; x <= settings.width; x += settings.minorStep) {
          svg += `<line x1="${x}" y1="0" x2="${x}" y2="${settings.height}" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}"/>`;
        }
        for (let y = 0; y <= settings.height; y += settings.minorStep) {
          svg += `<line x1="0" y1="${y}" x2="${settings.width}" y2="${y}" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}"/>`;
        }
    }
    
    return svg;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Mobile Title */}
        <div className="md:hidden p-3 bg-surface border-b border-border text-center">
          <div className="text-sm font-street font-black tracking-wider text-text-primary">
            GRID[Y] GENERATOR
          </div>
        </div>

        {/* Vertical Title - Desktop */}
        <div className="hidden md:flex items-center justify-center w-8 bg-surface border-r border-border">
          <div className="transform -rotate-90 text-sm font-street font-black tracking-wider text-text-primary whitespace-nowrap">
            GRID[Y] GENERATOR
          </div>
        </div>

        {/* Control Panel - Desktop */}
        <div className="hidden md:block">
          <ControlPanel
            settings={settings}
            onSettingsChange={setSettings}
            onExportPNG={exportToPNG}
            onExportSVG={exportToSVG}
            onRandomize={randomizeSettings}
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-2 md:p-4 overflow-hidden">
            <GridCanvas 
              settings={settings}
              className="w-full h-full"
            />
          </div>
          
          {/* Status Bar */}
          <div className="px-2 md:px-4 py-2 bg-surface border-t border-border text-xs text-text-muted">
            <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-0">
              <div className="text-center md:text-left">
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

        {/* Mobile Control Panel */}
        <div className="md:hidden bg-surface border-t border-border">
          <ControlPanel
            settings={settings}
            onSettingsChange={setSettings}
            onExportPNG={exportToPNG}
            onExportSVG={exportToSVG}
            onRandomize={randomizeSettings}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
