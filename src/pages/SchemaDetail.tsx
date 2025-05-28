import { useParams, useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SchemaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const historyStore = useHistoryStore();
  const schema = historyStore.getSchemaHistory(id!);

  if (!schema) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Schema Not Found</CardTitle>
            <CardDescription>
              No schema found for this ID. Try another or go back to history.
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
          <CardTitle>Schema: {schema.schemaName}</CardTitle>
          <CardDescription>
            {schema.fields.length} fields, {schema.categoryMappings.length} categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium">Field Name</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Required</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {schema.fields.map((field, i) => (
                  <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2">{field.name}</td>
                    <td className="px-4 py-2">{field.type}</td>
                    <td className="px-4 py-2">{field.required ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">{field.description}</td>
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
