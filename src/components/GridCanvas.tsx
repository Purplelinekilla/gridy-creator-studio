import { useEffect, useRef } from 'react';

export interface GridSettings {
  width: number;
  height: number;
  gridType: 'square' | 'dotted' | 'isometric' | 'triangular' | 'polar' | 'logarithmic' | 'modular';
  minorStep: number;
  minorColor: string;
  minorThickness: number;
  majorStep: number;
  majorColor: string;
  majorThickness: number;
  whiteBackground: boolean;
  showMinorGrid: boolean;
  showMajorGrid: boolean;
}

interface GridCanvasProps {
  settings: GridSettings;
  className?: string;
}

export const GridCanvas = ({ settings, className = "" }: GridCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = settings.width;
    canvas.height = settings.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    if (settings.whiteBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw grids based on type
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
  }, [settings]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="border border-border max-w-full max-h-full"
        style={{ 
          width: Math.min(settings.width, 800), 
          height: Math.min(settings.height, 600) 
        }}
      />
    </div>
  );
};

function drawSquareGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, majorStep, minorColor, majorColor, minorThickness, majorThickness, showMinorGrid, showMajorGrid } = settings;

  // Draw minor grid
  if (showMinorGrid && minorStep > 0) {
    ctx.strokeStyle = minorColor;
    ctx.lineWidth = minorThickness;
    ctx.beginPath();

    // Vertical lines
    for (let x = 0; x <= width; x += minorStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += minorStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  }

  // Draw major grid
  if (showMajorGrid && majorStep > 0) {
    ctx.strokeStyle = majorColor;
    ctx.lineWidth = majorThickness;
    ctx.beginPath();

    // Vertical lines
    for (let x = 0; x <= width; x += majorStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += majorStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  }
}

function drawDottedGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, majorStep, minorColor, majorColor, minorThickness, majorThickness, showMinorGrid, showMajorGrid } = settings;

  // Draw minor dots
  if (showMinorGrid && minorStep > 0) {
    ctx.fillStyle = minorColor;
    for (let x = 0; x <= width; x += minorStep) {
      for (let y = 0; y <= height; y += minorStep) {
        ctx.beginPath();
        ctx.arc(x, y, minorThickness / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  // Draw major dots
  if (showMajorGrid && majorStep > 0) {
    ctx.fillStyle = majorColor;
    for (let x = 0; x <= width; x += majorStep) {
      for (let y = 0; y <= height; y += majorStep) {
        ctx.beginPath();
        ctx.arc(x, y, majorThickness, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

function drawIsometricGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, minorColor, minorThickness, showMinorGrid } = settings;
  
  if (!showMinorGrid || minorStep <= 0) return;

  ctx.strokeStyle = minorColor;
  ctx.lineWidth = minorThickness;
  ctx.beginPath();

  const angle1 = Math.PI / 6; // 30 degrees
  const angle2 = -Math.PI / 6; // -30 degrees

  // Vertical lines
  for (let x = 0; x <= width; x += minorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // Diagonal lines (30 degrees)
  for (let i = -height; i <= width + height; i += minorStep) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height * Math.tan(angle1), height);
  }

  // Diagonal lines (-30 degrees)
  for (let i = 0; i <= width + height; i += minorStep) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height * Math.tan(angle2), height);
  }

  ctx.stroke();
}

function drawTriangularGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, minorColor, minorThickness, showMinorGrid } = settings;
  
  if (!showMinorGrid || minorStep <= 0) return;

  ctx.strokeStyle = minorColor;
  ctx.lineWidth = minorThickness;
  
  const triangleHeight = minorStep * Math.sqrt(3) / 2;
  
  ctx.beginPath();
  
  // Horizontal lines
  for (let y = 0; y <= height; y += triangleHeight) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  
  // Diagonal lines
  for (let x = 0; x <= width + height; x += minorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x - height / Math.sqrt(3), height);
  }
  
  for (let x = 0; x <= width + height; x += minorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height / Math.sqrt(3), height);
  }
  
  ctx.stroke();
}

function drawPolarGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, majorStep, minorColor, majorColor, minorThickness, majorThickness, showMinorGrid, showMajorGrid } = settings;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY);

  // Concentric circles (minor)
  if (showMinorGrid && minorStep > 0) {
    ctx.strokeStyle = minorColor;
    ctx.lineWidth = minorThickness;
    for (let r = minorStep; r <= maxRadius; r += minorStep) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  // Concentric circles (major)
  if (showMajorGrid && majorStep > 0) {
    ctx.strokeStyle = majorColor;
    ctx.lineWidth = majorThickness;
    for (let r = majorStep; r <= maxRadius; r += majorStep) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  // Radial lines
  if (showMinorGrid) {
    ctx.strokeStyle = minorColor;
    ctx.lineWidth = minorThickness;
    const angleStep = (2 * Math.PI) / (minorStep > 0 ? minorStep : 12);
    for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + maxRadius * Math.cos(angle), centerY + maxRadius * Math.sin(angle));
      ctx.stroke();
    }
  }
}

function drawLogarithmicGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, minorColor, minorThickness, showMinorGrid } = settings;
  
  if (!showMinorGrid || minorStep <= 0) return;

  ctx.strokeStyle = minorColor;
  ctx.lineWidth = minorThickness;
  ctx.beginPath();

  // Logarithmic vertical lines
  for (let i = 1; i <= 10; i++) {
    const x = width * Math.log10(i) / Math.log10(10);
    if (x >= 0 && x <= width) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
  }

  // Logarithmic horizontal lines
  for (let i = 1; i <= 10; i++) {
    const y = height * Math.log10(i) / Math.log10(10);
    if (y >= 0 && y <= height) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
  }

  ctx.stroke();
}

function drawModularGrid(ctx: CanvasRenderingContext2D, settings: GridSettings) {
  const { width, height, minorStep, majorStep, minorColor, majorColor, minorThickness, majorThickness, showMinorGrid, showMajorGrid } = settings;

  // Base grid
  if (showMinorGrid && minorStep > 0) {
    ctx.strokeStyle = minorColor;
    ctx.lineWidth = minorThickness;
    ctx.beginPath();

    for (let x = 0; x <= width; x += minorStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += minorStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  }

  // Module divisions
  if (showMajorGrid && majorStep > 0) {
    ctx.strokeStyle = majorColor;
    ctx.lineWidth = majorThickness;
    ctx.beginPath();

    for (let x = 0; x <= width; x += majorStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += majorStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  }
}