
import React, { useState, useEffect } from 'react';
import PatientForm from '../components/PatientForm';
import PredictionResults from '../components/PredictionResults';
import ModelComparison from '../components/ModelComparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { samplePerformanceMetrics } from '../data/sampleData';

// Default patient data
const defaultPatientData = {
  age: 65,
  gender: 1, // male
  heart_rate: 80,
  systolic_bp: 130,
  diastolic_bp: 85,
  respiration_rate: 18,
  temperature: 37.2,
  oxygen_saturation: 96,
  wbc_count: 8.5,
  hemoglobin: 14.0,
  platelet_count: 250,
  sodium: 140,
  potassium: 4.1,
  creatinine: 1.1,
  diabetes: 0,
  hypertension: 0,
  copd: 0,
  asthma: 0,
  chf: 0,
  ckd: 0,
  cancer: 0,
  admission_type: 'Emergency'
};

const Index = () => {
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

  // Mock prediction function (would be replaced by actual API call)
  const makeMockPrediction = (patientData: any) => {
    // Calculate risk score based on patient features
    const ageRisk = patientData.age > 70 ? 0.2 : 0.1;
    const vitalRisk = (patientData.heart_rate > 90 || 
                      patientData.systolic_bp > 140 || 
                      patientData.oxygen_saturation < 94) ? 0.2 : 0.1;
    const comorbidityCount = patientData.diabetes + 
                            patientData.hypertension + 
                            patientData.copd + 
                            patientData.chf + 
                            patientData.ckd + 
                            patientData.cancer;
    const comorbidityRisk = comorbidityCount > 2 ? 0.3 : (comorbidityCount > 0 ? 0.15 : 0.05);
    const labRisk = (patientData.wbc_count > 10 || 
                    patientData.creatinine > 1.5 || 
                    patientData.hemoglobin < 10) ? 0.2 : 0.1;
    
    // Add some randomness
    const baseRisk = ageRisk + vitalRisk + comorbidityRisk + labRisk;
    const randomFactor = Math.random() * 0.2 - 0.1; // -0.1 to 0.1
    
    // Mortality probability (0-1)
    const mortalityProb = Math.min(0.95, Math.max(0.01, baseRisk + randomFactor));
    
    // Length of stay (days) - higher risk = longer stay
    const losBase = (baseRisk * 20) + (Math.random() * 5);
    const lengthOfStay = Math.max(1, Math.round(losBase));
    
    // Generate predictions for different models with slight variations
    return {
      mortality_classification: {
        random_forest: {
          class: mortalityProb > 0.5 ? 1 : 0,
          probability: mortalityProb + (Math.random() * 0.06 - 0.03)
        },
        knn: {
          class: mortalityProb > 0.48 ? 1 : 0,
          probability: mortalityProb + (Math.random() * 0.08 - 0.04)
        },
        xgboost: {
          class: mortalityProb > 0.52 ? 1 : 0,
          probability: mortalityProb + (Math.random() * 0.04 - 0.02)
        },
        logistic_regression: {
          class: mortalityProb > 0.49 ? 1 : 0,
          probability: mortalityProb + (Math.random() * 0.1 - 0.05)
        }
      },
      mortality_rate_regression: {
        random_forest: mortalityProb * 100 + (Math.random() * 3 - 1.5),
        knn: mortalityProb * 100 + (Math.random() * 5 - 2.5),
        xgboost: mortalityProb * 100 + (Math.random() * 2 - 1),
        linear_regression: mortalityProb * 100 + (Math.random() * 6 - 3)
      },
      length_of_stay_regression: {
        random_forest: lengthOfStay + (Math.random() > 0.5 ? 1 : 0),
        knn: lengthOfStay + (Math.random() > 0.5 ? -1 : (Math.random() > 0.5 ? 1 : 0)),
        xgboost: lengthOfStay,
        linear_regression: lengthOfStay + (Math.random() > 0.7 ? 2 : (Math.random() > 0.5 ? 1 : 0))
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Patient Outcome Predictor</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This clinical decision support tool uses machine learning to predict patient mortality risk 
            and estimated length of stay based on clinical data.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Patient Data</TabsTrigger>
            <TabsTrigger value="results" disabled={!predictions}>Prediction Results</TabsTrigger>
            <TabsTrigger value="models">Model Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Enter patient clinical data for prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientForm 
                  initialValues={patientData} 
                  onSubmit={handleFormSubmit} 
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            {predictions ? (
              <div className="space-y-6">
                <PredictionResults predictions={predictions} />
                <div className="flex justify-center mt-4">
                  <Button onClick={resetForm} variant="outline">
                    New Prediction
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Predictions Yet</CardTitle>
                  <CardDescription>Submit patient data to see predictions</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="models" className="mt-6">
            <ModelComparison metrics={samplePerformanceMetrics} />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="py-6 mt-12 bg-blue-800 text-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            Patient Outcome Predictor - A machine learning tool for clinical decision support
          </p>
          <p className="text-xs mt-2 text-blue-200">
            This is a demonstration model and should not be used for actual clinical decisions
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
