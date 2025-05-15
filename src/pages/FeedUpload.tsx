import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileJson, FileUp, ArrowRight, PanelRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from 'react-hot-toast';

export function FeedUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);

    // Simulate file parsing based on type
    setTimeout(() => {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      let mockData: any[] = [];

      // Mock data for preview
      if (extension === 'csv' || extension === 'json' || extension === 'xml') {
        mockData = [
          {
            id: '1',
            product_name: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 89.99,
            currency: 'USD',
            category: 'Electronics > Audio > Headphones',
            image_url: 'https://example.com/headphones.jpg',
            affiliate_link: 'https://affiliate.example.com/p/1'
          },
          {
            id: '2',
            product_name: 'Smart Watch Series 5',
            description: 'Fitness tracker with heart rate monitor and GPS',
            price: 199.99,
            currency: 'USD',
            category: 'Electronics > Wearables > Smartwatches',
            image_url: 'https://example.com/smartwatch.jpg',
            affiliate_link: 'https://affiliate.example.com/p/2'
          },
          {
            id: '3',
            product_name: 'Organic Cotton T-Shirt',
            description: 'Premium organic cotton t-shirt',
            price: 29.99,
            currency: 'USD',
            category: 'Clothing > Tops > T-Shirts',
            image_url: 'https://example.com/tshirt.jpg',
            affiliate_link: 'https://affiliate.example.com/p/3'
          }
        ];
      }

      setPreviewData(mockData);
      toast.success('File successfully uploaded and parsed!');
    }, 1000);
  };

  const handleContinue = () => {
    if (file && previewData) {
      // In a real app, you'd store this data in state management or context
      // For now, let's just navigate to the next step
      navigate('/mapping');
    }
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
            <FileUp className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Feed</h1>
        </div>
        <p className="text-muted-foreground">
          Import your affiliate feed files and preview the data before processing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Feed File</CardTitle>
              <CardDescription>
                Drag and drop your feed file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileSelect={handleFileSelect} />
            </CardContent>
            {file && (
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {previewData ? `${previewData.length} items found` : 'Processing...'}
                  </span>
                </div>
                <Button 
                  onClick={handleContinue} 
                  disabled={!previewData}
                  className="gap-2"
                >
                  Continue to Mapping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PanelRight className="h-4 w-4" />
                Format Guidelines
              </CardTitle>
              <CardDescription>
                Supported file formats and structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="csv">
                <TabsList className="w-full">
                  <TabsTrigger value="csv" className="flex-1">CSV</TabsTrigger>
                  <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
                  <TabsTrigger value="xml" className="flex-1">XML</TabsTrigger>
                </TabsList>
                <TabsContent value="csv" className="pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your CSV file should have headers in the first row.
                  </p>
                  <div className="text-xs bg-muted p-2 rounded">
                    <pre>product_id,name,price,category,link,image_url</pre>
                  </div>
                </TabsContent>
                <TabsContent value="json" className="pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    JSON files should be an array of product objects.
                  </p>
                  <div className="text-xs bg-muted p-2 rounded">
                    <pre>{`[
  {
    "id": "123",
    "name": "Product Name",
    "price": 99.99,
    ...
  }
]`}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="xml" className="pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    XML files should use a products/product structure.
                  </p>
                  <div className="text-xs bg-muted p-2 rounded">
                    <pre>{`<products>
  <product>
    <id>123</id>
    <name>Product Name</name>
    ...
  </product>
</products>`}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {previewData && previewData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Data Preview
              </CardTitle>
              <CardDescription>
                Preview of the first {previewData.length} records from your feed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {Object.keys(previewData[0]).map((header) => (
                        <th key={header} className="text-left px-4 py-2 font-medium">
                          {header.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                        {Object.values(item).map((value: any, j) => (
                          <td key={j} className="px-4 py-2 truncate max-w-[200px]">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}