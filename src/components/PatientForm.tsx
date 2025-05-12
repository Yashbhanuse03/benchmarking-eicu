
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const patientSchema = z.object({
  age: z.coerce.number().min(18, "Age must be at least 18").max(120, "Age must be 120 or less"),
  gender: z.coerce.number().min(0).max(1),
  heart_rate: z.coerce.number().min(30, "Heart rate must be at least 30").max(220, "Heart rate must be 220 or less"),
  systolic_bp: z.coerce.number().min(50, "Systolic BP must be at least 50").max(250, "Systolic BP must be 250 or less"),
  diastolic_bp: z.coerce.number().min(30, "Diastolic BP must be at least 30").max(150, "Diastolic BP must be 150 or less"),
  respiration_rate: z.coerce.number().min(4, "Respiration rate must be at least 4").max(60, "Respiration rate must be 60 or less"),
  temperature: z.coerce.number().min(32, "Temperature must be at least 32°C").max(43, "Temperature must be 43°C or less"),
  oxygen_saturation: z.coerce.number().min(50, "Oxygen saturation must be at least 50%").max(100, "Oxygen saturation cannot exceed 100%"),
  wbc_count: z.coerce.number().min(0.5, "WBC count must be at least 0.5").max(50, "WBC count must be 50 or less"),
  hemoglobin: z.coerce.number().min(3, "Hemoglobin must be at least 3").max(25, "Hemoglobin must be 25 or less"),
  platelet_count: z.coerce.number().min(5, "Platelet count must be at least 5").max(1000, "Platelet count must be 1000 or less"),
  sodium: z.coerce.number().min(110, "Sodium must be at least 110").max(180, "Sodium must be 180 or less"),
  potassium: z.coerce.number().min(2, "Potassium must be at least 2").max(9, "Potassium must be 9 or less"),
  creatinine: z.coerce.number().min(0.2, "Creatinine must be at least 0.2").max(20, "Creatinine must be 20 or less"),
  diabetes: z.coerce.number().min(0).max(1),
  hypertension: z.coerce.number().min(0).max(1),
  copd: z.coerce.number().min(0).max(1),
  asthma: z.coerce.number().min(0).max(1),
  chf: z.coerce.number().min(0).max(1),
  ckd: z.coerce.number().min(0).max(1),
  cancer: z.coerce.number().min(0).max(1),
  admission_type: z.string().min(1, "Admission type is required"),
});

type PatientFormProps = {
  initialValues: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
};

const PatientForm: React.FC<PatientFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Demographics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Female</SelectItem>
                        <SelectItem value="1">Male</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="admission_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select admission type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Elective">Elective</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Vital Signs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heart_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Rate (bpm)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="respiration_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respiration Rate</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="systolic_bp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic BP (mmHg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="diastolic_bp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diastolic BP (mmHg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="oxygen_saturation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oxygen Saturation (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lab Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wbc_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WBC Count</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hemoglobin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hemoglobin (g/dL)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platelet_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platelet Count</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sodium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sodium (mmol/L)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="potassium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potassium (mmol/L)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="creatinine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creatinine (mg/dL)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Comorbidities</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="diabetes"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value === 1} 
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Diabetes</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hypertension"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value === 1} 
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hypertension</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="copd"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value === 1} 
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>COPD</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="asthma"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value === 1} 
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Asthma</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chf"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value === 1} 
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>CHF</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ckd"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value === 1} 
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>CKD</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="cancer"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value === 1} 
                      onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cancer</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              'Predict Patient Outcomes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PatientForm;
