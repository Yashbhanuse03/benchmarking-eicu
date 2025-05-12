
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import random

def generate_sample_data(n_samples=500):
    """
    Generate synthetic patient data for mortality prediction and length of stay
    
    Parameters:
    n_samples (int): Number of samples to generate
    
    Returns:
    pd.DataFrame: Dataframe containing patient features
    """
    # Set random seed for reproducibility
    np.random.seed(42)
    
    # Create empty dataframe
    data = pd.DataFrame()
    
    # Generate patient demographics
    data['age'] = np.random.normal(65, 15, n_samples).clip(18, 100).astype(int)
    data['gender'] = np.random.binomial(1, 0.5, n_samples)  # 0 = female, 1 = male
    
    # Generate vital signs
    data['heart_rate'] = np.random.normal(80, 15, n_samples).clip(40, 180).astype(int)
    data['systolic_bp'] = np.random.normal(120, 20, n_samples).clip(70, 200).astype(int)
    data['diastolic_bp'] = np.random.normal(80, 10, n_samples).clip(40, 120).astype(int)
    data['respiration_rate'] = np.random.normal(16, 4, n_samples).clip(8, 40).astype(int)
    data['temperature'] = np.random.normal(37, 1, n_samples).clip(35, 41)
    data['oxygen_saturation'] = np.random.normal(96, 3, n_samples).clip(70, 100).astype(int)
    
    # Generate lab results
    data['wbc_count'] = np.random.normal(9, 3, n_samples).clip(2, 30)
    data['hemoglobin'] = np.random.normal(13, 2, n_samples).clip(5, 18)
    data['platelet_count'] = np.random.normal(250, 100, n_samples).clip(20, 600).astype(int)
    data['sodium'] = np.random.normal(140, 5, n_samples).clip(120, 160).astype(int)
    data['potassium'] = np.random.normal(4, 0.5, n_samples).clip(2.5, 7)
    data['creatinine'] = np.random.normal(1, 0.5, n_samples).clip(0.5, 8)
    
    # Generate comorbidities
    data['diabetes'] = np.random.binomial(1, 0.25, n_samples)
    data['hypertension'] = np.random.binomial(1, 0.4, n_samples)
    data['copd'] = np.random.binomial(1, 0.15, n_samples)
    data['asthma'] = np.random.binomial(1, 0.1, n_samples)
    data['chf'] = np.random.binomial(1, 0.2, n_samples)
    data['ckd'] = np.random.binomial(1, 0.15, n_samples)
    data['cancer'] = np.random.binomial(1, 0.1, n_samples)
    
    # Create risk factors that influence outcomes
    advanced_age = data['age'] > 75
    abnormal_vitals = ((data['heart_rate'] > 100) | (data['heart_rate'] < 60) | 
                       (data['systolic_bp'] > 160) | (data['systolic_bp'] < 90) |
                       (data['oxygen_saturation'] < 92))
    abnormal_labs = ((data['wbc_count'] > 12) | (data['hemoglobin'] < 10) | 
                     (data['creatinine'] > 2) | (data['platelet_count'] < 150))
    multiple_comorbidities = (data['diabetes'] + data['hypertension'] + data['copd'] + 
                             data['chf'] + data['ckd'] + data['cancer']) >= 3
    
    # Compute risk score based on factors (for determining outcomes)
    risk_score = (advanced_age.astype(int) * 1.5 + 
                 abnormal_vitals.astype(int) * 2 + 
                 abnormal_labs.astype(int) * 1.8 + 
                 multiple_comorbidities.astype(int) * 2.5 +
                 np.random.normal(0, 1, n_samples))
    
    # Normalize risk score to 0-10 range
    risk_score = (risk_score - risk_score.min()) / (risk_score.max() - risk_score.min()) * 10
    
    # Generate mortality outcome based on risk score
    # Higher risk = higher chance of mortality
    mortality_prob = 1 / (1 + np.exp(-(risk_score - 6) / 1.5))  # Sigmoid function centered at risk=6
    data['mortality'] = np.random.binomial(1, mortality_prob)
    
    # For those who survived, create mortality rate as a percentage (for regression task)
    data['mortality_rate'] = mortality_prob * 100
    
    # Generate length of stay (in days) based on risk and randomness
    # Higher risk = longer stay
    los_base = risk_score * 1.5 + np.random.normal(0, 2, n_samples)
    data['length_of_stay'] = np.maximum(1, los_base).astype(int)
    
    # Adjust length of stay for mortality cases (typically shorter due to early death or longer due to severity)
    los_adj = []
    for i, mort in enumerate(data['mortality']):
        if mort == 1:
            # For mortality cases, length of stay can be very short (rapid death)
            # or very long (prolonged critical condition before death)
            if np.random.random() < 0.3:  # 30% chance of early death
                los_adj.append(max(1, int(data['length_of_stay'].iloc[i] * 0.3)))
            else:  # 70% chance of prolonged critical condition
                los_adj.append(int(data['length_of_stay'].iloc[i] * 1.5))
        else:
            los_adj.append(data['length_of_stay'].iloc[i])
    
    data['length_of_stay'] = los_adj
    
    # Create admission type
    admission_types = ['Emergency', 'Urgent', 'Elective']
    data['admission_type'] = np.random.choice(admission_types, size=n_samples, 
                                            p=[0.6, 0.25, 0.15])
    
    return data

def save_sample_data(n_samples=500, filename='patient_data.csv'):
    """
    Generate and save sample data to a CSV file
    
    Parameters:
    n_samples (int): Number of samples to generate
    filename (str): Name of output file
    """
    data = generate_sample_data(n_samples)
    data.to_csv(filename, index=False)
    print(f"Generated {n_samples} samples and saved to {filename}")
    return data

if __name__ == "__main__":
    save_sample_data(500, 'patient_data.csv')
