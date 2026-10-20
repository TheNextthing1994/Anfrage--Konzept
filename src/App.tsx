import React, { useState } from 'react';
import {
  INITIAL_OBJECTS,
  StandardizedObject,
  WorkstationSection,
  ObjectState
} from './data/workstationData';
import { LandingPage } from './components/LandingPage';
import { WorkstationView } from './components/WorkstationView';

export default function App() {
  // Default to Workstation so user immediately sees the UX from the screenshots
  const [viewMode, setViewMode] = useState<'landing' | 'workstation'>('workstation');
  const [objects, setObjects] = useState<StandardizedObject[]>(INITIAL_OBJECTS);
  const [activeSection, setActiveSection] = useState<WorkstationSection>('requests');
  const [selectedObjectId, setSelectedObjectId] = useState<string>('OBJ-15K-01');
  const [openIntakeDirectly, setOpenIntakeDirectly] = useState<boolean>(false);

  const handleOpenWorkstation = (
    initialSection: WorkstationSection = 'requests',
    selectObjectId?: string,
    openIntake: boolean = false
  ) => {
    setActiveSection(initialSection);
    if (selectObjectId) {
      setSelectedObjectId(selectObjectId);
    }
    setOpenIntakeDirectly(openIntake);
    setViewMode('workstation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateObjectState = (
    id: string,
    newState: ObjectState,
    newSection?: StandardizedObject['section']
  ) => {
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id !== id) return obj;
        return {
          ...obj,
          currentState: newState,
          section: newSection || obj.section,
          lastReviewed: '2026-10-03'
        };
      })
    );
  };

  const handleAddObject = (newObj: StandardizedObject) => {
    setObjects((prev) => [newObj, ...prev]);
  };

  return (
    <div 
      className="min-h-screen text-[#F1F5F9] flex flex-col relative bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url('/assets/aistudio/image_989a6b56.png')` }}
    >
      {/* Atmospheric dark gradient overlay to ensure perfect contrast while letting the background floor and lighting shine through */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b12]/70 via-[#070b12]/60 to-[#070b12]/80 backdrop-blur-[1px] pointer-events-none z-0" />
      
      {/* BODY VIEW */}
      <div className="flex-1 min-h-0 flex flex-col relative z-10">
        {viewMode === 'landing' ? (
          <LandingPage
            objects={objects}
            onOpenWorkstation={handleOpenWorkstation}
          />
        ) : (
          <WorkstationView
            objects={objects}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            onUpdateObjectState={handleUpdateObjectState}
            onAddObject={handleAddObject}
            onBackToLanding={() => {
              setViewMode('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialOpenIntake={openIntakeDirectly}
          />
        )}
      </div>
    </div>
  );
}
