import { useState, useMemo } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useDebounce } from '../hooks/useDebounce';

const PAGE_SIZE = 25;

export default function DataExplorer() {
  const historyStore = useHistoryStore();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [page, setPage] = useState(1);

  // Aggregate all uploaded data rows (use fullData if available, fallback to previewData)
  const allData = useMemo(() => {
    return historyStore.uploadHistory.flatMap(upload =>
      (upload.fullData && Array.isArray(upload.fullData) && upload.fullData.length > 0)
        ? upload.fullData
        : (upload.previewData || [])
    );
  }, [historyStore.uploadHistory]);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return allData;
    const lower = debouncedSearch.toLowerCase();
    return allData.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(lower))
    );
  }, [allData, debouncedSearch]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Get all unique keys for table headers
  const headers = useMemo(() => {
    const keys = new Set<string>();
    allData.forEach(row => {
      Object.keys(row).forEach(key => keys.add(key));
    });
    return Array.from(keys);
  }, [allData]);

  // Card view helpers
  function splitFields(row: Record<string, any>) {
    const filled: [string, any][] = [];
    const empty: [string, any][] = [];
    for (const key of headers) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
        filled.push([key, row[key]]);
      } else {
        empty.push([key, row[key]]);
      }
    }
    return { filled, empty };
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Data Explorer</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search data..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-muted-foreground">No data found.</p>
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {headers.map(header => (
                  <th key={header} className="text-left px-4 py-2 font-medium">
                    {header.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  {headers.map(header => (
                    <td key={header} className="px-4 py-2 truncate max-w-[200px]">
                      {typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground">
              Showing {filteredData.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
              -{Math.min(page * PAGE_SIZE, filteredData.length)} of {filteredData.length}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-xs">Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedData.map((row, i) => {
            const { filled, empty } = splitFields(row);
            const [showAll, setShowAll] = useState(false);
            return (
              <Card key={i} className="p-4">
                <CardHeader>
                  <CardTitle>Record {(page - 1) * PAGE_SIZE + i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    {filled.map(([header, value]) => (
                      <div key={header} className="flex justify-between">
                        <dt className="font-semibold text-muted-foreground">{header.replace(/_/g, ' ')}</dt>
                        <dd className="truncate max-w-[150px]">{typeof value === 'object' ? JSON.stringify(value) : String(value || '')}</dd>
                      </div>
                    ))}
                  </dl>
                  {empty.length > 0 && (
                    <div className="mt-2">
                      <Button size="sm" variant="ghost" onClick={() => setShowAll(s => !s)}>
                        {showAll ? 'Hide Empty Fields' : `Show ${empty.length} Empty Fields`}
                      </Button>
                      {showAll && (
                        <dl className="space-y-2 mt-2">
                          {empty.map(([header, value]) => (
                            <div key={header} className="flex justify-between">
                              <dt className="font-semibold text-muted-foreground">{header.replace(/_/g, ' ')}</dt>
                              <dd className="truncate max-w-[150px]">{typeof value === 'object' ? JSON.stringify(value) : String(value || '')}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}