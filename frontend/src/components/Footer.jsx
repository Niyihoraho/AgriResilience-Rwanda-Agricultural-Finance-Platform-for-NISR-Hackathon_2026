// frontend/src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="pt-3 pb-6 border-t border-card-border flex items-center justify-between text-[11.5px] text-text-secondary select-none">
      <div>
        <strong className="text-text-primary">AgriResilience Rwanda</strong> &nbsp;|&nbsp; Agricultural Intelligence Dashboard
      </div>
      <div className="flex items-center gap-4">
        <button className="hover:text-text-primary transition-colors cursor-pointer">About</button>
        <button className="hover:text-text-primary transition-colors cursor-pointer">Data Sources</button>
        <button className="hover:text-text-primary transition-colors cursor-pointer">Help</button>
      </div>
    </footer>
  );
}

