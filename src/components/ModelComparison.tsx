
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Types for the performance metrics
type ModelMetricsProps = {
  metrics: {
    mortality_classification: Record<string, any>;
    mortality_rate_regression: Record<string, any>;
    length_of_stay_regression: Record<string, any>;
  };
};

const ModelComparison: React.FC<ModelMetricsProps> = ({ metrics }) => {
  const [selectedTask, setSelectedTask] = useState('mortality_classification');
  
  // Function to format the task name for display
  const formatTaskName = (task: string) => {
    switch (task) {
      case 'mortality_classification':
        return 'Mortality Classification';
      case 'mortality_rate_regression':
        return 'Mortality Rate Regression';
      case 'length_of_stay_regression':
        return 'Length of Stay Regression';
      default:
        return task;
    }
  };
  
  // Prepare data for classification metrics bar chart
  const prepareClassificationData = () => {
    const modelNames = Object.keys(metrics.mortality_classification);
    
    return [
      {
        name: 'Accuracy',
        ...modelNames.reduce((acc, model) => ({
          ...acc,
          [model]: parseFloat(metrics.mortality_classification[model].accuracy?.toFixed(3) || "0")
        }), {})
      },
      {
        name: 'AUROC',
        ...modelNames.reduce((acc, model) => ({
          ...acc,
          [model]: parseFloat(metrics.mortality_classification[model].auroc?.toFixed(3) || "0")
        }), {})
      },
      {
        name: 'F1 Score',
        ...modelNames.reduce((acc, model) => ({
          ...acc,
          [model]: parseFloat(metrics.mortality_classification[model].f1?.toFixed(3) || "0")
        }), {})
      }
    ];
  };
  
  // Prepare data for regression metrics bar chart
  const prepareRegressionData = (taskKey: string) => {
    const modelNames = Object.keys(metrics[taskKey as keyof typeof metrics]);
    
    const mseSeries = {
      name: 'MSE',
      ...modelNames.reduce((acc, model) => ({
        ...acc,
        [model]: parseFloat(metrics[taskKey as keyof typeof metrics][model].mse?.toFixed(3) || "0")
      }), {})
    };
    
    const r2Series = {
      name: 'R²',
      ...modelNames.reduce((acc, model) => ({
        ...acc,
        [model]: parseFloat(metrics[taskKey as keyof typeof metrics][model].r2?.toFixed(3) || "0")
      }), {})
    };
    
    return [mseSeries, r2Series];
  };
  
  // Prepare data for radar chart
  const prepareRadarData = () => {
    const tasks = ['mortality_classification', 'mortality_rate_regression', 'length_of_stay_regression'];
    const modelNames = ['random_forest', 'knn', 'xgboost', 'logistic_regression'];
    
    return modelNames.map(model => {
      const radarPoint: any = { model: model.replace('_', ' ') };
      
      // For classification, use accuracy
      if (metrics.mortality_classification[model]) {
        radarPoint.mortality = parseFloat(metrics.mortality_classification[model].accuracy?.toFixed(3) || "0") * 100;
      }
      
      // For regression tasks, use R²
      if (metrics.mortality_rate_regression[model]) {
        radarPoint.mortality_rate = parseFloat(metrics.mortality_rate_regression[model].r2?.toFixed(3) || "0") * 100;
      }
      
      if (metrics.length_of_stay_regression[model]) {
        radarPoint.los = parseFloat(metrics.length_of_stay_regression[model].r2?.toFixed(3) || "0") * 100;
      }
      
      return radarPoint;
    });
  };

  // Find the best performing model for each task
  const getBestModel = (task: string) => {
    if (!metrics[task as keyof typeof metrics]) return '';
    
    let bestMetric = 0;
    let bestModel = '';
    
    Object.entries(metrics[task as keyof typeof metrics]).forEach(([model, modelMetrics]: [string, any]) => {
      const metricValue = task === 'mortality_classification' 
        ? modelMetrics.accuracy 
        : modelMetrics.r2;
      
      if (metricValue > bestMetric) {
        bestMetric = metricValue;
        bestModel = model;
      }
    });
    
    return bestModel;
  };

  // Determine which metrics to show based on the selected task
  const renderMetricsChart = () => {
    if (selectedTask === 'mortality_classification') {
      const data = prepareClassificationData();
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} tickFormatter={(value) => value.toFixed(1)} />
              <Tooltip formatter={(value) => {
                // Make sure value is a number before using toFixed
                return [typeof value === 'number' ? value.toFixed(3) : value, "Score"];
              }} />
              <Legend />
              <Bar dataKey="random_forest" name="Random Forest" fill="#3b82f6" />
              <Bar dataKey="knn" name="KNN" fill="#10b981" />
              <Bar dataKey="xgboost" name="XGBoost" fill="#f59e0b" />
              <Bar dataKey="logistic_regression" name="Logistic Regression" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else {
      // For regression tasks
      const data = prepareRegressionData(selectedTask);
      
      return (
        <>
          {/* R² Chart */}
          <div className="h-64 mb-8">
            <h3 className="text-lg font-semibold mb-2">R² Score (higher is better)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[data[1]]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} tickFormatter={(value) => value.toFixed(1)} />
                <Tooltip formatter={(value) => {
                  // Make sure value is a number before using toFixed
                  return [typeof value === 'number' ? value.toFixed(3) : value, "R²"];
                }} />
                <Legend />
                <Bar dataKey="random_forest" name="Random Forest" fill="#3b82f6" />
                <Bar dataKey="knn" name="KNN" fill="#10b981" />
                <Bar dataKey="xgboost" name="XGBoost" fill="#f59e0b" />
                <Bar dataKey="linear_regression" name="Linear Regression" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* MSE Chart */}
          <div className="h-64">
            <h3 className="text-lg font-semibold mb-2">Mean Squared Error (lower is better)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[data[0]]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => {
                  // Make sure value is a number before using toFixed
                  return [typeof value === 'number' ? value.toFixed(3) : value, "MSE"];
                }} />
                <Legend />
                <Bar dataKey="random_forest" name="Random Forest" fill="#3b82f6" />
                <Bar dataKey="knn" name="KNN" fill="#10b981" />
                <Bar dataKey="xgboost" name="XGBoost" fill="#f59e0b" />
                <Bar dataKey="linear_regression" name="Linear Regression" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Performance Comparison</CardTitle>
          <CardDescription>
            Compare the performance of different machine learning models across prediction tasks
          </CardDescription>
          <Tabs value={selectedTask} onValueChange={setSelectedTask} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mortality_classification">Mortality Classification</TabsTrigger>
              <TabsTrigger value="mortality_rate_regression">Mortality Rate</TabsTrigger>
              <TabsTrigger value="length_of_stay_regression">Length of Stay</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {formatTaskName(selectedTask)} Metrics
              </h3>
              <Badge className="bg-blue-600">
                Best Model: {getBestModel(selectedTask).replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          {renderMetricsChart()}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Model Performance Radar</CardTitle>
          <CardDescription>
            Overall model performance across all three prediction tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={150} data={prepareRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="model" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Tooltip formatter={(value) => {
                  // Make sure value is a number before using toFixed
                  return [typeof value === 'number' ? value.toFixed(1) + '%' : value, "Performance"];
                }} />
                <Radar name="Mortality Classification" dataKey="mortality" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Mortality Rate Prediction" dataKey="mortality_rate" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Radar name="Length of Stay Prediction" dataKey="los" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelComparison;
