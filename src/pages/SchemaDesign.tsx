import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, PlusCircle, X, ArrowRight, Braces, Tag, Wand2 } from 'lucide-react';
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
  const [fields, setFields] = useState([
    { name: 'id', type: 'string', required: true },
    { name: 'title', type: 'string', required: true },
    { name: 'description', type: 'string', required: false },
    { name: 'price', type: 'number', required: true },
    { name: 'currency', type: 'string', required: true },
    { name: 'category', type: 'string', required: true },
    { name: 'image', type: 'string', required: false },
    { name: 'link', type: 'string', required: true },
    { name: 'brand', type: 'string', required: false },
    { name: 'availability', type: 'string', required: false },
  ]);
  
  const [categoryMappings, setCategoryMappings] = useState<Record<string, string>>({
    'Electronics > Audio > Headphones': 'Electronics/Audio/Headphones',
    'Electronics > Wearables > Smartwatches': 'Electronics/Wearables/Smartwatches',
    'Clothing > Tops > T-Shirts': 'Clothing/Tops/T-Shirts',
  });
  
  const [newField, setNewField] = useState({ name: '', type: 'string', required: false });
  const [categoryFormat, setCategoryFormat] = useState('hierarchical');
  const [categorySeparator, setCategorySeparator] = useState('/');
  
  const navigate = useNavigate();

  const handleAddField = () => {
    if (!newField.name) {
      toast.error('Field name is required');
      return;
    }
    
    if (fields.some(f => f.name === newField.name)) {
      toast.error('Field name must be unique');
      return;
    }
    
    setFields([...fields, newField]);
    setNewField({ name: '', type: 'string', required: false });
    toast.success('Field added successfully!');
  };

  const handleRemoveField = (name: string) => {
    setFields(fields.filter(field => field.name !== name));
  };

  const handleCategoryMappingChange = (source: string, target: string) => {
    setCategoryMappings({
      ...categoryMappings,
      [source]: target
    });
  };

  const handleAutoGenerateCategories = () => {
    const newMappings = { ...categoryMappings };
    
    categorySuggestions.forEach(category => {
      if (!newMappings[category]) {
        // Replace separator based on format
        const formattedCategory = categoryFormat === 'hierarchical' 
          ? category.replace(/\s*>\s*/g, categorySeparator)
          : category.split('>').pop()?.trim() || '';
          
        newMappings[category] = formattedCategory;
      }
    });
    
    setCategoryMappings(newMappings);
    toast.success('Category mappings auto-generated!');
  };

  const handleContinue = () => {
    // Would normally save schema design to state/context
    navigate('/export');
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

      <Tabs defaultValue="fields">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="fields" className="gap-2">
            <Braces className="h-4 w-4" />
            Schema Fields
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="h-4 w-4" />
            Categories
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
                  {fields.map((field) => (
                    <div 
                      key={field.name}
                      className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="col-span-2 md:col-span-5 font-medium truncate">{field.name}</div>
                      <div className="col-span-1 md:col-span-3">
                        <Badge variant="outline">{field.type}</Badge>
                      </div>
                      <div className="col-span-1 md:col-span-3">
                        {field.required ? (
                          <Badge variant="default" className="bg-primary/90">Required</Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveField(field.name)}
                          disabled={field.required} // Don't allow removing required fields
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-t pt-6">
                  <div className="md:col-span-5">
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input 
                      id="fieldName" 
                      value={newField.name} 
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                      placeholder="Enter field name"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="fieldType">Type</Label>
                    <Select 
                      value={newField.type}
                      onValueChange={(value) => setNewField({...newField, type: value})}
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
                  <div className="md:col-span-3 flex items-center gap-2">
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
                      value={categoryFormat}
                      onValueChange={setCategoryFormat}
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
                  
                  {categoryFormat === 'hierarchical' && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="categorySeparator">Separator</Label>
                      <Select 
                        value={categorySeparator}
                        onValueChange={setCategorySeparator}
                      >
                        <SelectTrigger id="categorySeparator" className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="/">/</SelectItem>
                          <SelectItem value="|">|</SelectItem>
                          <SelectItem value="-">-</SelectItem>
                          <SelectItem value=">">{">"}</SelectItem>
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
                  
                  {categorySuggestions.map((category) => (
                    <div 
                      key={category}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium text-sm">
                        {category.split('>').map((part, i, arr) => (
                          <span key={i} className={cn(
                            i !== arr.length - 1 ? "text-muted-foreground" : ""
                          )}>
                            {part.trim()}
                            {i !== arr.length - 1 && <span className="mx-0.5">›</span>}
                          </span>
                        ))}
                      </div>
                      <Input 
                        value={categoryMappings[category] || ''}
                        onChange={(e) => handleCategoryMappingChange(category, e.target.value)}
                        placeholder={
                          categoryFormat === 'hierarchical' 
                            ? `Enter with ${categorySeparator} separator` 
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
                  {Object.keys(categoryMappings).length} of {categorySuggestions.length} categories mapped
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