
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_squared_error, roc_auc_score, confusion_matrix
from sklearn.metrics import precision_score, recall_score, f1_score, r2_score
import xgboost as xgb
import pickle
import json
import os
from generate_data import generate_sample_data

def train_models(data=None, n_samples=500):
    """
    Train mortality and length of stay prediction models
    
    Parameters:
    data (pd.DataFrame): Patient data, if None, generates synthetic data
    n_samples (int): Number of samples to generate if data=None
    
    Returns:
    dict: Dictionary containing trained models and performance metrics
    """
    if data is None:
        data = generate_sample_data(n_samples)
    
    # Split features and targets
    X = data.drop(['mortality', 'mortality_rate', 'length_of_stay'], axis=1)
    
    # Convert categorical variables to dummies
    X = pd.get_dummies(X, drop_first=True)
    
    # Target for mortality classification
    y_mortality = data['mortality']
    
    # Target for mortality rate regression
    y_mortality_rate = data['mortality_rate']
    
    # Target for length of stay regression
    y_los = data['length_of_stay']
    
    # Split data into train and test sets
    X_train, X_test, y_mort_train, y_mort_test, y_rate_train, y_rate_test, y_los_train, y_los_test = \
        train_test_split(X, y_mortality, y_mortality_rate, y_los, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Dictionary to store models and results
    results = {
        'feature_names': X.columns.tolist(),
        'scaler': scaler,
        'mortality_classification': {},
        'mortality_rate_regression': {},
        'length_of_stay_regression': {}
    }
    
    # Train mortality classification models
    
    # Random Forest Classifier
    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_clf.fit(X_train_scaled, y_mort_train)
    rf_pred = rf_clf.predict(X_test_scaled)
    rf_prob = rf_clf.predict_proba(X_test_scaled)[:, 1]
    
    results['mortality_classification']['random_forest'] = {
        'model': rf_clf,
        'accuracy': accuracy_score(y_mort_test, rf_pred),
        'auroc': roc_auc_score(y_mort_test, rf_prob),
        'precision': precision_score(y_mort_test, rf_pred),
        'recall': recall_score(y_mort_test, rf_pred),
        'f1': f1_score(y_mort_test, rf_pred),
        'feature_importance': dict(zip(X.columns, rf_clf.feature_importances_))
    }
    
    # KNN Classifier
    knn_clf = KNeighborsClassifier(n_neighbors=5)
    knn_clf.fit(X_train_scaled, y_mort_train)
    knn_pred = knn_clf.predict(X_test_scaled)
    knn_prob = knn_clf.predict_proba(X_test_scaled)[:, 1]
    
    results['mortality_classification']['knn'] = {
        'model': knn_clf,
        'accuracy': accuracy_score(y_mort_test, knn_pred),
        'auroc': roc_auc_score(y_mort_test, knn_prob),
        'precision': precision_score(y_mort_test, knn_pred),
        'recall': recall_score(y_mort_test, knn_pred),
        'f1': f1_score(y_mort_test, knn_pred)
    }
    
    # XGBoost Classifier
    xgb_clf = xgb.XGBClassifier(n_estimators=100, random_state=42)
    xgb_clf.fit(X_train_scaled, y_mort_train)
    xgb_pred = xgb_clf.predict(X_test_scaled)
    xgb_prob = xgb_clf.predict_proba(X_test_scaled)[:, 1]
    
    results['mortality_classification']['xgboost'] = {
        'model': xgb_clf,
        'accuracy': accuracy_score(y_mort_test, xgb_pred),
        'auroc': roc_auc_score(y_mort_test, xgb_prob),
        'precision': precision_score(y_mort_test, xgb_pred),
        'recall': recall_score(y_mort_test, xgb_pred),
        'f1': f1_score(y_mort_test, xgb_pred),
        'feature_importance': dict(zip(X.columns, xgb_clf.feature_importances_))
    }
    
    # Logistic Regression
    lr_clf = LogisticRegression(random_state=42, max_iter=1000)
    lr_clf.fit(X_train_scaled, y_mort_train)
    lr_pred = lr_clf.predict(X_test_scaled)
    lr_prob = lr_clf.predict_proba(X_test_scaled)[:, 1]
    
    results['mortality_classification']['logistic_regression'] = {
        'model': lr_clf,
        'accuracy': accuracy_score(y_mort_test, lr_pred),
        'auroc': roc_auc_score(y_mort_test, lr_prob),
        'precision': precision_score(y_mort_test, lr_pred),
        'recall': recall_score(y_mort_test, lr_pred),
        'f1': f1_score(y_mort_test, lr_pred),
        'coefficients': dict(zip(X.columns, lr_clf.coef_[0]))
    }
    
    # Train mortality rate regression models
    
    # Random Forest Regressor
    rf_reg = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_reg.fit(X_train_scaled, y_rate_train)
    rf_rate_pred = rf_reg.predict(X_test_scaled)
    
    results['mortality_rate_regression']['random_forest'] = {
        'model': rf_reg,
        'mse': mean_squared_error(y_rate_test, rf_rate_pred),
        'r2': r2_score(y_rate_test, rf_rate_pred),
        'feature_importance': dict(zip(X.columns, rf_reg.feature_importances_))
    }
    
    # KNN Regressor
    knn_reg = KNeighborsRegressor(n_neighbors=5)
    knn_reg.fit(X_train_scaled, y_rate_train)
    knn_rate_pred = knn_reg.predict(X_test_scaled)
    
    results['mortality_rate_regression']['knn'] = {
        'model': knn_reg,
        'mse': mean_squared_error(y_rate_test, knn_rate_pred),
        'r2': r2_score(y_rate_test, knn_rate_pred)
    }
    
    # XGBoost Regressor
    xgb_reg = xgb.XGBRegressor(n_estimators=100, random_state=42)
    xgb_reg.fit(X_train_scaled, y_rate_train)
    xgb_rate_pred = xgb_reg.predict(X_test_scaled)
    
    results['mortality_rate_regression']['xgboost'] = {
        'model': xgb_reg,
        'mse': mean_squared_error(y_rate_test, xgb_rate_pred),
        'r2': r2_score(y_rate_test, xgb_rate_pred),
        'feature_importance': dict(zip(X.columns, xgb_reg.feature_importances_))
    }
    
    # Linear Regression
    lr_reg = LinearRegression()
    lr_reg.fit(X_train_scaled, y_rate_train)
    lr_rate_pred = lr_reg.predict(X_test_scaled)
    
    results['mortality_rate_regression']['linear_regression'] = {
        'model': lr_reg,
        'mse': mean_squared_error(y_rate_test, lr_rate_pred),
        'r2': r2_score(y_rate_test, lr_rate_pred),
        'coefficients': dict(zip(X.columns, lr_reg.coef_))
    }
    
    # Train length of stay regression models
    
    # Random Forest Regressor for LOS
    rf_los = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_los.fit(X_train_scaled, y_los_train)
    rf_los_pred = rf_los.predict(X_test_scaled)
    
    results['length_of_stay_regression']['random_forest'] = {
        'model': rf_los,
        'mse': mean_squared_error(y_los_test, rf_los_pred),
        'r2': r2_score(y_los_test, rf_los_pred),
        'feature_importance': dict(zip(X.columns, rf_los.feature_importances_))
    }
    
    # KNN Regressor for LOS
    knn_los = KNeighborsRegressor(n_neighbors=5)
    knn_los.fit(X_train_scaled, y_los_train)
    knn_los_pred = knn_los.predict(X_test_scaled)
    
    results['length_of_stay_regression']['knn'] = {
        'model': knn_los,
        'mse': mean_squared_error(y_los_test, knn_los_pred),
        'r2': r2_score(y_los_test, knn_los_pred)
    }
    
    # XGBoost Regressor for LOS
    xgb_los = xgb.XGBRegressor(n_estimators=100, random_state=42)
    xgb_los.fit(X_train_scaled, y_los_train)
    xgb_los_pred = xgb_los.predict(X_test_scaled)
    
    results['length_of_stay_regression']['xgboost'] = {
        'model': xgb_los,
        'mse': mean_squared_error(y_los_test, xgb_los_pred),
        'r2': r2_score(y_los_test, xgb_los_pred),
        'feature_importance': dict(zip(X.columns, xgb_los.feature_importances_))
    }
    
    # Linear Regression for LOS
    lr_los = LinearRegression()
    lr_los.fit(X_train_scaled, y_los_train)
    lr_los_pred = lr_los.predict(X_test_scaled)
    
    results['length_of_stay_regression']['linear_regression'] = {
        'model': lr_los,
        'mse': mean_squared_error(y_los_test, lr_los_pred),
        'r2': r2_score(y_los_test, lr_los_pred),
        'coefficients': dict(zip(X.columns, lr_los.coef_))
    }
    
    # Prepare performance metrics for JSON serialization
    perf_metrics = {
        'mortality_classification': {},
        'mortality_rate_regression': {},
        'length_of_stay_regression': {}
    }
    
    for task in ['mortality_classification', 'mortality_rate_regression', 'length_of_stay_regression']:
        for model_name, model_data in results[task].items():
            perf_metrics[task][model_name] = {k: v for k, v in model_data.items() 
                                             if k not in ['model', 'coefficients', 'feature_importance']}
            
            # Add feature importance or coefficients if available
            if 'feature_importance' in model_data:
                # Convert numpy values to Python float for JSON serialization
                perf_metrics[task][model_name]['feature_importance'] = {
                    k: float(v) for k, v in model_data['feature_importance'].items()
                }
            elif 'coefficients' in model_data:
                perf_metrics[task][model_name]['coefficients'] = {
                    k: float(v) for k, v in model_data['coefficients'].items()
                }
    
    return results, perf_metrics

def save_models(results, output_dir='models'):
    """
    Save trained models and metrics to files
    
    Parameters:
    results (dict): Dictionary containing models and performance metrics
    output_dir (str): Directory to save models
    
    Returns:
    None
    """
    # Create output directory if not exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Save scaler
    with open(f"{output_dir}/scaler.pkl", "wb") as f:
        pickle.dump(results['scaler'], f)
    
    # Save feature names
    with open(f"{output_dir}/feature_names.json", "w") as f:
        json.dump(results['feature_names'], f)
    
    # Save models
    for task in ['mortality_classification', 'mortality_rate_regression', 'length_of_stay_regression']:
        os.makedirs(f"{output_dir}/{task}", exist_ok=True)
        
        for model_name, model_data in results[task].items():
            with open(f"{output_dir}/{task}/{model_name}.pkl", "wb") as f:
                pickle.dump(model_data['model'], f)
    
    print(f"Models saved to {output_dir}")

def save_metrics(metrics, output_file='models/performance_metrics.json'):
    """
    Save performance metrics to a JSON file
    
    Parameters:
    metrics (dict): Dictionary containing performance metrics
    output_file (str): Output JSON file
    
    Returns:
    None
    """
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"Performance metrics saved to {output_file}")

if __name__ == "__main__":
    data = generate_sample_data(500)
    results, metrics = train_models(data)
    save_models(results)
    save_metrics(metrics)
