import { useState, useEffect } from "react";

interface WorkflowState {
  marketResearched: boolean;
  propertySearched: boolean;
  propertyAnalyzed: boolean;
  leadAdded: boolean;
}

export function useMiniWorkflow() {
  const [miniWorkflowEnabled, setMiniWorkflowEnabled] = useState(true);
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    marketResearched: false,
    propertySearched: false,
    propertyAnalyzed: false,
    leadAdded: false
  });

  // Load workflow state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("workflowState");
    const savedMiniEnabled = localStorage.getItem("miniWorkflowEnabled");
    
    if (savedState) {
      try {
        setWorkflowState(JSON.parse(savedState));
      } catch (e) {
        console.warn("Failed to parse saved workflow state");
      }
    }
    if (savedMiniEnabled !== null) {
      try {
        setMiniWorkflowEnabled(JSON.parse(savedMiniEnabled));
      } catch (e) {
        console.warn("Failed to parse mini workflow enabled state");
      }
    }
  }, []);

  // Save workflow state to localStorage
  const updateWorkflowState = (updates: Partial<WorkflowState>) => {
    const newState = { ...workflowState, ...updates };
    setWorkflowState(newState);
    localStorage.setItem("workflowState", JSON.stringify(newState));
  };

  const toggleMiniWorkflow = (enabled?: boolean) => {
    const newState = enabled !== undefined ? enabled : !miniWorkflowEnabled;
    setMiniWorkflowEnabled(newState);
    localStorage.setItem("miniWorkflowEnabled", JSON.stringify(newState));
  };

  const resetWorkflowState = () => {
    const initialState = {
      marketResearched: false,
      propertySearched: false,
      propertyAnalyzed: false,
      leadAdded: false
    };
    setWorkflowState(initialState);
    localStorage.setItem("workflowState", JSON.stringify(initialState));
  };

  return {
    miniWorkflowEnabled,
    workflowState,
    updateWorkflowState,
    toggleMiniWorkflow,
    resetWorkflowState
  };
}