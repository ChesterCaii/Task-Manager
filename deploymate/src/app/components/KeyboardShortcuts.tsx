import React, { useState, useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  disabled?: boolean;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  shortcuts,
  disabled = false
}) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help dialog when pressing ? with any modifier key
      if (e.key === '?' && (e.ctrlKey || e.metaKey || e.shiftKey)) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Toggle help dialog with ? key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Handle registered shortcuts
      for (const shortcut of shortcuts) {
        if (e.key.toLowerCase() === shortcut.key.toLowerCase()) {
          // Don't fire shortcuts when typing in input fields or textareas
          if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            (e.target as HTMLElement).isContentEditable
          ) {
            continue;
          }

          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, disabled]);

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="modal-backdrop absolute inset-0"
        onClick={() => setShowHelp(false)}
      ></div>
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
        
        <div className="mb-6">
          <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="kbd">?</span>
            <span className="ml-4">Show/hide this help dialog</span>
          </div>

          {shortcuts.map((shortcut, index) => (
            <div 
              key={index} 
              className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <span className="kbd">{shortcut.key}</span>
              <span className="ml-4">{shortcut.description}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button 
            className="btn btn-primary"
            onClick={() => setShowHelp(false)}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}; 