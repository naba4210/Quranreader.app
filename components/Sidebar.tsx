import React, { useState } from 'react';
import { Chapter } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId?: number;
  onSelect: (chapter: Chapter) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, currentChapterId, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChapters = chapters.filter(c => 
    c.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.translated_name.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.id).includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Icons.Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Surah..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredChapters.map(chapter => (
          <button
            key={chapter.id}
            onClick={() => onSelect(chapter)}
            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors
              ${currentChapterId === chapter.id ? 'bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-600' : 'border-l-4 border-transparent'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400">
                {chapter.id}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{chapter.name_simple}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{chapter.translated_name.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-uthmani text-lg text-emerald-800 dark:text-emerald-400">{chapter.name_arabic}</div>
              <div className="text-[10px] text-gray-400">{chapter.verses_count} Verses</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;