import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { FeedUpload } from '@/pages/FeedUpload';
import { FieldMapping } from '@/pages/FieldMapping';
import { SchemaDesign } from '@/pages/SchemaDesign';
import { ExportFeed } from '@/pages/ExportFeed';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<FeedUpload />} />
          <Route path="mapping" element={<FieldMapping />} />
          <Route path="schema" element={<SchemaDesign />} />
          <Route path="export" element={<ExportFeed />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;