import { useHistoryStore } from '../store/historyStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Upload, FileJson, Database, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const historyStore = useHistoryStore();
  const navigate = useNavigate();

  const uploadHistory = historyStore.uploadHistory;
  const mappingHistory = historyStore.mappingHistory;
  const schemaHistory = historyStore.schemaHistory;
  const exportHistory = historyStore.exportHistory;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">History</h1>
        <p className="text-muted-foreground mb-6">All your feed uploads, mappings, schemas, and exports in one place.</p>
      </div>
      <Tabs defaultValue="uploads">
        <TabsList>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="mappings">Mappings</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>
        <TabsContent value="uploads" className="mt-6">
          {uploadHistory.length === 0 ? (
            <div className="text-muted-foreground">No uploads yet.</div>
          ) : (
            <div className="space-y-4">
              {uploadHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/upload/${item.id}`)}>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Upload className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">{item.fileType.toUpperCase()}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{item.recordCount} records</span>
                      <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="mappings" className="mt-6">
          {mappingHistory.length === 0 ? (
            <div className="text-muted-foreground">No mappings yet.</div>
          ) : (
            <div className="space-y-4">
              {mappingHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/mapping/${item.id}`)}>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <FileJson className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">{item.sourceFields.length} fields</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{Object.values(item.mappings).filter(v => v && v !== 'not_mapped').length} mapped</span>
                      <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="schemas" className="mt-6">
          {schemaHistory.length === 0 ? (
            <div className="text-muted-foreground">No schemas yet.</div>
          ) : (
            <div className="space-y-4">
              {schemaHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/schema/${item.id}`)}>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Database className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-base font-semibold">{item.schemaName}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">{item.fields.length} fields</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{item.categoryMappings.length} categories</span>
                      <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="exports" className="mt-6">
          {exportHistory.length === 0 ? (
            <div className="text-muted-foreground">No exports yet.</div>
          ) : (
            <div className="space-y-4">
              {exportHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/export/${item.id}`)}>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Share2 className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">{item.exportType.toUpperCase()}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{item.recordCount} records</span>
                      <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}