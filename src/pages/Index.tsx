
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientPrediction } from '@/hooks/usePatientPrediction';
import { samplePerformanceMetrics } from '@/data/sampleData';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import PatientDataTab from '@/components/PatientDataTab';
import ResultsTab from '@/components/ResultsTab';
import ModelComparison from '@/components/ModelComparison';

const Index = () => {
  const {
    patientData,
    predictions,
    isLoading,
    activeTab,
    setActiveTab,
    handleFormSubmit,
    resetForm
  } = usePatientPrediction();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Patient Data</TabsTrigger>
            <TabsTrigger value="results" disabled={!predictions}>Prediction Results</TabsTrigger>
            <TabsTrigger value="models">Model Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-6">
            <PatientDataTab 
              initialValues={patientData} 
              onSubmit={handleFormSubmit} 
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <ResultsTab 
              predictions={predictions} 
              onNewPrediction={resetForm} 
            />
          </TabsContent>
          
          <TabsContent value="models" className="mt-6">
            <ModelComparison metrics={samplePerformanceMetrics} />
          </TabsContent>
        </Tabs>
      </div>
      
      <PageFooter />
    </div>
  );
};

export default Index;
