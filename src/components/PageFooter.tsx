
import React from 'react';

const PageFooter: React.FC = () => {
  return (
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
  );
};

export default PageFooter;
