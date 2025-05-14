
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { makeMockPrediction } from '@/utils/predictionUtils';
import { defaultPatientData } from '@/constants/patientData';

export const usePatientPrediction = () => {
  const [patientData, setPatientData] = useState(defaultPatientData);
  const [predictions, setPredictions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const { toast } = useToast();
  
  // Reset data on page load/refresh
  useEffect(() => {
    // This will run when the component mounts (on page load or refresh)
    setPatientData(defaultPatientData);
    setPredictions(null);
    setActiveTab('input');
  }, []);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setPatientData(formData);
    
    try {
      // In a real application, this would call your Python backend
      // For this demo, we'll simulate the prediction with a timeout
      setTimeout(() => {
        const predictionResults = makeMockPrediction(formData);
        setPredictions(predictionResults);
        setActiveTab('results');
        setIsLoading(false);
        
        toast({
          title: "Prediction completed",
          description: "Patient outcomes have been predicted successfully.",
        });
      }, 1500);
    } catch (error) {
      console.error("Error making prediction:", error);
      setIsLoading(false);
      
      toast({
        title: "Prediction failed",
        description: "There was an error predicting patient outcomes.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setPatientData(defaultPatientData);
    setPredictions(null);
    setActiveTab('input');
  };

  return {
    patientData,
    predictions,
    isLoading,
    activeTab,
    setActiveTab,
    handleFormSubmit,
    resetForm
  };
};
