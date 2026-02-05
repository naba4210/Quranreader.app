import React from 'react';
import { AppSettings, ScriptType } from '../types';
import { Icons } from '../constants';

interface SettingsPanelProps {
  settings: AppSettings;
  onChange: (s: AppSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, onClose }) => {
  return (
    <div className="w-72 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Reading Settings</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div className="space-y-4">
        {/* Script Selection */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block">Script</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onChange({ ...settings, script: 'uthmani' })}
              className={`p-2 rounded-lg border text-sm font-uthmani ${settings.script === 'uthmani' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
            >
              Uthmani
            </button>
            <button 
              onClick={() => onChange({ ...settings, script: 'indopak' })}
              className={`p-2 rounded-lg border text-sm font-indoPak ${settings.script === 'indopak' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
            >
              IndoPak
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block">Arabic Size</label>
          <input 
            type="range" 
            min="20" 
            max="60" 
            value={settings.arabicFontSize}
            onChange={(e) => onChange({...settings, arabicFontSize: parseInt(e.target.value)})}
            className="w-full accent-emerald-600"
          />
        </div>

        {/* Translation Toggle */}
        <div className="flex items-center justify-between">
           <span className="text-sm text-gray-700 dark:text-gray-300">Show Translation</span>
           <button 
             onClick={() => onChange({...settings, showTranslation: !settings.showTranslation})}
             className={`w-10 h-5 rounded-full relative transition-colors ${settings.showTranslation ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
           >
             <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.showTranslation ? 'left-6' : 'left-1'}`} />
           </button>
        </div>

        {/* Auto Scroll Toggle */}
        <div className="flex items-center justify-between">
           <span className="text-sm text-gray-700 dark:text-gray-300">Auto Scroll</span>
           <button 
             onClick={() => onChange({...settings, autoScroll: !settings.autoScroll})}
             className={`w-10 h-5 rounded-full relative transition-colors ${settings.autoScroll ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
           >
             <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.autoScroll ? 'left-6' : 'left-1'}`} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;