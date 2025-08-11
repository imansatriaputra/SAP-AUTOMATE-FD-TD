// File storage utilities for WebContainer environment

export interface StoredFile {
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content: string;
}

const STORAGE_KEY = 'accenture_crm_files';

// Store file in localStorage with content for WebContainer compatibility
export async function storeFileLocally(file: File): Promise<StoredFile> {
  try {
    // Read file content
    const content = await readFileContent(file);
    
    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}_${file.name}`;
    const storagePath = `./uploads/${fileName}`;
    
    const storedFile: StoredFile = {
      name: file.name,
      path: storagePath,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      content: content
    };
    
    // Get existing files
    const existingFiles = getStoredFiles();
    
    // Add new file
    existingFiles.push(storedFile);
    
    // Store in localStorage
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(existingFiles));
    
    // console.log(`File stored locally: ${storagePath}`);
    
    return storedFile;
  } catch (error) {
    console.error('Error storing file:', error);
    throw new Error('Failed to store file locally');
  }
}

// Read file content as text
function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file content'));
    };
    reader.readAsText(file);
  });
}

// Get all stored files
export function getStoredFiles(): StoredFile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const files = JSON.parse(stored);
    // Convert date strings back to Date objects
    return files.map((file: any) => ({
      ...file,
      uploadedAt: new Date(file.uploadedAt)
    }));
  } catch (error) {
    console.error('Error retrieving stored files:', error);
    return [];
  }
}

// Get specific file content by path
export function getFileContent(path: string): string | null {
  try {
    const files = getStoredFiles();
    const file = files.find(f => f.path === path);
    return file?.content || null;
  } catch (error) {
    console.error('Error retrieving file content:', error);
    return null;
  }
}

// Get file by path
export function getStoredFile(path: string): StoredFile | null {
  try {
    const files = getStoredFiles();
    return files.find(f => f.path === path) || null;
  } catch (error) {
    console.error('Error retrieving file:', error);
    return null;
  }
}

// Delete stored file
export function deleteStoredFile(path: string): boolean {
  try {
    const files = getStoredFiles();
    const filteredFiles = files.filter(f => f.path !== path);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiles));
    
    // Also try to delete from file system
    deleteFileFromSystem(path).catch(err => {
      console.warn('Could not delete file from system:', err.message);
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Clear all stored files
export function clearAllStoredFiles(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    
    // Also try to clear from file system
    clearSystemFiles().catch(err => {
      console.warn('Could not clear system files:', err.message);
    });
  } catch (error) {
    console.error('Error clearing stored files:', error);
  }
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Write file content to WebContainer file system using WebContainer API
export async function writeFileToSystem(storedFile: StoredFile): Promise<string> {
  try {
    // Use WebContainer API for file system operations
    const { WebContainer } = await import('@webcontainer/api');
    
    // Get or create WebContainer instance
    let webcontainer: any;
    try {
      // Try to get existing instance
      webcontainer = (window as any).__webcontainer;
      if (!webcontainer) {
        // Boot new WebContainer instance
        webcontainer = await WebContainer.boot();
        (window as any).__webcontainer = webcontainer;
      }
    } catch (error) {
      console.warn('WebContainer not available, using fallback storage');
      return storedFile.path;
    }
    
    // Create uploads directory
    try {
      await webcontainer.fs.mkdir('uploads', { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
    
    // Write file to WebContainer file system
    await webcontainer.fs.writeFile(storedFile.path, storedFile.content);
    
    console.log(`File written to WebContainer file system: ${storedFile.path}`);
    return storedFile.path;
  } catch (error) {
    console.warn('Failed to write to WebContainer file system:', error);
    // Return path anyway since file is stored in localStorage
    return storedFile.path;
  }
}

// Delete file from WebContainer file system
async function deleteFileFromSystem(path: string): Promise<void> {
  try {
    const { WebContainer } = await import('@webcontainer/api');
    const webcontainer = (window as any).__webcontainer;
    
    if (webcontainer) {
      await webcontainer.fs.rm(path);
      console.log(`File deleted from system: ${path}`);
    }
  } catch (error) {
    console.warn('Could not delete file from system:', error);
  }
}

// Clear all files from WebContainer file system
async function clearSystemFiles(): Promise<void> {
  try {
    const { WebContainer } = await import('@webcontainer/api');
    const webcontainer = (window as any).__webcontainer;
    
    if (webcontainer) {
      try {
        await webcontainer.fs.rm('uploads', { recursive: true, force: true });
        console.log('All system files cleared');
      } catch (error) {
        // Directory might not exist, ignore error
      }
    }
  } catch (error) {
    console.warn('Could not clear system files:', error);
  }
}

// Create a simple API endpoint simulation for backend integration
export async function createFileEndpoint(storedFile: StoredFile): Promise<string> {
  try {
    // Write file to system first
    const systemPath = await writeFileToSystem(storedFile);
    
    // Return the path that Python code can use
    return systemPath;
  } catch (error) {
    console.error('Error creating file endpoint:', error);
    throw new Error('Failed to create file endpoint');
  }
}

// List all files in the uploads directory (for Python integration)
export async function listSystemFiles(): Promise<string[]> {
  try {
    const { WebContainer } = await import('@webcontainer/api');
    const webcontainer = (window as any).__webcontainer;
    
    if (webcontainer) {
      try {
        const files = await webcontainer.fs.readdir('uploads');
        return files.map((file: string) => `./uploads/${file}`);
      } catch (error) {
        // Directory might not exist
        return [];
      }
    }
    
    return [];
  } catch (error) {
    console.warn('Could not list system files:', error);
    return [];
  }
}

// Read file content from WebContainer file system (for Python integration)
export async function readSystemFile(path: string): Promise<string | null> {
  try {
    const { WebContainer } = await import('@webcontainer/api');
    const webcontainer = (window as any).__webcontainer;
    
    if (webcontainer) {
      const content = await webcontainer.fs.readFile(path, 'utf-8');
      return content;
    }
    
    return null;
  } catch (error) {
    console.warn('Could not read system file:', error);
    return null;
  }
}