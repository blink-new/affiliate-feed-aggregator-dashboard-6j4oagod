import { useParams, useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function UploadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const historyStore = useHistoryStore();
  const upload = historyStore.getUploadHistory(id!);

  if (!upload) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Upload Not Found</CardTitle>
            <CardDescription>
              No upload found for this ID. Try another or go back to history.
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
          <CardTitle>Upload: {upload.name}</CardTitle>
          <CardDescription>
            File type: {upload.fileType.toUpperCase()}<br />
            Records: {upload.recordCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {upload.previewData && Object.keys(upload.previewData[0] || {}).map((header) => (
                    <th key={header} className="text-left px-4 py-2 font-medium">
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upload.previewData && upload.previewData.map((row, i) => (
                  <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    {Object.keys(row).map((key) => (
                      <td key={key} className="px-4 py-2 truncate max-w-[200px]">
                        {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
