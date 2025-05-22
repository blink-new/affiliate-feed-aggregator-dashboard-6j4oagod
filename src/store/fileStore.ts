import { create } from 'zustand';

export type FileInfo = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type FileData = {
  headers: string[];
  data: Record<string, string>[];
  fileType: 'csv' | 'json' | 'xml';
};

type FileStore = {
  file: FileInfo | null;
  fileData: FileData | null;
  setFile: (file: FileInfo) => void;
  setFileData: (data: FileData) => void;
  clearFile: () => void;
};

export const useFileStore = create<FileStore>((set) => ({
  file: null,
  fileData: null,
  setFile: (file) => set({ file }),
  setFileData: (fileData) => set({ fileData }),
  clearFile: () => set({ file: null, fileData: null }),
}));