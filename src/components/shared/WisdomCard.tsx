import React from 'react';
import { Card } from '../ui/Card';
import { Heart, ExternalLink } from 'lucide-react';
import type { Wisdom } from '../../types';

interface WisdomCardProps {
  wisdom: Wisdom;
  isSaved: boolean;
  onToggleSave: (id: string, currentlySaved: boolean) => void;
}

export const WisdomCard: React.FC<WisdomCardProps> = ({ wisdom, isSaved, onToggleSave }) => {
  return (
    <Card className="p-6 bg-[#FDFCF8] dark:bg-[#151514] border border-[#E9DFCF]/50 dark:border-gray-800 relative group overflow-hidden">
      {/* Decorative quotes */}
      <div className="absolute top-4 left-4 text-[#D8AD62]/20 font-serif text-6xl leading-none select-none">
        "
      </div>
      
      <div className="relative z-10 pt-4 pb-2">
        <p className="text-lg md:text-xl font-medium text-brand-primary dark:text-brand-darkPrimaryText leading-relaxed mb-6">
          {wisdom.contentTamil || wisdom.content}
        </p>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            {wisdom.author && (
              <p className="font-semibold text-brand-saffron text-sm">
                — {wisdom.author}
              </p>
            )}
            {(wisdom.tradition || wisdom.sourceName) && (
              <p className="text-xs text-brand-primary/60 dark:text-brand-darkMutedText mt-1">
                {wisdom.tradition ? `மரபு: ${wisdom.tradition}` : ''}
                {wisdom.tradition && wisdom.sourceName ? ' • ' : ''}
                {wisdom.sourceName}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {wisdom.sourceUrl && (
              <a 
                href={wisdom.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-brand-primary/60 dark:text-brand-darkMutedText hover:text-brand-primary dark:hover:text-brand-darkPrimaryText transition-colors px-3 py-1.5 rounded-full bg-white dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-800"
              >
                <ExternalLink size={14} /> View Source
              </a>
            )}
            
            <button 
              onClick={() => onToggleSave(wisdom.id, isSaved)}
              className={`p-2 rounded-full transition-colors ${
                isSaved 
                  ? 'text-red-500 bg-red-50 dark:bg-red-500/10' 
                  : 'text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-500/10'
              }`}
              aria-label={isSaved ? "Unsave" : "Save"}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} strokeWidth={isSaved ? 0 : 2} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom border highlight */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D8AD62]/20 to-transparent"></div>
    </Card>
  );
};
