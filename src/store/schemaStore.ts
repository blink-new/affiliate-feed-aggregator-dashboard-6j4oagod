import { create } from 'zustand';

export type SchemaField = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  sourceField?: string; // Corresponding field from source data
  isCustomField?: boolean; // Added to track custom fields
};

export type CategoryMapping = {
  sourceCategory: string;
  targetCategory: string;
};

type SchemaStore = {
  // Schema fields
  fields: SchemaField[];
  addField: (field: SchemaField) => void;
  removeField: (fieldName: string) => void;
  updateField: (fieldName: string, updates: Partial<SchemaField>) => void;
  setFields: (fields: SchemaField[]) => void;
  
  // Source fields storage
  unmappedSourceFields: string[]; // Added to track unmapped source fields
  setUnmappedSourceFields: (fields: string[]) => void;
  
  // Category mappings
  categoryMappings: CategoryMapping[];
  setCategoryMappings: (mappings: CategoryMapping[]) => void;
  addCategoryMapping: (mapping: CategoryMapping) => void;
  updateCategoryMapping: (sourceCategory: string, targetCategory: string) => void;
  
  // Category format settings
  categoryFormat: 'hierarchical' | 'flat';
  categorySeparator: string;
  setCategoryFormat: (format: 'hierarchical' | 'flat') => void;
  setCategorySeparator: (separator: string) => void;
  
  // Schema metadata
  schemaName: string;
  schemaDescription: string;
  setSchemaName: (name: string) => void;
  setSchemaDescription: (description: string) => void;
  
  // Generated from fieldMappings in field mapping step
  generateInitialSchema: (
    fieldMappings: Record<string, string>,
    sourceFields: string[],
    defaultFields?: SchemaField[]
  ) => void;
  
  // Utility to get the full schema object (for export)
  getFullSchema: () => {
    name: string;
    description: string;
    fields: SchemaField[];
    categoryFormat: 'hierarchical' | 'flat';
    categorySeparator: string;
    categoryMappings: CategoryMapping[];
  };
  
  // Reset store
  clearSchema: () => void;
};

// Default schema fields that should be included
const defaultSchemaFields: SchemaField[] = [
  { name: 'id', type: 'string', required: true, description: 'Unique product identifier' },
  { name: 'title', type: 'string', required: true, description: 'Product title/name' },
  { name: 'description', type: 'string', required: false, description: 'Product description' },
  { name: 'price', type: 'number', required: true, description: 'Numeric price value' },
  { name: 'currency', type: 'string', required: true, description: 'Price currency code' },
  { name: 'category', type: 'string', required: true, description: 'Product category' },
  { name: 'image', type: 'string', required: false, description: 'Product image URL' },
  { name: 'link', type: 'string', required: true, description: 'Affiliate link URL' },
  { name: 'brand', type: 'string', required: false, description: 'Product brand name' },
  { name: 'availability', type: 'string', required: false, description: 'In stock status' },
];

export const useSchemaStore = create<SchemaStore>((set, get) => ({
  // Schema fields
  fields: [], // Start with no fields, they'll be populated from mappings
  
  // Unmapped source fields storage
  unmappedSourceFields: [],
  setUnmappedSourceFields: (unmappedSourceFields) => set({ unmappedSourceFields }),
  
  addField: (field) => set((state) => ({
    fields: [...state.fields, field]
  })),
  
  removeField: (fieldName) => set((state) => ({
    fields: state.fields.filter(field => field.name !== fieldName)
  })),
  
  updateField: (fieldName, updates) => set((state) => ({
    fields: state.fields.map(field => 
      field.name === fieldName ? { ...field, ...updates } : field
    )
  })),
  
  setFields: (fields) => set({ fields }),
  
  // Category mappings
  categoryMappings: [],
  setCategoryMappings: (categoryMappings) => set({ categoryMappings }),
  
  addCategoryMapping: (mapping) => set((state) => ({
    categoryMappings: [...state.categoryMappings, mapping]
  })),
  
  updateCategoryMapping: (sourceCategory, targetCategory) => set((state) => ({
    categoryMappings: state.categoryMappings.map(mapping => 
      mapping.sourceCategory === sourceCategory 
        ? { ...mapping, targetCategory } 
        : mapping
    )
  })),
  
  // Category format settings
  categoryFormat: 'hierarchical',
  categorySeparator: '/',
  setCategoryFormat: (categoryFormat) => set({ categoryFormat }),
  setCategorySeparator: (categorySeparator) => set({ categorySeparator }),
  
  // Schema metadata
  schemaName: 'My Product Feed Schema',
  schemaDescription: 'Standardized product feed schema',
  setSchemaName: (schemaName) => set({ schemaName }),
  setSchemaDescription: (schemaDescription) => set({ schemaDescription }),
  
  // Generate initial schema from field mappings
  generateInitialSchema: (fieldMappings, sourceFields, defaultFields = defaultSchemaFields) => {
    // Start with default schema fields
    const initialFields = defaultFields.map(defaultField => {
      // Get the mapped source field for this target field, if any
      const sourceField = fieldMappings[defaultField.name];
      const isSourceFieldValid = sourceField && sourceField !== 'not_mapped' && sourceFields.includes(sourceField);
      
      return {
        ...defaultField,
        sourceField: isSourceFieldValid ? sourceField : undefined
      };
    });

    // Find all source fields that aren't mapped to standard target fields
    const mappedSourceFields = Object.values(fieldMappings).filter(sf => sf && sf !== 'not_mapped');
    const unmappedSourceFields = sourceFields.filter(sf => !mappedSourceFields.includes(sf));
    
    // Add custom fields from additional mappings if provided
    const customMappings = fieldMappings['__custom'] || {};
    const allFields = [...initialFields];
    
    if (customMappings && typeof customMappings === 'object') {
      Object.entries(customMappings).forEach(([customName, sourceField]) => {
        if (sourceField && sourceField !== 'not_mapped' && sourceFields.includes(sourceField)) {
          allFields.push({
            name: customName,
            type: 'string', // Default type
            required: false,
            description: `Custom field mapped from ${sourceField}`,
            sourceField,
            isCustomField: true
          });
        }
      });
    }
    
    set({ 
      fields: allFields,
      unmappedSourceFields
    });
  },
  
  // Utility to get the full schema object (for export)
  getFullSchema: () => {
    const state = get();
    return {
      name: state.schemaName,
      description: state.schemaDescription,
      fields: state.fields,
      categoryFormat: state.categoryFormat,
      categorySeparator: state.categorySeparator,
      categoryMappings: state.categoryMappings
    };
  },
  
  // Reset store
  clearSchema: () => set({
    fields: [],
    unmappedSourceFields: [],
    categoryMappings: [],
    categoryFormat: 'hierarchical',
    categorySeparator: '/',
    schemaName: 'My Product Feed Schema',
    schemaDescription: 'Standardized product feed schema'
  })
}));