import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileJson, Database, Share2, ArrowRight, Clock, Activity, FileUp, History, Zap, TrendingUp, BarChart3, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../components/ui/badge';
// Removed unused imports

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
      icon: <FileUp className="h-4 w-4" />,
      gradient: 'from-blue-500 to-blue-600'
    })),
    ...mappingHistory.map(item => ({ 
      ...item, 
      type: 'mapping',
      title: item.name,
      description: `${Object.values(item.mappings).filter(v => v && v !== "not_mapped").length} fields mapped`,
      icon: <FileJson className="h-4 w-4" />,
      gradient: 'from-amber-500 to-amber-600'
    })),
    ...schemaHistory.map(item => ({ 
      ...item, 
      type: 'schema',
      title: item.name,
      description: `${item.fields.length} fields, ${item.categoryMappings.length} categories`,
      icon: <Database className="h-4 w-4" />,
      gradient: 'from-violet-500 to-violet-600'
    })),
    ...exportHistory.map(item => ({ 
      ...item, 
      type: 'export',
      title: item.name,
      description: `${item.recordCount} records ${item.exportType === 'api' ? 'via API' : `as ${item.exportType.toUpperCase()}`}`,
      icon: <Share2 className="h-4 w-4" />,
      gradient: 'from-pink-500 to-pink-600'
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  // Get the 5 most recent activities
  const recentActivity = allActivity.slice(0, 5);

  // Calculate statistics
  const totalUploads = uploadHistory.length;
  const totalRecords = uploadHistory.reduce((sum, record) => sum + record.recordCount, 0);
  const totalExports = exportHistory.length;
  const fileTypesProcessed = [...new Set(uploadHistory.map(record => record.fileType.toUpperCase()))];

  const workflowSteps = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: 'Upload Feed',
      description: 'Import affiliate feeds in CSV, JSON, or XML format with intelligent parsing',
      link: '/upload',
      gradient: 'from-green-500 to-emerald-600',
      status: totalUploads > 0 ? 'completed' : 'pending',
      count: totalUploads
    },
    {
      icon: <FileJson className="h-6 w-6" />,
      title: 'Map Fields',
      description: 'Map incoming fields to your standardized schema with smart suggestions',
      link: '/mapping',
      gradient: 'from-amber-500 to-orange-600',
      status: mappingHistory.length > 0 ? 'completed' : 'pending',
      count: mappingHistory.length
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Design Schema',
      description: 'Create custom schemas and clean messy categories automatically',
      link: '/schema',
      gradient: 'from-violet-500 to-purple-600',
      status: schemaHistory.length > 0 ? 'completed' : 'pending',
      count: schemaHistory.length
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: 'Export Feed',
      description: 'Generate clean APIs and download structured data instantly',
      link: '/export',
      gradient: 'from-pink-500 to-rose-600',
      status: exportHistory.length > 0 ? 'completed' : 'pending',
      count: exportHistory.length
    }
  ];

  const statsCards = [
    {
      title: 'Total Records',
      value: totalRecords.toLocaleString(),
      icon: <BarChart3 className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-600',
      change: '+12%',
      description: 'Processed this month'
    },
    {
      title: 'Active Feeds',
      value: totalUploads.toString(),
      icon: <Zap className="h-5 w-5" />,
      gradient: 'from-green-500 to-emerald-600',
      change: '+3',
      description: 'New this week'
    },
    {
      title: 'Exports Created',
      value: totalExports.toString(),
      icon: <TrendingUp className="h-5 w-5" />,
      gradient: 'from-purple-500 to-violet-600',
      change: '+8%',
      description: 'Growth rate'
    },
    {
      title: 'File Formats',
      value: fileTypesProcessed.length.toString(),
      icon: <Users className="h-5 w-5" />,
      gradient: 'from-orange-500 to-red-600',
      change: '100%',
      description: 'Compatibility'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="spotify-card spotify-glow bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-tl from-accent to-primary rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold spotify-gradient">Welcome to frugl flow</h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Transform messy affiliate feeds into clean, structured data for your platform
                </p>
              </div>
            </div>
            
            {allActivity.length === 0 && (
              <div className="mt-6">
                <Button asChild size="lg" className="spotify-button bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg">
                  <Link to="/upload" className="gap-2">
                    <Upload className="h-5 w-5" />
                    Get Started - Upload Your First Feed
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {allActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="spotify-card spotify-hover spotify-glow p-6 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-xl`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {allActivity.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="spotify-card spotify-glow h-full">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                      <Activity className="h-5 w-5" />
                    </div>
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Your processing history across all workflow steps
                  </CardDescription>
                </div>
                <Link to="/history">
                  <Button variant="outline" size="sm" className="gap-2 spotify-button rounded-xl">
                    <History className="h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 spotify-hover"
                    >
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center text-white shadow-lg`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">{activity.title}</p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                    </motion.div>
                  ))}

                  {recentActivity.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8" />
                      </div>
                      <p className="font-medium">No activity yet.</p>
                      <p className="text-sm mt-1">Start by uploading a feed file.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="spotify-card spotify-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  Processing Overview
                </CardTitle>
                <CardDescription>
                  Summary of your feed processing activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fileTypesProcessed.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3">File Types Processed</p>
                    <div className="flex flex-wrap gap-2">
                      {fileTypesProcessed.map(type => (
                        <Badge key={type} variant="secondary" className="bg-primary/10 text-primary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Workflow Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.min(100, Math.round((allActivity.length / 4) * 25))}%
                      </span>
                    </div>
                    <div className="spotify-progress h-3 mt-2">
                      <motion.div
                        className="spotify-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.round((allActivity.length / 4) * 25))}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {totalUploads === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No processing stats yet.</p>
                    <p className="text-xs mt-1">Upload a feed to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        /* Workflow Steps for New Users */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <Card className="spotify-card spotify-hover spotify-glow h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.gradient} opacity-10 rounded-full blur-2xl`} />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    {step.count > 0 && (
                      <Badge className="bg-primary/10 text-primary border-0">
                        {step.count}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:spotify-gradient transition-all duration-300">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button asChild variant="ghost" className="group/btn w-full justify-between spotify-button">
                    <Link to={step.link}>
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Start Guide */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="spotify-card bg-gradient-to-br from-accent/5 via-primary/5 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              Quick Start Guide
            </CardTitle>
            <CardDescription>Follow these steps to get your first feed up and running</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Upload a feed</span> - Start by uploading your affiliate feed file (CSV, JSON, or XML)
              </li>
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Map your fields</span> - Define how incoming fields map to your standardized schema
              </li>
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Design your schema</span> - Create a clean, consistent schema for your data
              </li>
              <li className="text-muted-foreground">
                <span className="text-foreground font-medium">Export your feed</span> - Generate an API endpoint or download files for your clean feed
              </li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}