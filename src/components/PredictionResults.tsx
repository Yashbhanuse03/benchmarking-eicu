
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const RISK_COLORS = {
  low: '#22c55e',       // green-500
  moderate: '#f59e0b',  // amber-500
  high: '#ef4444',      // red-500
};

type PredictionResultsProps = {
  predictions: any;
};

const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions }) => {
  const [selectedModel, setSelectedModel] = useState('random_forest');
  
  // Get the selected model's mortality probability
  const mortalityProb = predictions.mortality_classification[selectedModel].probability * 100;
  
  // Get the selected model's length of stay prediction
  const lengthOfStay = Math.round(predictions.length_of_stay_regression[selectedModel]);
  
  // Determine risk level based on mortality probability
  const getRiskLevel = (probability: number) => {
    if (probability < 25) return 'low';
    if (probability < 50) return 'moderate';
    return 'high';
  };
  
  const riskLevel = getRiskLevel(mortalityProb);
  const riskColor = RISK_COLORS[riskLevel as keyof typeof RISK_COLORS];
  
  // Prepare data for the mortality risk pie chart
  const mortalityPieData = [
    { name: 'Mortality Risk', value: mortalityProb },
    { name: 'Survival Chance', value: 100 - mortalityProb }
  ];

  // Prepare data for model comparison bar chart
  const modelComparisonData = [
    { 
      name: 'Random Forest', 
      mortality: parseFloat((predictions.mortality_classification.random_forest.probability * 100).toFixed(1)),
      los: predictions.length_of_stay_regression.random_forest
    },
    { 
      name: 'KNN', 
      mortality: parseFloat((predictions.mortality_classification.knn.probability * 100).toFixed(1)),
      los: predictions.length_of_stay_regression.knn
    },
    { 
      name: 'XGBoost', 
      mortality: parseFloat((predictions.mortality_classification.xgboost.probability * 100).toFixed(1)),
      los: predictions.length_of_stay_regression.xgboost
    },
    { 
      name: 'Log/Lin Reg', 
      mortality: parseFloat((predictions.mortality_classification.logistic_regression.probability * 100).toFixed(1)),
      los: predictions.length_of_stay_regression.linear_regression
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mortality Risk Card */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Mortality Risk
            </CardTitle>
            <CardDescription>Predicted probability of mortality</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mortalityPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell key="mortality" fill={riskColor} />
                      <Cell key="survival" fill="#e5e7eb" />
                    </Pie>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                    >
                      {mortalityProb.toFixed(1)}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <Badge 
                className="mb-2 py-1 px-3 text-sm" 
                style={{ backgroundColor: riskColor, color: 'white' }}
              >
                {riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-center">
            <div className="text-sm text-gray-500">
              Based on {selectedModel.replace('_', ' ')} prediction
            </div>
          </CardFooter>
        </Card>
        
        {/* Length of Stay Card */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Length of Stay
            </CardTitle>
            <CardDescription>Predicted hospital duration</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col items-center justify-center" style={{ height: "250px" }}>
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {lengthOfStay}
              </div>
              <div className="text-lg text-gray-600">
                {lengthOfStay === 1 ? 'day' : 'days'}
              </div>
              
              {lengthOfStay > 14 && (
                <Badge className="mt-4 bg-amber-500">Extended Stay</Badge>
              )}
              
              {lengthOfStay > 30 && (
                <Badge className="mt-2 bg-red-500">Prolonged Hospitalization</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-center">
            <div className="text-sm text-gray-500">
              Based on {selectedModel.replace('_', ' ')} prediction
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
          <CardDescription>Compare predictions across different models</CardDescription>
          <div className="mt-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random_forest">Random Forest</SelectItem>
                <SelectItem value="knn">KNN</SelectItem>
                <SelectItem value="xgboost">XGBoost</SelectItem>
                <SelectItem value="logistic_regression">Logistic Regression</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mortality">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mortality">Mortality Risk</TabsTrigger>
              <TabsTrigger value="los">Length of Stay</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mortality" className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modelComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Mortality Risk (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Mortality Risk']} />
                    <Legend />
                    <Bar dataKey="mortality" fill="#3b82f6" name="Mortality Risk (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="los" className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modelComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)} days`, 'Length of Stay']} />
                    <Legend />
                    <Bar dataKey="los" fill="#10b981" name="Length of Stay (days)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResults;
