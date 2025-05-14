
// Mock prediction function that would be replaced by actual API call in production
export const makeMockPrediction = (patientData: any) => {
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
