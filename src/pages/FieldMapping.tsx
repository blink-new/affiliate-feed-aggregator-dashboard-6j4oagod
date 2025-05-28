import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileJson, ArrowRight, ArrowDown, RefreshCw, Check, Plus, X, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'react-hot-toast';
import { useFileStore } from '../store/fileStore';
import { useSchemaStore } from '../store/schemaStore';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';

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

// Interface for custom field mapping
interface CustomField {
  id: string;
  name: string;
  sourceField: string;
}

export function FieldMapping() {
  const navigate = useNavigate();
  const fileStore = useFileStore();
  const historyStore = useHistoryStore();
  const location = useLocation();
  
  // Use the source fields from the file store instead of hardcoded values
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  
  // Custom fields state 
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [nextCustomId, setNextCustomId] = useState(1);
  
  // State to track unmapped source fields
  const [unmappedSourceFields, setUnmappedSourceFields] = useState<string[]>([]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'mapping' | 'history'>('mapping');

  // Get mapping history from history store
  const mappingHistory = historyStore.mappingHistory;
  
  // Get the file data from the store
  useEffect(() => {
    // If no file data is available, redirect back to upload page
    if (!fileStore.fileData) {
      toast.error('No file data found. Please upload a file first.');
      navigate('/');
      return;
    }
    
    // Set the source fields from the file data
    setSourceFields(fileStore.fileData.headers);
  }, [fileStore.fileData, navigate]);

  const [mappings, setMappings] = useState<Record<string, string>>(
    targetFields.reduce((acc, field) => {
      // Try to find a matching field in the source
      const matchingField = sourceFields.find(source => 
        source.toLowerCase().includes(field.name.toLowerCase()) || 
        field.name.toLowerCase().includes(source.toLowerCase())
      );
      
      acc[field.name] = matchingField || "not_mapped";
      return acc;
    }, {} as Record<string, string>)
  );
  
  // Update mappings when source fields change
  useEffect(() => {
    if (sourceFields.length > 0) {
      setMappings(prev => {
        const updated = { ...prev };
        
        // Update existing mappings with available source fields
        Object.keys(updated).forEach(targetField => {
          if (!sourceFields.includes(updated[targetField]) && updated[targetField] !== "not_mapped") {
            // If the previously mapped field is no longer available, reset it
            updated[targetField] = "not_mapped";
          }
        });
        
        return updated;
      });
      
      // Calculate unmapped source fields
      updateUnmappedSourceFields();
    }
  }, [sourceFields]);
  
  // Update unmapped source fields when mappings change
  useEffect(() => {
    if (sourceFields.length > 0) {
      updateUnmappedSourceFields();
    }
  }, [mappings, customFields]);
  
  // Function to update unmapped source fields
  const updateUnmappedSourceFields = () => {
    const mappedFields = Object.values(mappings).filter(val => val !== "not_mapped");
    const customMappedFields = customFields.map(cf => cf.sourceField);
    const allMappedFields = [...mappedFields, ...customMappedFields];
    
    // Find source fields that aren't mapped anywhere
    const unmapped = sourceFields.filter(field => !allMappedFields.includes(field));
    setUnmappedSourceFields(unmapped);
  };

  const handleFieldMapping = (targetField: string, sourceField: string) => {
    setMappings(prev => ({
      ...prev,
      [targetField]: sourceField
    }));
  };
  
  // Handle adding a new custom field
  const handleAddCustomField = () => {
    // Create a new custom field with a default name
    const newField: CustomField = {
      id: `custom-${nextCustomId}`,
      name: `custom_field_${nextCustomId}`,
      sourceField: "not_mapped"
    };
    
    setCustomFields(prev => [...prev, newField]);
    setNextCustomId(prev => prev + 1);
  };
  
  // Handle updating a custom field
  const handleCustomFieldUpdate = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };
  
  // Handle removing a custom field
  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
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
    const missingFields = requiredFields.filter(field => !mappings[field] || mappings[field] === "not_mapped");
    
    if (missingFields.length > 0) {
      toast.error(`Please map required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Create a combined mappings object including custom fields
    const combinedMappings = { ...mappings };
    
    // Add custom fields to a __custom property
    if (customFields.length > 0) {
      combinedMappings['__custom'] = customFields.reduce((acc, field) => {
        if (field.sourceField && field.sourceField !== "not_mapped") {
          acc[field.name] = field.sourceField;
        }
        return acc;
      }, {} as Record<string, string>);
    }
    
    // Save the field mappings to the schema store to generate the initial schema
    useSchemaStore.getState().generateInitialSchema(combinedMappings, sourceFields);
    
    // Add to mapping history
    historyStore.addMappingHistory({
      name: `${fileStore.file?.name || 'Unknown file'} Mapping`,
      sourceFields,
      mappings,
      customFields,
      unmappedFields: unmappedSourceFields
    });
    
    toast.success('Field mappings saved successfully!');
    
    // Navigate to next step
    navigate('/schema');
  };

  const loadHistoricalMapping = (historyId: string) => {
    const historicalMapping = historyStore.getMappingHistory(historyId);
    if (!historicalMapping) {
      toast.error('Unable to load historical mapping data');
      return;
    }

    // Set the mappings from history
    setMappings(historicalMapping.mappings);
    
    // Set the custom fields from history
    setCustomFields(historicalMapping.customFields);
    
    // Calculate next custom ID
    if (historicalMapping.customFields.length > 0) {
      // Extract numeric part from last custom ID and increment
      const lastId = historicalMapping.customFields[historicalMapping.customFields.length - 1].id;
      const match = lastId.match(/\d+$/);
      if (match) {
        setNextCustomId(parseInt(match[0]) + 1);
      }
    }
    
    toast.success(`Loaded historical mapping: ${historicalMapping.name}`);
    setActiveTab('mapping');
  };

  return (
    <div className="space-y-8">
      {mappingHistory.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Past Field Mappings</h2>
          <div className="flex flex-wrap gap-3">
            {mappingHistory.map((item) => (
              <button
                key={item.id}
                className="px-4 py-2 rounded-md border bg-muted hover:bg-primary/10 transition text-sm font-medium"
                onClick={() => navigate(`/mapping?mappingId=${item.id}`)}
              >
                {item.name} <span className="ml-2 text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
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

      <Tabs defaultValue="mapping" value={activeTab} onValueChange={(v) => setActiveTab(v as 'mapping' | 'history')}>
        <TabsList>
          <TabsTrigger value="mapping" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            Current Mapping
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Mapping History
            {mappingHistory.length > 0 && (
              <Badge variant="secondary" className="ml-2">{mappingHistory.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">{sourceFields.length}</Badge>
              source fields detected
            </div>
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
                <CardTitle>Standard Fields</CardTitle>
                <CardDescription>
                  Map core product fields to your feed's data structure
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
                            <SelectItem value="not_mapped">Not mapped</SelectItem>
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
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Custom Fields</CardTitle>
                  <CardDescription>
                    Map additional fields from your source data
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddCustomField}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Field
                </Button>
              </CardHeader>
              <CardContent>
                {customFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No custom fields defined yet. Click "Add Custom Field" to create one.</p>
                    {unmappedSourceFields.length > 0 && (
                      <p className="mt-2 text-sm">
                        You have {unmappedSourceFields.length} unmapped source fields available.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customFields.map((field) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3 rounded-md border hover:bg-muted/40 transition-colors"
                      >
                        <div className="md:col-span-5">
                          <Input
                            value={field.name}
                            onChange={(e) => handleCustomFieldUpdate(field.id, { name: e.target.value })}
                            placeholder="Custom field name"
                            className="h-9"
                          />
                        </div>

                        <div className="md:col-span-2 flex justify-center">
                          <ArrowDown className="h-5 w-5 text-muted-foreground md:hidden" />
                          <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                        </div>

                        <div className="md:col-span-4">
                          <Select
                            value={field.sourceField}
                            onValueChange={(value) => handleCustomFieldUpdate(field.id, { sourceField: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select source field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_mapped">Not mapped</SelectItem>
                              {sourceFields.map((source) => (
                                <SelectItem key={source} value={source}>
                                  {source}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCustomField(field.id)}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {unmappedSourceFields.length > 0 && (
                <CardFooter className="flex flex-col items-start border-t pt-6">
                  <h4 className="text-sm font-medium mb-2">Unmapped Source Fields ({unmappedSourceFields.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {unmappedSourceFields.map(field => (
                      <Badge key={field} variant="secondary" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              )}
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
                    .filter(([_targetField, sourceField]) => sourceField && sourceField !== "not_mapped")
                    .map(([targetField, sourceField]) => (
                      <div key={targetField} className="grid grid-cols-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <div className="p-3 text-sm border-r truncate">{sourceField}</div>
                        <div className="p-3 text-sm flex items-center gap-2">
                          <span>{targetField}</span>
                          <Check className="h-3 w-3 text-green-500" />
                        </div>
                      </div>
                    ))}
                  
                  {/* Add custom fields to the preview */}
                  {customFields
                    .filter(field => field.sourceField && field.sourceField !== "not_mapped")
                    .map(field => (
                      <div key={field.id} className="grid grid-cols-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <div className="p-3 text-sm border-r truncate">{field.sourceField}</div>
                        <div className="p-3 text-sm flex items-center gap-2">
                          <span>{field.name}</span>
                          <Badge variant="outline" className="text-[10px] h-4 ml-1">Custom</Badge>
                          <Check className="h-3 w-3 text-green-500" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    {Object.values(mappings).filter(value => value && value !== "not_mapped").length} standard
                  </span>
                  +
                  <span className="font-medium ml-1">
                    {customFields.filter(field => field.sourceField && field.sourceField !== "not_mapped").length} custom
                  </span>
                  fields mapped
                </div>
                <Button onClick={handleContinue} className="gap-2">
                  Continue to Schema Design
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Mapping History
              </CardTitle>
              <CardDescription>
                Previously saved field mappings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mappingHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No mapping history found.</p>
                  <p className="mt-2 text-sm">
                    Your field mapping history will appear here once you've mapped fields and continued to the next step.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mappingHistory.map((record) => (
                    <div 
                      key={record.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border hover:bg-muted/30 transition-colors gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="h-10 w-10 rounded-md border bg-background flex items-center justify-center">
                          <FileJson className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{record.name}</p>
                          <div className="flex items-center mt-1 gap-3">
                            <Badge variant="outline" className="text-xs">
                              {record.sourceFields.length} Source Fields
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {Object.values(record.mappings).filter(v => v && v !== "not_mapped").length} Mappings
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => loadHistoricalMapping(record.id)}
                      >
                        Load This Mapping
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {mappingHistory.length > 0 && (
              <CardFooter className="border-t pt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all mapping history?')) {
                      historyStore.clearHistory('mapping');
                      toast.success('Mapping history cleared');
                    }
                  }}
                >
                  Clear History
                </Button>
              </CardFooter>
            )}
          </Card>

          {mappingHistory.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Last Mapping Preview
                </CardTitle>
                <CardDescription>
                  Preview of your most recent field mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-2 border-b bg-muted/30">
                    <div className="p-3 font-medium text-sm border-r">Source Field</div>
                    <div className="p-3 font-medium text-sm">Target Field</div>
                  </div>
                  {Object.entries(mappingHistory[0].mappings)
                    .filter(([_targetField, sourceField]) => sourceField && sourceField !== "not_mapped")
                    .map(([targetField, sourceField]) => (
                      <div key={targetField} className="grid grid-cols-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <div className="p-3 text-sm border-r truncate">{sourceField}</div>
                        <div className="p-3 text-sm">{targetField}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}