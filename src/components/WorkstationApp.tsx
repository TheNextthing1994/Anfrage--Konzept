import React, { useState } from 'react';
import { INITIAL_OBJECTS, type StandardizedObject, type WorkstationSection, type ObjectState } from '../data/workstationData';
import { WorkstationView } from './WorkstationView';

// Loaded only when the operator opens the workstation. The public demo uses its own data.
export default function WorkstationApp() {
  const [objects, setObjects] = useState<StandardizedObject[]>(INITIAL_OBJECTS);
  const [activeSection, setActiveSection] = useState<WorkstationSection>('requests');
  const [selectedObjectId, setSelectedObjectId] = useState('OBJ-15K-01');

  const updateObject = (id: string, newState: ObjectState, section?: StandardizedObject['section']) => {
    setObjects(previous => previous.map(object => object.id === id ? {
      ...object, currentState: newState, section: section || object.section,
      lastReviewed: new Date().toISOString().slice(0, 10)
    } : object));
  };

  return <WorkstationView
    objects={objects}
    activeSection={activeSection}
    onSectionChange={setActiveSection}
    selectedObjectId={selectedObjectId}
    onSelectObject={setSelectedObjectId}
    onUpdateObjectState={updateObject}
    onAddObject={object => setObjects(previous => [object, ...previous])}
    onBackToLanding={() => { window.location.hash = '/demo'; }}
  />;
}
