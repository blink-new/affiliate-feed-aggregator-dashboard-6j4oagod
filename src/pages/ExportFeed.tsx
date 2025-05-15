import { useState } from 'react';
import { Share2, Code, FileDown, RefreshCw, Copy, Check, FileJson, FileText, Webhook, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export function ExportFeed() {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('fd891e7b-ec89-4d34-9c12-af6b3a28943e');
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [filteringEnabled, setFilteringEnabled] = useState(true);
  const [sortingEnabled, setSortingEnabled] = useState(true);
  const [searchEnabled, setSearchEnabled] = useState(true);

  const apiUrl = 'https://api.feedflow.example/v1/feeds/my-feed';

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
    // Simulate download
    toast.success(`Downloading feed in ${format.toUpperCase()} format`);
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
          <Tabs defaultValue="api">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="api" className="gap-2">
                <Webhook className="h-4 w-4" />
                API Access
              </TabsTrigger>
              <TabsTrigger value="download" className="gap-2">
                <FileDown className="h-4 w-4" />
                Direct Download
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
                <CardFooter className="border-t pt-6">
                  <Button 
                    onClick={() => toast.success('API settings saved!')}
                    variant="outline"
                  >
                    Save API Settings
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