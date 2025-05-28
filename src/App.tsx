import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { FeedUpload } from '@/pages/FeedUpload';
import { FieldMapping } from '@/pages/FieldMapping';
import { SchemaDesign } from '@/pages/SchemaDesign';
import { ExportFeed } from '@/pages/ExportFeed';
import { Settings } from '@/pages/Settings';
import UploadDetail from '@/pages/UploadDetail';
import MappingDetail from '@/pages/MappingDetail';
import SchemaDetail from '@/pages/SchemaDetail';
import ExportDetail from '@/pages/ExportDetail';
import DataExplorer from '@/pages/DataExplorer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<FeedUpload />}>
            <Route path=":id" element={<UploadDetail />} />
          </Route>
          <Route path="mapping" element={<FieldMapping />}>
            <Route path=":id" element={<MappingDetail />} />
          </Route>
          <Route path="schema" element={<SchemaDesign />}>
            <Route path=":id" element={<SchemaDetail />} />
          </Route>
          <Route path="export" element={<ExportFeed />}>
            <Route path=":id" element={<ExportDetail />} />
          </Route>
          <Route path="data-explorer" element={<DataExplorer />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;