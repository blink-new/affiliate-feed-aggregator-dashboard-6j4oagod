import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Database, Shield, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'react-hot-toast';

export function Settings() {
  const [profileSettings, setProfileSettings] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    company: 'Acme Affiliates'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    feedUpdates: true,
    weeklyReports: true,
    systemUpdates: false
  });
  
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '90',
    anonymizeData: false
  });
  
  const [apiSettings, setApiSettings] = useState({
    rateLimit: '1000',
    ipRestriction: false,
    referrerRestriction: false,
    webhooksEnabled: true
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileSettings({
      ...profileSettings,
      [field]: value
    });
  };

  const handleNotificationToggle = (field: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: !notificationSettings[field as keyof typeof notificationSettings]
    });
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
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
            <SettingsIcon className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            API & Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://ui.shadcn.com/avatars/01.png" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileSettings.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={profileSettings.company}
                      onChange={(e) => handleProfileUpdate('company', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cet">CET (Central European Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Customize how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <Label>Feed Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when feeds are updated
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.feedUpdates}
                      onCheckedChange={() => handleNotificationToggle('feedUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive weekly usage and analytics reports
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified about system changes and maintenance
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={() => handleNotificationToggle('systemUpdates')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Configure how your feed data is stored and managed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <Label>Automatic Backups</Label>
                      <p className="text-xs text-muted-foreground">
                        Regularly backup your feed data
                      </p>
                    </div>
                    <Switch 
                      checked={dataSettings.autoBackup}
                      onCheckedChange={() => setDataSettings({...dataSettings, autoBackup: !dataSettings.autoBackup})}
                    />
                  </div>
                  
                  {dataSettings.autoBackup && (
                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <Select 
                        value={dataSettings.backupFrequency}
                        onValueChange={(value) => setDataSettings({...dataSettings, backupFrequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2 border-b pb-3">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input 
                      id="dataRetention" 
                      type="number"
                      value={dataSettings.dataRetention}
                      onChange={(e) => setDataSettings({...dataSettings, dataRetention: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days to keep historical data before automatic purging
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anonymize Data</Label>
                      <p className="text-xs text-muted-foreground">
                        Remove personally identifiable information from data
                      </p>
                    </div>
                    <Switch 
                      checked={dataSettings.anonymizeData}
                      onCheckedChange={() => setDataSettings({...dataSettings, anonymizeData: !dataSettings.anonymizeData})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>API & Security Settings</CardTitle>
                <CardDescription>
                  Configure API access and security controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2 border-b pb-3">
                    <Label htmlFor="rateLimit">API Rate Limit (requests per day)</Label>
                    <Input 
                      id="rateLimit" 
                      type="number"
                      value={apiSettings.rateLimit}
                      onChange={(e) => setApiSettings({...apiSettings, rateLimit: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of API requests allowed per day
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <Label>IP Restriction</Label>
                      <p className="text-xs text-muted-foreground">
                        Limit API access to specific IP addresses
                      </p>
                    </div>
                    <Switch 
                      checked={apiSettings.ipRestriction}
                      onCheckedChange={() => setApiSettings({...apiSettings, ipRestriction: !apiSettings.ipRestriction})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <Label>Referrer Restriction</Label>
                      <p className="text-xs text-muted-foreground">
                        Limit API access to specific domain referrers
                      </p>
                    </div>
                    <Switch 
                      checked={apiSettings.referrerRestriction}
                      onCheckedChange={() => setApiSettings({...apiSettings, referrerRestriction: !apiSettings.referrerRestriction})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Webhooks</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable webhook notifications for feed events
                      </p>
                    </div>
                    <Switch 
                      checked={apiSettings.webhooksEnabled}
                      onCheckedChange={() => setApiSettings({...apiSettings, webhooksEnabled: !apiSettings.webhooksEnabled})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => toast.success('Security audit initiated. Results will be emailed to you.')}
                >
                  Run Security Audit
                </Button>
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}