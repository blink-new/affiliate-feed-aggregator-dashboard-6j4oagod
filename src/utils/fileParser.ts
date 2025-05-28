export type ParsedData = {
  headers: string[];
  rows: Record<string, string>[];
  fileType: 'csv' | 'json' | 'xml' | string;
  fileName: string;
  fileSize: number;
};

/**
 * Parses a CSV file into an array of objects
 */
export const parseCSV = (content: string): { headers: string[], rows: Record<string, string>[] } => {
  // Split by newline and filter out empty lines
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  
  // Parse headers (first line)
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse rows (remaining lines)
  const rows = lines.slice(1).map(line => {
    // Handle quoted values with commas inside
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue.trim());
    
    // Create object from headers and values
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    return row;
  });
  
  return { headers, rows };
};

/**
 * Parses a JSON file into an array of objects
 */
export const parseJSON = (content: string): { headers: string[], rows: Record<string, string>[] } => {
  try {
    const json = JSON.parse(content);
    
    // If it's an array
    if (Array.isArray(json) && json.length > 0) {
      // Extract all possible headers from all objects
      const headers = Array.from(
        new Set(
          json.flatMap(item => Object.keys(item))
        )
      );
      
      // Map each item to ensure it has all headers
      const rows = json.map(item => {
        const row: Record<string, string> = {};
        headers.forEach(header => {
          // Convert all values to strings
          const value = item[header];
          row[header] = value !== undefined && value !== null 
            ? (typeof value === 'object' ? JSON.stringify(value) : String(value)) 
            : '';
        });
        return row;
      });
      
      return { headers, rows };
    } else if (typeof json === 'object' && json !== null) {
      // If it's a single object, treat it as one row
      const headers = Object.keys(json);
      const row: Record<string, string> = {};
      
      headers.forEach(header => {
        const value = json[header];
        row[header] = value !== undefined && value !== null 
          ? (typeof value === 'object' ? JSON.stringify(value) : String(value)) 
          : '';
      });
      
      return { headers, rows: [row] };
    }
    
    return { headers: [], rows: [] };
  } catch (error) {
    console.error('Error parsing JSON file:', error);
    return { headers: [], rows: [] };
  }
};

/**
 * Simple XML parser
 * For production use, consider using a proper XML parser library
 */
export const parseXML = (content: string): { headers: string[], rows: Record<string, string>[] } => {
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    
    // Get all elements that might be rows (this is a simplified approach)
    const rootElement = xmlDoc.documentElement;
    const possibleRowElements = Array.from(rootElement.children);
    
    if (possibleRowElements.length === 0) {
      return { headers: [], rows: [] };
    }
    
    // Extract all attribute names and child element names as potential headers
    const headers = new Set<string>();
    possibleRowElements.forEach(element => {
      // Add attribute names
      Array.from(element.attributes).forEach(attr => {
        headers.add(attr.name);
      });
      
      // Add child element names
      Array.from(element.children).forEach(child => {
        headers.add(child.tagName);
      });
    });
    
    // Convert rows to objects
    const rows = possibleRowElements.map(element => {
      const row: Record<string, string> = {};
      
      // Initialize all headers with empty strings
      Array.from(headers).forEach(header => {
        row[header] = '';
      });
      
      // Set attribute values
      Array.from(element.attributes).forEach(attr => {
        row[attr.name] = attr.value;
      });
      
      // Set child element values
      Array.from(element.children).forEach(child => {
        row[child.tagName] = child.textContent || '';
      });
      
      return row;
    });
    
    return { headers: Array.from(headers), rows };
  } catch (error) {
    console.error('Error parsing XML file:', error);
    return { headers: [], rows: [] };
  }
};

/**
 * Detects the file type from the file extension
 */
export const detectFileType = (fileName: string): 'csv' | 'json' | 'xml' | string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (extension === 'csv') return 'csv';
  if (extension === 'json') return 'json';
  if (extension === 'xml') return 'xml';
  
  return extension;
};

/**
 * Reads and parses a file based on its file type
 */
export const parseFile = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileType = detectFileType(file.name);
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let result;
        
        switch (fileType) {
          case 'csv':
            result = parseCSV(content);
            break;
          case 'json':
            result = parseJSON(content);
            break;
          case 'xml':
            result = parseXML(content);
            break;
          default:
            // Attempt to detect the format from content
            if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
              result = parseJSON(content);
            } else if (content.trim().startsWith('<')) {
              result = parseXML(content);
            } else {
              // Assume CSV as a fallback
              result = parseCSV(content);
            }
        }
        
        resolve({
          ...result,
          fileType,
          fileName: file.name,
          fileSize: file.size
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};