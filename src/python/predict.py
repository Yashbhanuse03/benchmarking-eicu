
import pickle
import pandas as pd
import numpy as np
import json
import os

def load_models(model_dir='models'):
    """
    Load trained models from files
    
    Parameters:
    model_dir (str): Directory containing saved models
    
    Returns:
    dict: Dictionary containing loaded models
    """
    # Load scaler
    with open(f"{model_dir}/scaler.pkl", "rb") as f:
        scaler = pickle.load(f)
    
    # Load feature names
    with open(f"{model_dir}/feature_names.json", "r") as f:
        feature_names = json.load(f)
    
    models = {
        'scaler': scaler,
        'feature_names': feature_names,
        'mortality_classification': {},
        'mortality_rate_regression': {},
        'length_of_stay_regression': {}
    }
    
    # Load models
    tasks = ['mortality_classification', 'mortality_rate_regression', 'length_of_stay_regression']
    model_types = ['random_forest', 'knn', 'xgboost', 'logistic_regression', 'linear_regression']
    
    for task in tasks:
        for model_type in model_types:
            model_path = f"{model_dir}/{task}/{model_type}.pkl"
            if os.path.exists(model_path):
                with open(model_path, "rb") as f:
                    models[task][model_type] = pickle.load(f)
    
    return models

def prepare_input_data(patient_data, feature_names):
    """
    Prepare input data for prediction
    
    Parameters:
    patient_data (dict): Patient data as a dictionary
    feature_names (list): List of feature names expected by the model
    
    Returns:
    pd.DataFrame: DataFrame containing prepared input data
    """
    # Convert input to DataFrame
    df = pd.DataFrame([patient_data])
    
    # Handle categorical variables
    if 'admission_type' in df.columns:
        df = pd.get_dummies(df, columns=['admission_type'], drop_first=True)
    
    # Ensure all expected features are present
    for feature in feature_names:
        if feature not in df.columns:
            # If binary feature is missing, add as 0
            if feature.startswith(('admission_type_')):
                df[feature] = 0
    
    # Select only the features expected by the model
    df = df[feature_names]
    
    return df

def predict_patient_outcomes(patient_data, models=None, model_dir='models'):
    """
    Predict patient mortality and length of stay
    
    Parameters:
    patient_data (dict): Patient data as a dictionary
    models (dict): Dictionary containing models, if None, loads from files
    model_dir (str): Directory containing saved models
    
    Returns:
    dict: Dictionary containing predictions
    """
    if models is None:
        models = load_models(model_dir)
    
    # Prepare input data
    df = prepare_input_data(patient_data, models['feature_names'])
    
    # Scale features
    X_scaled = models['scaler'].transform(df)
    
    predictions = {
        'mortality_classification': {},
        'mortality_rate_regression': {},
        'length_of_stay_regression': {}
    }
    
    # Make predictions with each model
    for task, task_models in models.items():
        if task not in ['scaler', 'feature_names']:
            for model_name, model in task_models.items():
                if task == 'mortality_classification':
                    # For classification, get both class and probability
                    pred_class = model.predict(X_scaled)[0]
                    pred_prob = model.predict_proba(X_scaled)[0, 1]
                    predictions[task][model_name] = {
                        'class': int(pred_class),
                        'probability': float(pred_prob)
                    }
                else:
                    # For regression, get predicted value
                    pred_value = model.predict(X_scaled)[0]
                    predictions[task][model_name] = float(pred_value)
    
    return predictions

# Function to load external dataset
def load_external_dataset(file_path):
    """
    Load dataset from external file (CSV)
    
    Parameters:
    file_path (str): Path to the CSV file
    
    Returns:
    pd.DataFrame: Loaded dataset
    """
    try:
        # Try to load the dataset
        data = pd.read_csv(file_path)
        print(f"Successfully loaded dataset from {file_path} with {data.shape[0]} records and {data.shape[1]} features")
        return data
    except Exception as e:
        print(f"Error loading dataset from {file_path}: {e}")
        return None

# Example usage
if __name__ == "__main__":
    # Check if external dataset exists
    external_data_path = "patient_data.csv"
    if os.path.exists(external_data_path):
        print(f"Found external dataset at {external_data_path}")
        # Use external dataset
        data = load_external_dataset(external_data_path)
        if data is not None:
            print("Using external dataset for training")
            # Here you would call the train_models function from train_models.py
            # with this dataset
            from train_models import train_models, save_models, save_metrics
            results, metrics = train_models(data)
            save_models(results)
            save_metrics(metrics)
    
    # Example patient data for prediction
    patient = {
        'age': 70,
        'gender': 1,  # male
        'heart_rate': 95,
        'systolic_bp': 145,
        'diastolic_bp': 85,
        'respiration_rate': 20,
        'temperature': 37.8,
        'oxygen_saturation': 94,
        'wbc_count': 11.5,
        'hemoglobin': 12.5,
        'platelet_count': 200,
        'sodium': 138,
        'potassium': 4.2,
        'creatinine': 1.3,
        'diabetes': 1,
        'hypertension': 1,
        'copd': 0,
        'asthma': 0,
        'chf': 0,
        'ckd': 0,
        'cancer': 0,
        'admission_type': 'Emergency'
    }
    
    predictions = predict_patient_outcomes(patient)
    print(json.dumps(predictions, indent=2))
