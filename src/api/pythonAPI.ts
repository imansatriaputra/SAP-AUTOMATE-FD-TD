// Placeholder API functions for Python backend integration

export interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

// FastAPI backend URL - update this when deploying to production
// const API_BASE_URL = 'http://localhost:8000';
// const API_BASE_URL = 'http://0.0.0.0:8001/';
const API_BASE_URL = 'http://127.0.0.1:8001';

// Export API_BASE_URL for use in other components
export { API_BASE_URL };

// Integration with main.py via FastAPI
export async function processHTMLWithMainPy(htmlFile: File): Promise<ProcessingResult> {
  try {
    // Create FormData to send file to FastAPI backend
    const formData = new FormData();
    formData.append('html_file', htmlFile, htmlFile.name);
    
    // Send to FastAPI backend
    const response = await fetch(`${API_BASE_URL}/api/process-html`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process HTML file');
    }
    
    const result = await response.json();
    
    // Extract FSD analysis data from main.py response
    const fsdData = result.fsd_analysis || {};
    
    return {
      success: true,
      data: {
        // FSD Analysis data from main.py
        program_name: fsdData.program_name || 'Unknown Program',
        report_description: fsdData.report_description || 'No description available',
        transaction_code: fsdData.transaction_code || 'N/A',
        selection_parameters: fsdData.selection_parameters || 0,
        field_mappings: fsdData.field_mappings || 0,
        error_scenarios: fsdData.error_scenarios || 0,
        test_scenarios: fsdData.test_scenarios || 0,
        validation_rules: fsdData.validation_rules || 0,
        authorization_objects: fsdData.authorization_objects || 0,
        user_requirements: fsdData.user_requirements || false,
        assumptions: fsdData.assumptions || false,
        raw_summary_lines: fsdData.summary_lines || [],
        processing_timestamp: fsdData.timestamp || new Date().toISOString(),
        html_content_length: htmlFile.size
      },
      markdown: result.markdown_content || 'No markdown generated',
      output_files: result.output_files    };
  } catch (error) {
    console.error('Error processing HTML file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Integration with firstStart.py via FastAPI
export async function generateDocumentWithFirstStart(markdownContent: string, templateType: string): Promise<ProcessingResult> {
  try {
    // Send markdown to FastAPI backend for document generation
    const response = await fetch(`${API_BASE_URL}/api/generate-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        markdown: markdownContent,
        template_type: templateType
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate document');
    }
    
    const result = await response.json();
    return {
      success: true,
      data: result.document
    };
  } catch (error) {
    console.error('Error generating document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Health check for backend connection
export async function checkBackendHealth(): Promise<ProcessingResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }
    
    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Backend connection failed'
    };
  }
}

// Database lookup placeholder
export async function lookupCSVDatabase(query: string): Promise<ProcessingResult> {
  try {
    // This will connect to your CSV database lookup
    const response = await fetch('/api/csv-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error('Database lookup failed');
    }
    
    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Template lookup placeholder
export async function getDocumentTemplate(templateType: string): Promise<ProcessingResult> {
  try {
    // This will fetch document templates
    const response = await fetch(`/api/templates/${templateType}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }
    
    const template = await response.json();
    return {
      success: true,
      data: template
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}