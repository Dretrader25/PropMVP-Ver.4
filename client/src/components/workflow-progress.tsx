import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Search, BarChart3, Users, Target, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  requirements?: string[];
  tips?: string[];
}

interface WorkflowProgressProps {
  currentStep?: string;
  propertySearched?: boolean;
  propertyAnalyzed?: boolean;
  leadAdded?: boolean;
  onStepClick?: (step: WorkflowStep) => void;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'search',
    title: 'Find Property',
    description: 'Search for investment properties using our MLS-powered engine',
    icon: Search,
    route: '/',
    status: 'pending',
    requirements: [
      'Complete property address',
      'Valid city and state',
      'Accurate property details'
    ],
    tips: [
      'Use full street addresses for best results',
      'Include apartment/unit numbers when applicable',
      'Verify spelling of street names'
    ]
  },
  {
    id: 'analyze',
    title: 'Research & Analyze',
    description: 'Deep dive into property metrics, comparables, and AI insights',
    icon: BarChart3,
    route: '/analytics',
    status: 'pending',
    requirements: [
      'Property successfully searched',
      'Market data available',
      'Comparable sales found'
    ],
    tips: [
      'Review all comparable sales carefully',
      'Check AI analysis for investment grade',
      'Verify market trends and DOM statistics'
    ]
  },
  {
    id: 'evaluate',
    title: 'Market Intelligence',
    description: 'Examine market conditions and investment potential',
    icon: Target,
    route: '/market-intelligence',
    status: 'pending',
    requirements: [
      'Property analyzed',
      'Market data reviewed',
      'Investment potential assessed'
    ],
    tips: [
      'Check market heatmaps for area activity',
      'Review distressed property indicators',
      'Analyze investor activity levels'
    ]
  },
  {
    id: 'convert',
    title: 'Add to Pipeline',
    description: 'Convert qualified property into active lead for follow-up',
    icon: Users,
    route: '/lead-management',
    status: 'pending',
    requirements: [
      'Property fully analyzed',
      'Investment decision made',
      'Contact information gathered'
    ],
    tips: [
      'Set appropriate lead priority',
      'Add detailed notes from analysis',
      'Schedule follow-up activities'
    ]
  }
];

export default function WorkflowProgress({ 
  currentStep, 
  propertySearched = false, 
  propertyAnalyzed = false, 
  leadAdded = false,
  onStepClick 
}: WorkflowProgressProps) {
  const [, setLocation] = useLocation();
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Update step statuses based on progress
  useEffect(() => {
    const updatedSteps = steps.map((step, index) => {
      let status: 'pending' | 'active' | 'completed' | 'skipped' = 'pending';

      if (step.id === 'search') {
        status = propertySearched ? 'completed' : (currentStep === 'search' ? 'active' : 'pending');
      } else if (step.id === 'analyze') {
        if (!propertySearched) {
          status = 'pending';
        } else if (propertyAnalyzed) {
          status = 'completed';
        } else if (currentStep === 'analyze') {
          status = 'active';
        } else {
          status = 'pending';
        }
      } else if (step.id === 'evaluate') {
        if (!propertyAnalyzed) {
          status = 'pending';
        } else if (currentStep === 'evaluate') {
          status = 'active';
        } else if (leadAdded) {
          status = 'completed';
        } else {
          status = 'pending';
        }
      } else if (step.id === 'convert') {
        if (!propertyAnalyzed) {
          status = 'pending';
        } else if (leadAdded) {
          status = 'completed';
        } else if (currentStep === 'convert') {
          status = 'active';
        } else {
          status = 'pending';
        }
      }

      return { ...step, status };
    });

    setSteps(updatedSteps);

    // Update current step index
    const activeIndex = updatedSteps.findIndex(step => step.status === 'active');
    if (activeIndex !== -1) {
      setCurrentStepIndex(activeIndex);
    } else {
      const lastCompletedIndex = updatedSteps.map(step => step.status).lastIndexOf('completed');
      setCurrentStepIndex(Math.min(lastCompletedIndex + 1, updatedSteps.length - 1));
    }
  }, [currentStep, propertySearched, propertyAnalyzed, leadAdded]);

  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getNextStep = () => {
    const nextStepIndex = steps.findIndex(step => step.status === 'pending' || step.status === 'active');
    return nextStepIndex !== -1 ? steps[nextStepIndex] : null;
  };

  const handleStepClick = (step: WorkflowStep) => {
    // Only allow clicking on available steps
    const stepIndex = steps.findIndex(s => s.id === step.id);
    const canNavigate = stepIndex === 0 || steps[stepIndex - 1].status === 'completed';

    if (canNavigate) {
      setLocation(step.route);
      if (onStepClick) {
        onStepClick(step);
      }
    }
  };

  const handleNextStep = () => {
    const nextStep = getNextStep();
    if (nextStep) {
      handleStepClick(nextStep);
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    const IconComponent = step.icon;
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    } else if (step.status === 'active') {
      return <IconComponent className="h-5 w-5 text-blue-400" />;
    } else {
      return <Circle className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStepStatus = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Pending</Badge>;
      default:
        return null;
    }
  };

  const nextStep = getNextStep();
  const progress = calculateProgress();

  return (
    <Card className="glass-card border-slate-700/30 rounded-xl">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Deal Workflow Assistant</h3>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white border-blue-500/30">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-slate-800/50"
            />
            <p className="text-sm text-slate-400">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.title || 'Getting Started'}
            </p>
          </div>
        </div>

        {/* Current Step Highlight */}
        {nextStep && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <nextStep.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Next: {nextStep.title}</h4>
                  <p className="text-sm text-slate-300">{nextStep.description}</p>
                </div>
              </div>
              <Button 
                onClick={handleNextStep}
                className="btn-primary-gradient"
                size="sm"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const canNavigate = index === 0 || steps[index - 1].status === 'completed';
            const isBlocked = !canNavigate && step.status === 'pending';

            return (
              <div
                key={step.id}
                className={`
                  group relative p-4 rounded-xl transition-all duration-200 cursor-pointer
                  ${step.status === 'active' 
                    ? 'bg-blue-500/10 border border-blue-500/30 shadow-lg' 
                    : step.status === 'completed'
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : isBlocked
                    ? 'bg-slate-800/30 border border-slate-700/20 opacity-60'
                    : 'bg-slate-800/20 border border-slate-700/20 hover:bg-slate-700/20'
                  }
                  ${canNavigate ? 'hover:border-blue-500/40' : ''}
                `}
                onClick={() => !isBlocked && handleStepClick(step)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${step.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : step.status === 'active'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                        }
                      `}>
                        {index + 1}
                      </div>
                      {getStepIcon(step)}
                    </div>

                    {/* Step Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          step.status === 'completed' ? 'text-emerald-300' :
                          step.status === 'active' ? 'text-blue-300' :
                          isBlocked ? 'text-slate-500' : 'text-slate-300'
                        }`}>
                          {step.title}
                        </h4>
                        {isBlocked && (
                          <AlertCircle className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                      <p className={`text-sm ${
                        isBlocked ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    {getStepStatus(step)}
                    {canNavigate && step.status !== 'completed' && (
                      <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    )}
                  </div>
                </div>

                {/* Requirements & Tips (shown on hover for pending steps) */}
                {step.status === 'active' && (step.requirements || step.tips) && (
                  <div className="mt-3 pt-3 border-t border-slate-700/30">
                    {step.requirements && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-slate-300 mb-1">Requirements:</p>
                        <ul className="text-xs text-slate-400 space-y-0.5">
                          {step.requirements.map((req, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <Circle className="h-2 w-2 text-slate-500" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step.tips && (
                      <div>
                        <p className="text-xs font-medium text-blue-300 mb-1">Pro Tips:</p>
                        <ul className="text-xs text-slate-400 space-y-0.5">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <Circle className="h-2 w-2 text-blue-400" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/30">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-300">Workflow Complete!</h4>
                <p className="text-sm text-slate-300">
                  You've successfully moved a property through the entire analysis pipeline.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}