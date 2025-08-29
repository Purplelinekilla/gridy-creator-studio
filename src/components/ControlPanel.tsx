import { GridSettings } from './GridCanvas';

interface ControlPanelProps {
  settings: GridSettings;
  onSettingsChange: (settings: GridSettings) => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onRandomize: () => void;
}

const PRESETS = [
  { name: 'Custom', width: 800, height: 600 },
  { name: 'A1 (594 × 841 mm)', width: 2384, height: 3370 },
  { name: 'A2 (420 × 594 mm)', width: 1684, height: 2384 },
  { name: 'A3 (297 × 420 mm)', width: 1191, height: 1684 },
  { name: 'A4 (210 × 297 mm)', width: 842, height: 1191 }
];

const GRID_TYPES = [
  { value: 'square', label: 'Square Grid' },
  { value: 'dotted', label: 'Dotted Grid' },
  { value: 'isometric', label: 'Isometric Grid' },
  { value: 'triangular', label: 'Triangular Grid' },
  { value: 'polar', label: 'Polar Grid' },
  { value: 'logarithmic', label: 'Logarithmic Grid' },
  { value: 'modular', label: 'Modular Grid' }
] as const;

export const ControlPanel = ({
  settings,
  onSettingsChange,
  onExportPNG,
  onExportSVG,
  onRandomize
}: ControlPanelProps) => {
  const updateSettings = (updates: Partial<GridSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = PRESETS.find(p => p.name === e.target.value);
    if (preset && preset.name !== 'Custom') {
      updateSettings({ width: preset.width, height: preset.height });
    }
  };

  return (
    <div className="w-64 bg-surface border-r border-border p-4 overflow-y-auto h-full">
      {/* Canvas Size */}
      <div className="control-section">
        <h3 className="control-title">Canvas Size</h3>
        
        <div className="form-group">
          <label className="form-label">Format Preset</label>
          <select 
            className="form-select"
            onChange={handlePresetChange}
            value="Custom"
          >
            {PRESETS.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div className="checkbox-group mb-3">
          <input
            type="checkbox"
            id="portrait"
            className="checkbox-input"
            checked={settings.height > settings.width}
            onChange={(e) => {
              if (e.target.checked && settings.width > settings.height) {
                updateSettings({ 
                  width: settings.height, 
                  height: settings.width 
                });
              } else if (!e.target.checked && settings.height > settings.width) {
                updateSettings({ 
                  width: settings.height, 
                  height: settings.width 
                });
              }
            }}
          />
          <label htmlFor="portrait" className="text-xs text-text-secondary">
            Portrait Orientation
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="form-label">Width (px)</label>
            <input
              type="number"
              className="form-input"
              value={settings.width}
              onChange={(e) => updateSettings({ width: parseInt(e.target.value) || 800 })}
              min="100"
              max="5000"
            />
          </div>
          <div>
            <label className="form-label">Height (px)</label>
            <input
              type="number"
              className="form-input"
              value={settings.height}
              onChange={(e) => updateSettings({ height: parseInt(e.target.value) || 600 })}
              min="100"
              max="5000"
            />
          </div>
        </div>
      </div>

      {/* Grid Layers */}
      <div className="control-section">
        <h3 className="control-title">Grid Layers</h3>
        
        <div className="form-group">
          <label className="form-label">Grid Type</label>
          <select 
            className="form-select"
            value={settings.gridType}
            onChange={(e) => updateSettings({ gridType: e.target.value as GridSettings['gridType'] })}
          >
            {GRID_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Minor Layer */}
        <div className="form-group">
          <div className="checkbox-group mb-2">
            <input
              type="checkbox"
              id="minorLayer"
              className="checkbox-input"
              checked={settings.showMinorGrid}
              onChange={(e) => updateSettings({ showMinorGrid: e.target.checked })}
            />
            <label htmlFor="minorLayer" className="text-xs font-medium text-text-secondary">
              Minor Layer
            </label>
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="form-label">Step (px)</label>
              <input
                type="number"
                className="form-input"
                value={settings.minorStep}
                onChange={(e) => updateSettings({ minorStep: parseInt(e.target.value) || 20 })}
                min="1"
                max="200"
              />
            </div>
            
            <div>
              <label className="form-label">Color</label>
              <input
                type="color"
                className="color-input"
                value={settings.minorColor}
                onChange={(e) => updateSettings({ minorColor: e.target.value })}
              />
            </div>
            
            <div>
              <label className="form-label">Thickness</label>
              <input
                type="number"
                className="form-input"
                value={settings.minorThickness}
                onChange={(e) => updateSettings({ minorThickness: parseFloat(e.target.value) || 0.5 })}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Major Layer */}
        <div className="form-group">
          <div className="checkbox-group mb-2">
            <input
              type="checkbox"
              id="majorLayer"
              className="checkbox-input"
              checked={settings.showMajorGrid}
              onChange={(e) => updateSettings({ showMajorGrid: e.target.checked })}
            />
            <label htmlFor="majorLayer" className="text-xs font-medium text-text-secondary">
              Major Layer
            </label>
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="form-label">Step (px)</label>
              <input
                type="number"
                className="form-input"
                value={settings.majorStep}
                onChange={(e) => updateSettings({ majorStep: parseInt(e.target.value) || 100 })}
                min="1"
                max="500"
              />
            </div>
            
            <div>
              <label className="form-label">Color</label>
              <input
                type="color"
                className="color-input"
                value={settings.majorColor}
                onChange={(e) => updateSettings({ majorColor: e.target.value })}
              />
            </div>
            
            <div>
              <label className="form-label">Thickness</label>
              <input
                type="number"
                className="form-input"
                value={settings.majorThickness}
                onChange={(e) => updateSettings({ majorThickness: parseFloat(e.target.value) || 1 })}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="control-section">
        <h3 className="control-title">Settings</h3>
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="whiteBackground"
            className="checkbox-input"
            checked={settings.whiteBackground}
            onChange={(e) => updateSettings({ whiteBackground: e.target.checked })}
          />
          <label htmlFor="whiteBackground" className="text-xs text-text-secondary">
            White Background
          </label>
        </div>
      </div>

      {/* Export */}
      <div className="control-section">
        <h3 className="control-title">Export</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="button-secondary"
            onClick={onExportPNG}
          >
            PNG
          </button>
          <button 
            className="button-secondary"
            onClick={onExportSVG}
          >
            SVG
          </button>
        </div>
      </div>

      {/* Randomize */}
      <div className="control-section">
        <button 
          className="button-primary w-full"
          onClick={onRandomize}
        >
          Randomize ⚄⚃⚁
        </button>
      </div>
    </div>
  );
};