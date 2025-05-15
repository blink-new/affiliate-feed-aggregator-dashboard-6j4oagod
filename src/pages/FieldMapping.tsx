import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileJson, ArrowRight, ArrowDown, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'react-hot-toast';

// Mock source data fields
const sourceFields = [
  'id', 'product_name', 'description', 'price', 'currency', 'category', 'image_url', 'affiliate_link'
];

// Target schema fields with descriptions
const targetFields = [
  { name: 'id', description: 'Unique product identifier', required: true },
  { name: 'title', description: 'Product title/name', required: true },
  { name: 'description', description: 'Product description', required: false },
  { name: 'price', description: 'Numeric price value', required: true },
  { name: 'currency', description: 'Price currency code', required: true },
  { name: 'category', description: 'Product category', required: true },
  { name: 'image', description: 'Product image URL', required: false },
  { name: 'link', description: 'Affiliate link URL', required: true },
  { name: 'brand', description: 'Product brand name', required: false },
  { name: 'availability', description: 'In stock status', required: false },
];

export function FieldMapping() {
  const [mappings, setMappings] = useState<Record<string, string>>({
    'id': 'id',
    'title': 'product_name',
    'description': 'description',
    'price': 'price',
    'currency': 'currency',
    'category': 'category',
    'image': 'image_url',
    'link': 'affiliate_link',
    'brand': '',
    'availability': '',
  });
  const navigate = useNavigate();

  const handleFieldMapping = (targetField: string, sourceField: string) => {
    setMappings(prev => ({
      ...prev,
      [targetField]: sourceField
    }));
  };

  const handleAutoMap = () => {
    // Simple algorithm to auto-map fields based on name similarity
    const newMappings = { ...mappings };
    
    targetFields.forEach(target => {
      // Try to find a matching source field
      const matchingField = sourceFields.find(source => 
        source.toLowerCase().includes(target.name.toLowerCase()) || 
        target.name.toLowerCase().includes(source.toLowerCase())
      );
      
      if (matchingField) {
        newMappings[target.name] = matchingField;
      }
    });
    
    setMappings(newMappings);
    toast.success('Fields auto-mapped successfully!');
  };

  const handleContinue = () => {
    // Check if all required fields are mapped
    const requiredFields = targetFields.filter(f => f.required).map(f => f.name);
    const missingFields = requiredFields.filter(field => !mappings[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please map required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Navigate to next step
    navigate('/schema');
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileJson className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Field Mapping</h1>
        </div>
        <p className="text-muted-foreground">
          Map fields from your source feed to your target schema.
        </p>
      </motion.div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAutoMap}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Auto-Map Fields
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Map Your Fields</CardTitle>
            <CardDescription>
              Select source fields to map to your target schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {targetFields.map((field) => (
                <div 
                  key={field.name}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3 rounded-md hover:bg-muted/40 transition-colors"
                >
                  <div className="md:col-span-5 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{field.name}</span>
                      {field.required && (
                        <Badge variant="outline" className="text-[10px] h-4">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-center">
                    <ArrowDown className="h-5 w-5 text-muted-foreground md:hidden" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                  </div>
                  
                  <div className="md:col-span-5">
                    <Select
                      value={mappings[field.name]}
                      onValueChange={(value) => handleFieldMapping(field.name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not mapped</SelectItem>
                        {sourceFields.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              {Object.values(mappings).filter(Boolean).length} of {targetFields.length} fields mapped
            </div>
            <Button onClick={handleContinue} className="gap-2">
              Continue to Schema Design
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mapping Preview</CardTitle>
            <CardDescription>
              How your feed data will be transformed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-2 border-b bg-muted/30">
                <div className="p-3 font-medium text-sm border-r">Source Field</div>
                <div className="p-3 font-medium text-sm">Target Field</div>
              </div>
              {Object.entries(mappings)
                .filter(([_, sourceField]) => sourceField)
                .map(([targetField, sourceField]) => (
                  <div key={targetField} className="grid grid-cols-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <div className="p-3 text-sm border-r truncate">{sourceField}</div>
                    <div className="p-3 text-sm flex items-center gap-2">
                      <span>{targetField}</span>
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}