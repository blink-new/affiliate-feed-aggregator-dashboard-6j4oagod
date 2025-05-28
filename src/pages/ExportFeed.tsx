import { useState } from 'react';
import { Share2, Code, FileDown, RefreshCw, Copy, Check, FileJson, FileText, Webhook, Key, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../components/ui/badge';

export function ExportFeed() {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('fd891e7b-ec89-4d34-9c12-af6b3a28943e');
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [filteringEnabled, setFilteringEnabled] = useState(true);
  const [sortingEnabled, setSortingEnabled] = useState(true);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'api' | 'download' | 'history'>('api');

  const apiUrl = 'https://api.feedflow.example/v1/feeds/my-feed';
  
  // History store
  const historyStore = useHistoryStore();
  const exportHistory = historyStore.exportHistory;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    toast.success('API URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKey = () => {
    setRegeneratingKey(true);
    
    // Simulate API key generation
    setTimeout(() => {
      setApiKey(crypto.randomUUID());
      setRegeneratingKey(false);
      toast.success('New API key generated!');
    }, 1000);
  };

  const handleDownload = (format: 'json' | 'csv') => {
    // Add export to history
    historyStore.addExportHistory({
      name: `Feed Export (${format.toUpperCase()})`,
      exportType: format,
      recordCount: 250, // Simulated record count
      fileName: `feed_export_${Date.now()}.${format}`
    });
    
    // Simulate download
    toast.success(`Downloading feed in ${format.toUpperCase()} format`);
  };

  const handleApiRequest = () => {
    // Add export to history
    historyStore.addExportHistory({
      name: `API Request`,
      exportType: 'api',
      recordCount: 250, // Simulated record count
      url: apiUrl,
      filters: {
        pagination: paginationEnabled ? 'enabled' : 'disabled',
        filtering: filteringEnabled ? 'enabled' : 'disabled',
        sorting: sortingEnabled ? 'enabled' : 'disabled',
        search: searchEnabled ? 'enabled' : 'disabled'
      }
    });
    
    toast.success('API request simulated successfully!');
  };

  const exampleCode = `
// Example code to fetch your feed
fetch('${apiUrl}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

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
            <Share2 className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Export Feed</h1>
        </div>
        <p className="text-muted-foreground">
          Export your cleaned and standardized feed via API or download.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Tabs defaultValue="api" value={activeTab} onValueChange={(v) => setActiveTab(v as 'api' | 'download' | 'history')}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="api" className="gap-2">
                <Webhook className="h-4 w-4" />
                API Access
              </TabsTrigger>
              <TabsTrigger value="download" className="gap-2">
                <FileDown className="h-4 w-4" />
                Direct Download
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Export History
                {exportHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{exportHistory.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="api" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoint</CardTitle>
                  <CardDescription>
                    Access your feed data through our RESTful API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Feed URL</Label>
                    <div className="flex">
                      <Input 
                        value={apiUrl} 
                        readOnly 
                        className="rounded-r-none font-mono text-sm"
                      />
                      <Button 
                        variant="secondary" 
                        className={cn(
                          "rounded-l-none px-3 gap-2",
                          copied && "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700"
                        )}
                        onClick={handleCopyUrl}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>API Key</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs gap-1"
                        onClick={handleGenerateKey}
                        disabled={regeneratingKey}
                      >
                        {regeneratingKey ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        Regenerate
                      </Button>
                    </div>
                    <div className="flex">
                      <div className="bg-muted flex items-center px-3 border border-r-0 rounded-l-md border-input">
                        <Key className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        value={apiKey} 
                        readOnly 
                        className="rounded-l-none font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep this key secret. You can regenerate it if it becomes compromised.
                    </p>
                  </div>
                  
                  <div className="space-y-4 border rounded-md p-4 bg-muted/30">
                    <Label>Example Code</Label>
                    <pre className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto whitespace-pre">
                      {exampleCode}
                    </pre>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Features</CardTitle>
                  <CardDescription>
                    Configure additional features for your API endpoint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="space-y-0.5">
                        <Label>Pagination</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow clients to request paginated results
                        </p>
                      </div>
                      <Switch 
                        checked={paginationEnabled}
                        onCheckedChange={setPaginationEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="space-y-0.5">
                        <Label>Filtering</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable query parameter filtering
                        </p>
                      </div>
                      <Switch 
                        checked={filteringEnabled}
                        onCheckedChange={setFilteringEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="space-y-0.5">
                        <Label>Sorting</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow sorting results by field
                        </p>
                      </div>
                      <Switch 
                        checked={sortingEnabled}
                        onCheckedChange={setSortingEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Search</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable full-text search capability
                        </p>
                      </div>
                      <Switch 
                        checked={searchEnabled}
                        onCheckedChange={setSearchEnabled}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button 
                    onClick={() => toast.success('API settings saved!')}
                    variant="outline"
                  >
                    Save API Settings
                  </Button>
                  <Button 
                    onClick={handleApiRequest}
                  >
                    Test API Request
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="download" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Download Feed</CardTitle>
                  <CardDescription>
                    Download your feed in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-24 flex-col gap-3"
                      onClick={() => handleDownload('json')}
                    >
                      <FileJson className="h-8 w-8 text-blue-500" />
                      <div className="space-y-1">
                        <div className="font-medium">JSON</div>
                        <div className="text-xs text-muted-foreground">
                          Standard JSON format
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-24 flex-col gap-3"
                      onClick={() => handleDownload('csv')}
                    >
                      <FileText className="h-8 w-8 text-green-500" />
                      <div className="space-y-1">
                        <div className="font-medium">CSV</div>
                        <div className="text-xs text-muted-foreground">
                          Comma-separated values
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4">
                    <p>
                      Downloads contain the most recent feed data processed through your configured schema.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Export History
                  </CardTitle>
                  <CardDescription>
                    Records of previous feed exports and API requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {exportHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No export history found.</p>
                      <p className="mt-2 text-sm">
                        Your export history will appear here once you've downloaded feeds or made API requests.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {exportHistory.map((record) => (
                        <div 
                          key={record.id}
                          className="p-4 rounded-md border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-md border bg-background flex items-center justify-center">
                              {record.exportType === 'api' ? (
                                <Webhook className="h-5 w-5 text-primary" />
                              ) : record.exportType === 'json' ? (
                                <FileJson className="h-5 w-5 text-blue-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{record.name}</p>
                              <div className="flex flex-wrap items-center mt-1 gap-3">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {record.exportType} Export
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {record.recordCount} records
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {record.exportType === 'api' && record.filters && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-xs font-medium mb-2">API Features:</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(record.filters).map(([feature, status]) => (
                                  <Badge 
                                    key={feature} 
                                    variant={status === 'enabled' ? 'secondary' : 'outline'} 
                                    className="text-xs capitalize"
                                  >
                                    {feature}: {status}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {record.fileName && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-xs font-medium">File: <span className="font-normal">{record.fileName}</span></p>
                            </div>
                          )}

                          {record.url && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-xs font-medium">URL: <span className="font-normal text-primary">{record.url}</span></p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {exportHistory.length > 0 && (
                  <CardFooter className="border-t pt-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all export history?')) {
                          historyStore.clearHistory('export');
                          toast.success('Export history cleared');
                        }
                      }}
                    >
                      Clear Export History
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {exportHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Export Statistics
                    </CardTitle>
                    <CardDescription>
                      Summary of your export activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-sm font-medium mb-1">Total Exports</p>
                        <p className="text-2xl font-bold">{exportHistory.length}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-sm font-medium mb-1">API Requests</p>
                        <p className="text-2xl font-bold">
                          {exportHistory.filter(record => record.exportType === 'api').length}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-sm font-medium mb-1">File Downloads</p>
                        <p className="text-2xl font-bold">
                          {exportHistory.filter(record => record.exportType !== 'api').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
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
                <Code className="h-4 w-4" />
                API Documentation
              </CardTitle>
              <CardDescription>
                How to use your feed API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Authentication</h3>
                <p className="text-xs text-muted-foreground">
                  All API requests require a valid API key in the Authorization header.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Endpoints</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs font-medium">GET /v1/feeds/my-feed</p>
                    <p className="text-xs text-muted-foreground">
                      Retrieve the complete feed
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs font-medium">GET /v1/feeds/my-feed?page=1&limit=50</p>
                    <p className="text-xs text-muted-foreground">
                      Paginated results (if enabled)
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs font-medium">GET /v1/feeds/my-feed?category=Electronics</p>
                    <p className="text-xs text-muted-foreground">
                      Filter by field value (if enabled)
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs font-medium">GET /v1/feeds/my-feed?sort=price:desc</p>
                    <p className="text-xs text-muted-foreground">
                      Sort results (if enabled)
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs font-medium">GET /v1/feeds/my-feed?q=headphones</p>
                    <p className="text-xs text-muted-foreground">
                      Search (if enabled)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Response Format</h3>
                <pre className="bg-muted/50 p-2 rounded-md text-xs font-mono">
{`{
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}