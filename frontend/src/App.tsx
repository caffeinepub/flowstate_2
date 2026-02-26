import React from 'react';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';

export default function App() {
  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="flex-1 ml-72 min-h-screen overflow-auto"
        style={{
          backgroundImage: 'url(/assets/generated/bg-pattern.dim_512x512.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Background overlay for readability */}
        <div className="min-h-screen bg-background/90">
          <div className="max-w-6xl mx-auto px-6 py-8 h-full">
            <KanbanBoard />
          </div>
        </div>
      </main>
    </div>
  );
}
