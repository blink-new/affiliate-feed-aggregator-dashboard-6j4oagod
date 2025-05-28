import { useParams, useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

export default function MappingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const historyStore = useHistoryStore();
  const mapping = historyStore.getMappingHistory(id!);

  if (!mapping) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Mapping Not Found</CardTitle>
            <CardDescription>
              No mapping found for this ID. Try another or go back to history.
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
          <CardTitle>Mapping: {mapping.name}</CardTitle>
          <CardDescription>
            {mapping.sourceFields.length} source fields, {Object.values(mapping.mappings).filter(v => v && v !== 'not_mapped').length} mapped
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-2 border-b bg-muted/30">
              <div className="p-3 font-medium text-sm border-r">Source Field</div>
              <div className="p-3 font-medium text-sm">Target Field</div>
            </div>
            {Object.entries(mapping.mappings)
              .filter(([_targetField, sourceField]) => sourceField && sourceField !== 'not_mapped')
              .map(([targetField, sourceField]) => (
                <div key={targetField} className="grid grid-cols-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="p-3 text-sm border-r truncate">{sourceField}</div>
                  <div className="p-3 text-sm flex items-center gap-2">
                    <span>{targetField}</span>
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            historyStore.loadMappingToStore(id!);
            navigate('/mapping');
          }}>
            Load This Mapping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
