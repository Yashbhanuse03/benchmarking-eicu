
// Sample performance metrics for model comparison
// In a real application, these would be loaded from the backend

export const samplePerformanceMetrics = {
  mortality_classification: {
    random_forest: {
      accuracy: 0.89,
      auroc: 0.94,
      precision: 0.87,
      recall: 0.86,
      f1: 0.865
    },
    knn: {
      accuracy: 0.83,
      auroc: 0.87,
      precision: 0.81,
      recall: 0.79,
      f1: 0.80
    },
    xgboost: {
      accuracy: 0.91,
      auroc: 0.95,
      precision: 0.89,
      recall: 0.88,
      f1: 0.885
    },
    logistic_regression: {
      accuracy: 0.82,
      auroc: 0.88,
      precision: 0.80,
      recall: 0.81,
      f1: 0.805
    }
  },
  mortality_rate_regression: {
    random_forest: {
      mse: 56.2,
      r2: 0.85
    },
    knn: {
      mse: 78.9,
      r2: 0.76
    },
    xgboost: {
      mse: 48.5,
      r2: 0.88
    },
    linear_regression: {
      mse: 92.1,
      r2: 0.71
    }
  },
  length_of_stay_regression: {
    random_forest: {
      mse: 4.2,
      r2: 0.81
    },
    knn: {
      mse: 6.7,
      r2: 0.73
    },
    xgboost: {
      mse: 3.8,
      r2: 0.84
    },
    linear_regression: {
      mse: 7.9,
      r2: 0.68
    }
  }
};

// Sample patient data for demo purposes
export const samplePatients = [
  {
    id: 1,
    age: 72,
    gender: 1, // male
    heart_rate: 95,
    systolic_bp: 145,
    diastolic_bp: 85,
    respiration_rate: 20,
    temperature: 37.8,
    oxygen_saturation: 94,
    wbc_count: 11.5,
    hemoglobin: 12.5,
    platelet_count: 200,
    sodium: 138,
    potassium: 4.2,
    creatinine: 1.3,
    diabetes: 1,
    hypertension: 1,
    copd: 0,
    asthma: 0,
    chf: 0,
    ckd: 0,
    cancer: 0,
    admission_type: 'Emergency'
  },
  {
    id: 2,
    age: 58,
    gender: 0, // female
    heart_rate: 82,
    systolic_bp: 125,
    diastolic_bp: 80,
    respiration_rate: 16,
    temperature: 36.9,
    oxygen_saturation: 97,
    wbc_count: 7.8,
    hemoglobin: 13.5,
    platelet_count: 230,
    sodium: 140,
    potassium: 4.0,
    creatinine: 0.9,
    diabetes: 0,
    hypertension: 1,
    copd: 0,
    asthma: 1,
    chf: 0,
    ckd: 0,
    cancer: 0,
    admission_type: 'Elective'
  }
];
