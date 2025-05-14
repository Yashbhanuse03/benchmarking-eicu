
import React from 'react';
import PatientForm from './PatientForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PatientDataTabProps = {
  initialValues: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
};

const PatientDataTab: React.FC<PatientDataTabProps> = ({ initialValues, onSubmit, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>Enter patient clinical data for prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <PatientForm 
          initialValues={initialValues} 
          onSubmit={onSubmit} 
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default PatientDataTab;
