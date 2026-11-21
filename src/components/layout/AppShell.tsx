'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080D18] text-[#F8FAFC] flex">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Dynamic page contents */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
