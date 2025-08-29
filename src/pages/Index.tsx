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
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `grid-${settings.gridType}-${settings.width}x${settings.height}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportToSVG = () => {
    // Create SVG string based on current settings
    let svg = `<svg width="${settings.width}" height="${settings.height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (settings.whiteBackground) {
      svg += `<rect width="100%" height="100%" fill="white"/>`;
    }

    // Add grid patterns based on type and settings
    if (settings.gridType === 'square') {
      if (settings.showMinorGrid) {
        svg += `<defs><pattern id="minorGrid" width="${settings.minorStep}" height="${settings.minorStep}" patternUnits="userSpaceOnUse">
          <path d="M ${settings.minorStep} 0 L 0 0 0 ${settings.minorStep}" fill="none" stroke="${settings.minorColor}" stroke-width="${settings.minorThickness}"/>
        </pattern></defs>`;
        svg += `<rect width="100%" height="100%" fill="url(#minorGrid)"/>`;
      }
      
      if (settings.showMajorGrid) {
        svg += `<defs><pattern id="majorGrid" width="${settings.majorStep}" height="${settings.majorStep}" patternUnits="userSpaceOnUse">
          <path d="M ${settings.majorStep} 0 L 0 0 0 ${settings.majorStep}" fill="none" stroke="${settings.majorColor}" stroke-width="${settings.majorThickness}"/>
        </pattern></defs>`;
        svg += `<rect width="100%" height="100%" fill="url(#majorGrid)"/>`;
      }
    }
    
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `grid-${settings.gridType}-${settings.width}x${settings.height}.svg`;
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
          <div className="transform -rotate-90 text-xs font-mono tracking-wider text-text-secondary whitespace-nowrap">
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
                  href="https://www.instagram.com/timur_zima/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Timur Zima
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
