import { useParams, useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ExportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const historyStore = useHistoryStore();
  const exportItem = historyStore.getExportHistory(id!);

  if (!exportItem) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Export Not Found</CardTitle>
            <CardDescription>
              No export found for this ID. Try another or go back to history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-2">
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Export: {exportItem.name}</CardTitle>
          <CardDescription>
            Type: {exportItem.exportType.toUpperCase()}<br />
            Records: {exportItem.recordCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Export details and download links would appear here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
