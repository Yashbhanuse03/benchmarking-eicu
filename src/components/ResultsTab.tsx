
import React from 'react';
import PredictionResults from './PredictionResults';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type ResultsTabProps = {
  predictions: any;
  onNewPrediction: () => void;
};

const ResultsTab: React.FC<ResultsTabProps> = ({ predictions, onNewPrediction }) => {
  if (!predictions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Predictions Yet</CardTitle>
          <CardDescription>Submit patient data to see predictions</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PredictionResults predictions={predictions} />
      <div className="flex justify-center mt-4">
        <Button onClick={onNewPrediction} variant="outline">
          New Prediction
        </Button>
      </div>
    </div>
  );
};

export default ResultsTab;
