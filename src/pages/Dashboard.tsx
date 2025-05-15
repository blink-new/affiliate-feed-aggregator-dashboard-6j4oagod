import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileJson, Database, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Dashboard() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

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
