import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, PlusCircle, X, ArrowRight, Braces, Tag, Wand2, ListFilter, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useSchemaStore, SchemaField, CategoryMapping } from '../store/schemaStore';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';

// Mock data for categories
const categorySuggestions = [
  'Electronics',
  'Electronics > Audio',
  'Electronics > Audio > Headphones',
  'Electronics > Wearables',
  'Electronics > Wearables > Smartwatches',
  'Clothing',
  'Clothing > Tops',
  'Clothing > Tops > T-Shirts',
  'Home & Garden',
  'Home & Garden > Kitchen',
  'Home & Garden > Kitchen > Appliances',
];

export function SchemaDesign() {
  const navigate = useNavigate();
  const schemaStore = useSchemaStore();
  const historyStore = useHistoryStore();
  
  // Local state for new field
  const [newField, setNewField] = useState<SchemaField>({ 
    name: '', 
    type: 'string', 
    required: false 
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState<'fields' | 'categories' | 'unmapped' | 'history'>('fields');

  // Get schema history
  const schemaHistory = historyStore.schemaHistory;

  // Initialize state from schema store
  useEffect(() => {
    // If fields are empty, use default ones (should be populated from field mapping)
    if (schemaStore.fields.length === 0) {
      // This will use the default fields defined in the store
      schemaStore.generateInitialSchema({}, []);
    }
    
    // Initialize category mappings if empty
    if (schemaStore.categoryMappings.length === 0) {
      // Create initial category mappings from suggestions
      const initialMappings = categorySuggestions.map(category => {
        // Format based on current settings
        const targetCategory = schemaStore.categoryFormat === 'hierarchical'
          ? category.replace(/\s*>\s*/g, schemaStore.categorySeparator)
          : category.split('>').pop()?.trim() || '';
          
        return {
          sourceCategory: category,
          targetCategory
        };
      });
      
      schemaStore.setCategoryMappings(initialMappings);
    }
  }, [schemaStore]);

  const handleAddField = () => {
    if (!newField.name) {
      toast.error('Field name is required');
      return;
    }
    
    if (schemaStore.fields.some(f => f.name === newField.name)) {
      toast.error('Field name must be unique');
      return;
    }
    
    schemaStore.addField({
      ...newField,
      isCustomField: true // Mark as custom field
    });
    setNewField({ name: '', type: 'string', required: false });
    toast.success('Field added successfully!');
  };

  const handleRemoveField = (name: string) => {
    schemaStore.removeField(name);
  };

  const handleCategoryMappingChange = (sourceCategory: string, targetCategory: string) => {
    schemaStore.updateCategoryMapping(sourceCategory, targetCategory);
  };

  const handleAutoGenerateCategories = () => {
    // Get existing mappings
    const existingMappings = schemaStore.categoryMappings.reduce((acc, mapping) => {
      acc[mapping.sourceCategory] = mapping;
      return acc;
    }, {} as Record<string, CategoryMapping>);
    
    // Create new mappings or update existing ones
    const updatedMappings = categorySuggestions.map(category => {
      // If mapping already exists, use it as a base
      const existingMapping = existingMappings[category];
      
      // Format the target category based on current settings
      const targetCategory = schemaStore.categoryFormat === 'hierarchical'
        ? category.replace(/\s*>\s*/g, schemaStore.categorySeparator)
        : category.split('>').pop()?.trim() || '';
      
      return {
        sourceCategory: category,
        targetCategory: existingMapping?.targetCategory || targetCategory
      };
    });
    
    schemaStore.setCategoryMappings(updatedMappings);
    toast.success('Category mappings auto-generated!');
  };

  // Handle source field quick add from the unmapped fields list
  const handleQuickAddField = (sourceField: string) => {
    // Generate a field name based on the source field - clean it up
    const fieldName = sourceField
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_') // Replace non-alphanumeric with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    
    if (schemaStore.fields.some(f => f.name === fieldName)) {
      // Field already exists, try to append a number
      let counter = 1;
      let uniqueName = `${fieldName}_${counter}`;
      
      while (schemaStore.fields.some(f => f.name === uniqueName)) {
        counter++;
        uniqueName = `${fieldName}_${counter}`;
      }
      
      // Add the field with the unique name
      schemaStore.addField({
        name: uniqueName,
        type: 'string',
        required: false,
        sourceField,
        isCustomField: true,
        description: `Auto-generated from ${sourceField}`
      });
      
      toast.success(`Added field "${uniqueName}" mapped from "${sourceField}"`);
    } else {
      // Add the field directly
      schemaStore.addField({
        name: fieldName,
        type: 'string',
        required: false,
        sourceField,
        isCustomField: true,
        description: `Auto-generated from ${sourceField}`
      });
      
      toast.success(`Added field "${fieldName}" mapped from "${sourceField}"`);
    }
  };

  const handleContinue = () => {
    // Save the complete schema
    const schema = schemaStore.getFullSchema();
    console.log('Final schema:', schema);
    
    // Add to schema history
    const historyId = historyStore.addSchemaHistory({
      name: `${schemaStore.schemaName || 'Unnamed Schema'}`,
      schemaName: schemaStore.schemaName,
      schemaDescription: schemaStore.schemaDescription,
      fields: schemaStore.fields,
      categoryFormat: schemaStore.categoryFormat,
      categorySeparator: schemaStore.categorySeparator,
      categoryMappings: schemaStore.categoryMappings,
    });
    
    toast.success('Schema saved successfully!');
    
    // Navigate to next step
    navigate('/export');
  };

  const loadHistoricalSchema = (historyId: string) => {
    const historicalSchema = historyStore.getSchemaHistory(historyId);
    if (!historicalSchema) {
      toast.error('Unable to load historical schema data');
      return;
    }

    // Set the schema properties from history
    schemaStore.setSchemaName(historicalSchema.schemaName);
    schemaStore.setSchemaDescription(historicalSchema.schemaDescription);
    schemaStore.setFields(historicalSchema.fields);
    schemaStore.setCategoryFormat(historicalSchema.categoryFormat);
    schemaStore.setCategorySeparator(historicalSchema.categorySeparator);
    schemaStore.setCategoryMappings(historicalSchema.categoryMappings);
    
    toast.success(`Loaded historical schema: ${historicalSchema.name}`);
    setActiveTab('fields');
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
            <Database className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Schema Design</h1>
        </div>
        <p className="text-muted-foreground">
          Design your output schema and clean up messy categories.
        </p>
      </motion.div>

      <Tabs defaultValue="fields" value={activeTab} onValueChange={(v) => setActiveTab(v as 'fields' | 'categories' | 'unmapped' | 'history')}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="fields" className="gap-2">
            <Braces className="h-4 w-4" />
            Schema Fields
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="unmapped" className="gap-2">
            <ListFilter className="h-4 w-4" />
            Unmapped Fields
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Schema History
            {schemaHistory.length > 0 && (
              <Badge variant="secondary" className="ml-2">{schemaHistory.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="fields" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Output Schema Fields</CardTitle>
                <CardDescription>
                  Define the structure of your cleaned feed data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-4 md:grid-cols-12 gap-4 px-2 font-medium text-sm text-muted-foreground">
                  <div className="col-span-2 md:col-span-5">Field Name</div>
                  <div className="col-span-1 md:col-span-3">Type</div>
                  <div className="col-span-1 md:col-span-3">Required</div>
                  <div className="md:col-span-1"></div>
                </div>
                
                <div className="space-y-2">
                  {schemaStore.fields.map((field) => (
                    <div 
                      key={field.name}
                      className={cn(
                        "grid grid-cols-4 md:grid-cols-12 gap-4 items-center p-3 rounded-md transition-colors",
                        field.isCustomField ? "bg-blue-50/50 hover:bg-blue-50/80 dark:bg-blue-900/10 dark:hover:bg-blue-900/20" : "bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <div className="col-span-2 md:col-span-5 font-medium truncate">
                        <div className="flex items-center">
                          {field.name}
                          {field.isCustomField && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-[10px] border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Custom</Badge>
                          )}
                        </div>
                        {field.sourceField && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Source: <Badge variant="secondary" className="text-[10px] font-normal ml-1">{field.sourceField}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-3">
                        <Select 
                          value={field.type}
                          onValueChange={(value) => schemaStore.updateField(field.name, { type: value as 'string' | 'number' | 'boolean' | 'object' | 'array' })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 md:col-span-3">
                        <div className="flex items-center gap-3">
                          <Switch 
                            id={`required-${field.name}`}
                            checked={field.required}
                            onCheckedChange={(checked) => schemaStore.updateField(field.name, { required: checked })}
                            disabled={field.required && !field.isCustomField} // Core required fields can't be changed
                          />
                          <Label htmlFor={`required-${field.name}`} className="text-sm cursor-pointer">
                            {field.required ? "Required" : "Optional"}
                          </Label>
                        </div>
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveField(field.name)}
                          disabled={field.required && !field.isCustomField} // Only allow removing non-required or custom fields
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-t pt-6">
                  <div className="md:col-span-4">
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input 
                      id="fieldName" 
                      value={newField.name} 
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                      placeholder="Enter field name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="fieldType">Type</Label>
                    <Select 
                      value={newField.type}
                      onValueChange={(value) => setNewField({...newField, type: value as 'string' | 'number' | 'boolean' | 'object' | 'array'})}
                    >
                      <SelectTrigger id="fieldType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="sourceField">Source Field</Label>
                    <Select 
                      value={newField.sourceField || ""}
                      onValueChange={(value) => setNewField({...newField, sourceField: value === "none" ? undefined : value})}
                    >
                      <SelectTrigger id="sourceField">
                        <SelectValue placeholder="No source field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No source field</SelectItem>
                        {schemaStore.unmappedSourceFields.length > 0 ? (
                          <>
                            <SelectItem value="" disabled className="font-semibold text-muted-foreground">
                              Unmapped Fields
                            </SelectItem>
                            {schemaStore.unmappedSourceFields.map(field => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <Switch 
                      id="required" 
                      checked={newField.required}
                      onCheckedChange={(checked) => setNewField({...newField, required: checked})}
                    />
                    <Label htmlFor="required">Required</Label>
                  </div>
                  <div className="md:col-span-1">
                    <Button 
                      onClick={handleAddField} 
                      variant="outline" 
                      size="icon"
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle>Category Cleaning</CardTitle>
                  <CardDescription>
                    Standardize messy category formats
                  </CardDescription>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="categoryFormat">Format</Label>
                    <Select 
                      value={schemaStore.categoryFormat}
                      onValueChange={(format) => schemaStore.setCategoryFormat(format as 'hierarchical' | 'flat')}
                    >
                      <SelectTrigger id="categoryFormat" className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hierarchical">Hierarchical</SelectItem>
                        <SelectItem value="flat">Flat (Leaf Only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {schemaStore.categoryFormat === 'hierarchical' && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="categorySeparator">Separator</Label>
                      <Select 
                        value={schemaStore.categorySeparator}
                        onValueChange={schemaStore.setCategorySeparator}
                      >
                        <SelectTrigger id="categorySeparator" className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="/">/</SelectItem>
                          <SelectItem value="|">|</SelectItem>
                          <SelectItem value="-">-</SelectItem>
                          <SelectItem value=">">{"\>"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="mt-auto gap-2"
                    onClick={handleAutoGenerateCategories}
                  >
                    <Wand2 className="h-4 w-4" />
                    Auto-Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 pb-2 font-medium text-sm text-muted-foreground">
                    <div>Source Category</div>
                    <div>Target Category</div>
                  </div>
                  
                  {schemaStore.categoryMappings.map((mapping) => (
                    <div 
                      key={mapping.sourceCategory}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium text-sm">
                        {mapping.sourceCategory.split('>').map((part, i, arr) => (
                          <span key={i} className={cn(
                            i !== arr.length - 1 ? "text-muted-foreground" : ""
                          )}>
                            {part.trim()}
                            {i !== arr.length - 1 && <span className="mx-0.5">›</span>}
                          </span>
                        ))}
                      </div>
                      <Input 
                        value={mapping.targetCategory}
                        onChange={(e) => handleCategoryMappingChange(mapping.sourceCategory, e.target.value)}
                        placeholder={
                          schemaStore.categoryFormat === 'hierarchical' 
                            ? `Enter with ${schemaStore.categorySeparator} separator` 
                            : "Enter category name"
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  {schemaStore.categoryMappings.filter(m => m.targetCategory).length} of {schemaStore.categoryMappings.length} categories mapped
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => toast.success('Category mappings saved!')}
                >
                  Save Category Mappings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="unmapped" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Unmapped Source Fields</CardTitle>
                <CardDescription>
                  Fields from your source data that haven't been mapped yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {schemaStore.unmappedSourceFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>All source fields are mapped.</p>
                    <p className="mt-2 text-sm">
                      Good job! You've mapped all available fields from your source data.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      You have {schemaStore.unmappedSourceFields.length} unmapped fields from your source data.
                      Click on a field to add it to your schema.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {schemaStore.unmappedSourceFields.map(field => (
                        <div 
                          key={field}
                          className="flex items-center justify-between p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                          onClick={() => handleQuickAddField(field)}
                        >
                          <span className="text-sm font-medium truncate">{field}</span>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              {schemaStore.unmappedSourceFields.length > 0 && (
                <CardFooter className="border-t pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Add all unmapped fields as custom fields
                      schemaStore.unmappedSourceFields.forEach(field => {
                        handleQuickAddField(field);
                      });
                    }}
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add All Unmapped Fields
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Schema History
                </CardTitle>
                <CardDescription>
                  Previously saved schema configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {schemaHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No schema history found.</p>
                    <p className="mt-2 text-sm">
                      Your schema history will appear here once you've designed schemas and continued to the next step.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schemaHistory.map((record) => (
                      <div 
                        key={record.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border hover:bg-muted/30 transition-colors gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="h-10 w-10 rounded-md border bg-background flex items-center justify-center">
                            <Database className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{record.name}</p>
                            <div className="flex items-center mt-1 gap-3">
                              <Badge variant="outline" className="text-xs">
                                {record.fields.length} Fields
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {record.categoryMappings.length} Categories
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
                          onClick={() => loadHistoricalSchema(record.id)}
                        >
                          Load This Schema
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {schemaHistory.length > 0 && (
                <CardFooter className="border-t pt-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all schema history?')) {
                        historyStore.clearHistory('schema');
                        toast.success('Schema history cleared');
                      }
                    }}
                  >
                    Clear History
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>

          {schemaHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Braces className="h-4 w-4" />
                    Last Schema Details
                  </CardTitle>
                  <CardDescription>
                    Preview of your most recent schema design
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Schema Name</h3>
                      <p className="text-sm text-muted-foreground">{schemaHistory[0].schemaName || 'Unnamed Schema'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <p className="text-sm text-muted-foreground">{schemaHistory[0].schemaDescription || 'No description provided'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Field Summary</h3>
                      <div className="flex flex-wrap gap-2">
                        {schemaHistory[0].fields.slice(0, 10).map(field => (
                          <Badge key={field.name} variant={field.required ? "default" : "outline"} className="text-xs">
                            {field.name}
                          </Badge>
                        ))}
                        {schemaHistory[0].fields.length > 10 && (
                          <Badge variant="secondary" className="text-xs">
                            +{schemaHistory[0].fields.length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Category Format</h3>
                      <p className="text-sm text-muted-foreground">
                        {schemaHistory[0].categoryFormat === 'hierarchical' 
                          ? `Hierarchical with "${schemaHistory[0].categorySeparator}" separator` 
                          : 'Flat (Leaf categories only)'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleContinue} className="gap-2">
          Continue to Export
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}