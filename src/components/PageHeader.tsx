
import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Patient Outcome Predictor</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        This clinical decision support tool uses machine learning to predict patient mortality risk 
        and estimated length of stay based on clinical data.
      </p>
    </header>
  );
};

export default PageHeader;
