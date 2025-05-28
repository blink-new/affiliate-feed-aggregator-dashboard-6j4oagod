import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FileInfo } from './fileStore';
import { SchemaField, CategoryMapping } from './schemaStore';

// Base interface for all history records
export interface HistoryRecord {
  id: string;
  timestamp: number;
  name: string;
}

// Upload History Record
export interface UploadHistoryRecord extends HistoryRecord {
  fileInfo: FileInfo;
  recordCount: number;
  fileType: string;
  previewData?: Record<string, string>[];
  fullData?: Record<string, string>[];
}

// Field Mapping History Record
export interface MappingHistoryRecord extends HistoryRecord {
  sourceFields: string[];
  mappings: Record<string, string>;
  customFields: {
    id: string;
    name: string;
    sourceField: string;
  }[];
  unmappedFields: string[];
}

// Schema History Record
export interface SchemaHistoryRecord extends HistoryRecord {
  schemaName: string;
  schemaDescription: string;
  fields: SchemaField[];
  categoryFormat: 'hierarchical' | 'flat';
  categorySeparator: string;
  categoryMappings: CategoryMapping[];
}

// Export History Record
export interface ExportHistoryRecord extends HistoryRecord {
  exportType: 'api' | 'json' | 'csv';
  recordCount: number;
  filters?: Record<string, string>;
  url?: string;
  fileName?: string;
}

interface HistoryStore {
  // Upload History
  uploadHistory: UploadHistoryRecord[];
  addUploadHistory: (record: Omit<UploadHistoryRecord, 'id' | 'timestamp'>) => string;
  getUploadHistory: (id: string) => UploadHistoryRecord | undefined;
  
  // Field Mapping History
  mappingHistory: MappingHistoryRecord[];
  addMappingHistory: (record: Omit<MappingHistoryRecord, 'id' | 'timestamp'>) => string;
  getMappingHistory: (id: string) => MappingHistoryRecord | undefined;
  
  // Schema History
  schemaHistory: SchemaHistoryRecord[];
  addSchemaHistory: (record: Omit<SchemaHistoryRecord, 'id' | 'timestamp'>) => string;
  getSchemaHistory: (id: string) => SchemaHistoryRecord | undefined;
  
  // Export History
  exportHistory: ExportHistoryRecord[];
  addExportHistory: (record: Omit<ExportHistoryRecord, 'id' | 'timestamp'>) => string;
  getExportHistory: (id: string) => ExportHistoryRecord | undefined;
  
  // Utility functions
  clearHistory: (type?: 'upload' | 'mapping' | 'schema' | 'export') => void;
}

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      uploadHistory: [],
      mappingHistory: [],
      schemaHistory: [],
      exportHistory: [],
      
      // Upload History
      addUploadHistory: (record) => {
        const id = generateId();
        set((state) => ({
          uploadHistory: [
            {
              ...record,
              id,
              timestamp: Date.now(),
            },
            ...state.uploadHistory,
          ]
        }));
        return id;
      },
      
      getUploadHistory: (id) => {
        return get().uploadHistory.find(record => record.id === id);
      },
      
      // Field Mapping History
      addMappingHistory: (record) => {
        const id = generateId();
        set((state) => ({
          mappingHistory: [
            {
              ...record,
              id,
              timestamp: Date.now(),
            },
            ...state.mappingHistory,
          ]
        }));
        return id;
      },
      
      getMappingHistory: (id) => {
        return get().mappingHistory.find(record => record.id === id);
      },
      
      // Schema History
      addSchemaHistory: (record) => {
        const id = generateId();
        set((state) => ({
          schemaHistory: [
            {
              ...record,
              id,
              timestamp: Date.now(),
            },
            ...state.schemaHistory,
          ]
        }));
        return id;
      },
      
      getSchemaHistory: (id) => {
        return get().schemaHistory.find(record => record.id === id);
      },
      
      // Export History
      addExportHistory: (record) => {
        const id = generateId();
        set((state) => ({
          exportHistory: [
            {
              ...record,
              id,
              timestamp: Date.now(),
            },
            ...state.exportHistory,
          ]
        }));
        return id;
      },
      
      getExportHistory: (id) => {
        return get().exportHistory.find(record => record.id === id);
      },
      
      // Clear history
      clearHistory: (type) => {
        if (!type) {
          set({
            uploadHistory: [],
            mappingHistory: [],
            schemaHistory: [],
            exportHistory: [],
          });
        } else {
          switch (type) {
            case 'upload':
              set({ uploadHistory: [] });
              break;
            case 'mapping':
              set({ mappingHistory: [] });
              break;
            case 'schema':
              set({ schemaHistory: [] });
              break;
            case 'export':
              set({ exportHistory: [] });
              break;
          }
        }
      },
    }),
    {
      name: 'feedflow-history',
    }
  )
);