import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileJson, Database, Share2, ArrowRight, Clock, Activity, FileUp, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Dashboard() {
  // Get history data
  const historyStore = useHistoryStore();
  const uploadHistory = historyStore.uploadHistory;
  const mappingHistory = historyStore.mappingHistory;
  const schemaHistory = historyStore.schemaHistory;
  const exportHistory = historyStore.exportHistory;

  // Combine all history types and sort by timestamp (most recent first)
  const allActivity = [
    ...uploadHistory.map(item => ({ 
      ...item, 
      type: 'upload', 
      title: `Uploaded ${item.fileInfo.name}`,
      description: `${item.recordCount} records processed`,
      icon: <FileUp className="h-4 w-4" />
    })),
    ...mappingHistory.map(item => ({ 
      ...item, 
      type: 'mapping',
      title: item.name,
      description: `${Object.values(item.mappings).filter(v => v && v !== "not_mapped").length} fields mapped`,
      icon: <FileJson className="h-4 w-4" />
    })),
    ...schemaHistory.map(item => ({ 
      ...item, 
      type: 'schema',
      title: item.name,
      description: `${item.fields.length} fields, ${item.categoryMappings.length} categories`,
      icon: <Database className="h-4 w-4" />
    })),
    ...exportHistory.map(item => ({ 
      ...item, 
      type: 'export',
      title: item.name,
      description: `${item.recordCount} records ${item.exportType === 'api' ? 'via API' : `as ${item.exportType.toUpperCase()}`}`,
      icon: <Share2 className="h-4 w-4" />
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  // Get the 5 most recent activities
  const recentActivity = allActivity.slice(0, 5);

  // Calculate statistics
  const totalUploads = uploadHistory.length;
  const totalRecords = uploadHistory.reduce((sum, record) => sum + record.recordCount, 0);
  const totalExports = exportHistory.length;
  const fileTypesProcessed = [...new Set(uploadHistory.map(record => record.fileType.toUpperCase()))];

  const steps = [
    {
      icon: <Upload />,
      title: 'Upload Feed',
      description: 'Import affiliate feeds in CSV, JSON, or XML format',
      link: '/upload'
    },
    {
      icon: <FileJson />,
      title: 'Map Fields',
      description: 'Map incoming fields to your own clean schema',
      link: '/mapping'
    },
    {
      icon: <Database />,
      title: 'Design Schema',
      description: 'Create custom schema and clean messy categories',
      link: '/schema'
    },
    {
      icon: <Share2 />,
      title: 'Export Feed',
      description: 'Export your standardized feed via API or CSV',
      link: '/export'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Welcome to FeedFlow</h1>
        <p className="text-muted-foreground">
          Transform messy affiliate feeds into clean, structured data for your platform.
        </p>
      </motion.div>

      {allActivity.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your processing history across all steps
                  </CardDescription>
                </div>
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="gap-1">
                    <History className="h-3 w-3" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white
                        ${activity.type === 'upload' ? 'bg-blue-500' : ''}
                        ${activity.type === 'mapping' ? 'bg-amber-500' : ''}
                        ${activity.type === 'schema' ? 'bg-purple-500' : ''}
                        ${activity.type === 'export' ? 'bg-green-500' : ''}
                      `}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}

                  {recentActivity.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No activity yet.</p>
                      <p className="text-sm mt-1">Start by uploading a feed file.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Processing Stats
                </CardTitle>
                <CardDescription>
                  Summary of your feed processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/40 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Uploads</p>
                      <p className="text-2xl font-bold mt-1">{totalUploads}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Exports</p>
                      <p className="text-2xl font-bold mt-1">{totalExports}</p>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Records Processed</p>
                    <p className="text-2xl font-bold mt-1">{totalRecords.toLocaleString()}</p>
                  </div>

                  {fileTypesProcessed.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">File Types Processed:</p>
                      <div className="flex flex-wrap gap-2">
                        {fileTypesProcessed.map(type => (
                          <Badge key={type} variant="secondary">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {totalUploads === 0 && (
                    <div className="text-center py-3 text-muted-foreground">
                      <p className="text-sm">No processing stats yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full border border-border/40 transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
                <CardHeader>
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-2">
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="group">
                    <Link to={step.link}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {allActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="workflow">
            <TabsList>
              <TabsTrigger value="workflow">Workflow Steps</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workflow" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <Card key={index} className="border border-border/40 transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
                    <CardHeader>
                      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-2">
                        {step.icon}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="ghost" className="group">
                        <Link to={step.link}>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <div className="h-10 w-10 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <CardTitle>Upload History</CardTitle>
                    <CardDescription>Previously uploaded feed files</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Uploads</span>
                      <Badge variant="secondary">{uploadHistory.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Records Processed</span>
                      <Badge variant="secondary">{totalRecords.toLocaleString()}</Badge>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/upload">View Upload History</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="h-10 w-10 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                      <FileJson className="h-5 w-5" />
                    </div>
                    <CardTitle>Mapping History</CardTitle>
                    <CardDescription>Saved field mapping configurations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Mappings</span>
                      <Badge variant="secondary">{mappingHistory.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Latest Mapping</span>
                      <Badge variant="secondary">
                        {mappingHistory.length > 0 
                          ? formatDistanceToNow(mappingHistory[0].timestamp, { addSuffix: true }) 
                          : 'N/A'}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/mapping">View Mapping History</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="h-10 w-10 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                      <Database className="h-5 w-5" />
                    </div>
                    <CardTitle>Schema History</CardTitle>
                    <CardDescription>Saved schema configurations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Schemas</span>
                      <Badge variant="secondary">{schemaHistory.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Latest Schema</span>
                      <Badge variant="secondary">
                        {schemaHistory.length > 0 
                          ? formatDistanceToNow(schemaHistory[0].timestamp, { addSuffix: true }) 
                          : 'N/A'}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/schema">View Schema History</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="h-10 w-10 rounded-md bg-green-500/10 text-green-500 flex items-center justify-center mb-2">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <CardTitle>Export History</CardTitle>
                    <CardDescription>Previous feed exports and API requests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Exports</span>
                      <Badge variant="secondary">{exportHistory.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Latest Export</span>
                      <Badge variant="secondary">
                        {exportHistory.length > 0 
                          ? formatDistanceToNow(exportHistory[0].timestamp, { addSuffix: true }) 
                          : 'N/A'}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/export">View Export History</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border border-border/40 bg-accent/20">
          <CardHeader>
            <CardTitle className="text-xl">Quick Start Guide</CardTitle>
            <CardDescription>Follow these steps to get your first feed up and running</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Upload a feed</span> - Start by uploading your affiliate feed file (CSV, JSON, or XML)
              </li>
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Map your fields</span> - Define how incoming fields map to your schema
              </li>
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Design your schema</span> - Create a clean, consistent schema for your data
              </li>
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Export your feed</span> - Generate an API endpoint or CSV for your clean feed
              </li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}