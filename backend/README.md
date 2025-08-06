# FastAPI Backend for Accenture SAP Document Processor

This FastAPI backend stores HTML files in the local file system and processes them using your main.py and firstStart.py logic.

## Setup Instructions

1. **Install Python Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the FastAPI Server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access the API**:
   - API will be available at: `http://localhost:8000`
   - Interactive API docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

## API Endpoints

### POST /api/store-file
- **Purpose**: Store uploaded HTML files in local file system
- **Input**: HTML file upload
- **Output**: File path where the file is stored

### GET /api/list-files
- **Purpose**: Get list of all stored HTML files
- **Output**: Array of stored file information

### DELETE /api/delete-file
- **Purpose**: Delete a specific stored file
- **Input**: File path
- **Output**: Success confirmation

### DELETE /api/clear-files
- **Purpose**: Clear all stored files
- **Output**: Success confirmation

### POST /api/process-html
- **Purpose**: Process stored HTML files with main.py logic
- **Input**: Reference to stored HTML file
- **Output**: Processed data and markdown insights

### POST /api/generate-document
- **Purpose**: Generate final document using firstStart.py logic
- **Input**: Markdown content and template type
- **Output**: Final document ready for download

### GET /api/health
- **Purpose**: Health check endpoint
- **Output**: Server status

## Integration with Your Code

### File Storage
- HTML files are stored in the `uploads/` directory in the backend
- Files are given unique names with timestamps to prevent conflicts
- Your Python code can directly read files using standard file operations

### Your main.py Integration
1. **Replace `process_html_with_main_py()` function** with your actual main.py logic
2. **Your code can directly read the HTML file**:
   ```python
   def process_html_with_main_py(html_content: str, file_path: str):
       # Read the file directly from the file system
       with open(file_path, 'r', encoding='utf-8') as f:
           html_data = f.read()
       
       # Your existing main.py logic here
       result = your_existing_function(html_data)
       return result
   ```

### Your firstStart.py Integration
1. **Replace `generate_document_with_first_start_py()` function** with your actual firstStart.py logic
2. **The function receives markdown content and template type as parameters**

## File Storage

- **Location**: All HTML files are stored in the `uploads/` directory
- **Naming**: Files are given unique names with timestamps (e.g., `2024-01-15T10-30-45-123Z_document.html`)
- **Access**: Your Python code can directly read files using the provided file path
- **Persistence**: Files remain on disk until explicitly deleted

## Direct File Access for Python Code

Your main.py code can now directly access uploaded HTML files:

```python
# Example of how your main.py can read the stored HTML file
def your_main_py_function(file_path: str):
    # Read the HTML file directly from the file system
    with open(file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    # Process the HTML content with your existing logic
    # ... your processing code here ...
    
    return processed_result
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)

Add your production frontend URL to the `allow_origins` list when deploying.