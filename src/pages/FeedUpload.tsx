import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileJson, FileUp, ArrowRight, PanelRight, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from 'react-hot-toast';
import { parseFile } from '../utils/fileParser';

// Import the file store
import { useFileStore } from '../store/fileStore';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';

// Define a type for the parsed data
type FeedData = {
  headers: string[];
  rows: Record<string, string>[];
};

export function FeedUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<FeedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const navigate = useNavigate();

  const fileStore = useFileStore();
  const historyStore = useHistoryStore();
  const uploadHistory = historyStore.uploadHistory;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);

    try {
      // Use our file parser to read and parse the file contents
      const result = await parseFile(selectedFile);
      
      console.log('Parsed file data:', result);
      
      // Store the parsed data locally
      setParsedData({
        headers: result.headers,
        rows: result.rows
      });
      
      // Store in the file store for persistence between pages
      fileStore.setFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      });
      
      fileStore.setFileData({
        headers: result.headers,
        data: result.rows,
        fileType: result.fileType as 'csv' | 'json' | 'xml',
      });
      
      // Add to upload history
      historyStore.addUploadHistory({
        name: `Upload: ${selectedFile.name}`,
        fileInfo: {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
        },
        recordCount: result.rows.length,
        fileType: result.fileType,
        previewData: result.rows.slice(0, 5) // Store only first 5 records as preview
      });
      
      toast.success(`File successfully uploaded and parsed! Found ${result.rows.length} records.`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Error parsing file. Please check the file format and try again.');
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (file && parsedData) {
      // In a real app, you'd store this data in state management or context
      // We would need to set up a global store to persist this data
      navigate('/mapping');
    }
  };

  const handleLoadHistoricalUpload = (historyId: string) => {
    const historicalUpload = historyStore.getUploadHistory(historyId);
    if (!historicalUpload) {
      toast.error('Unable to load historical upload data');
      return;
    }

    // Set the file info in the file store
    fileStore.setFile(historicalUpload.fileInfo);
    
    // Construct file data from history
    if (historicalUpload.previewData && historicalUpload.previewData.length > 0) {
      // Extract headers from the first preview item
      const headers = Object.keys(historicalUpload.previewData[0]);
      
      fileStore.setFileData({
        headers,
        data: historicalUpload.previewData,
        fileType: historicalUpload.fileType as 'csv' | 'json' | 'xml',
      });
      
      // Update local state
      setParsedData({
        headers,
        rows: historicalUpload.previewData
      });
      
      toast.success(`Loaded historical upload: ${historicalUpload.fileInfo.name}`);
      setActiveTab('upload');
    } else {
      toast.error('Historical upload data is incomplete');
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

      <Tabs defaultValue="upload" value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'history')}>
        <TabsList>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Upload Feed
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Upload History
            {uploadHistory.length > 0 && (
              <Badge variant="secondary" className="ml-2">{uploadHistory.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-8 mt-6">
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
                        {parsedData ? `${parsedData.rows.length} items found` : isLoading ? 'Processing...' : 'No data found'}
                      </span>
                    </div>
                    <Button 
                      onClick={handleContinue} 
                      disabled={!parsedData || isLoading}
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
    <n>Product Name</n>
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

          {parsedData && parsedData.rows.length > 0 && (
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
                    Preview of the first {Math.min(parsedData.rows.length, 3)} records from your feed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          {parsedData.headers.map((header) => (
                            <th key={header} className="text-left px-4 py-2 font-medium">
                              {header.replace(/_/g, ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.rows.slice(0, 3).map((item, i) => (
                          <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                            {parsedData.headers.map((header) => (
                              <td key={header} className="px-4 py-2 truncate max-w-[200px]">
                                {typeof item[header] === 'object' ? JSON.stringify(item[header]) : String(item[header] || '')}
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
        </TabsContent>
        
        <TabsContent value="history" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Upload History
              </CardTitle>
              <CardDescription>
                Previously uploaded feed files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upload history found.</p>
                  <p className="mt-2 text-sm">
                    Your upload history will appear here once you've uploaded feed files.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadHistory.map((record) => (
                    <div 
                      key={record.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border hover:bg-muted/30 transition-colors gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="h-10 w-10 rounded-md border bg-background flex items-center justify-center">
                          <FileUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{record.fileInfo.name}</p>
                          <div className="flex items-center mt-1 gap-3">
                            <Badge variant="outline" className="text-xs">
                              {record.fileType.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {record.recordCount} Records
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
                        onClick={() => handleLoadHistoricalUpload(record.id)}
                      >
                        Load This File
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {uploadHistory.length > 0 && (
              <CardFooter className="border-t pt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all upload history?')) {
                      historyStore.clearHistory('upload');
                      toast.success('Upload history cleared');
                    }
                  }}
                >
                  Clear History
                </Button>
              </CardFooter>
            )}
          </Card>

          {uploadHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Upload Statistics
                </CardTitle>
                <CardDescription>
                  Summary of your upload activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="text-sm font-medium mb-1">Total Uploads</p>
                    <p className="text-2xl font-bold">{uploadHistory.length}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="text-sm font-medium mb-1">Records Processed</p>
                    <p className="text-2xl font-bold">
                      {uploadHistory.reduce((sum, record) => sum + record.recordCount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="text-sm font-medium mb-1">File Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...new Set(uploadHistory.map(record => record.fileType.toUpperCase()))].map(type => (
                        <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}