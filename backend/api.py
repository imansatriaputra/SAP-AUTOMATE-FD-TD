import os
import json
import uuid
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel

# Instantiate the FastAPI app
app = FastAPI(
    title="Accenture SAP FSD Document Processor",
    version="1.0.0",
    description="AI-Powered SAP ABAP Functional Specification Design Generator API"
)

# Enable CORS (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories for uploads, outputs, templates, config
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "output"
TEMPLATE_DIR = "templates"
CONFIG_DIR = "config"
for d in [UPLOAD_DIR, OUTPUT_DIR, TEMPLATE_DIR, CONFIG_DIR]:
    os.makedirs(d, exist_ok=True)

# In-memory stores (you can persist these if needed)
stored_files = []
processing_jobs = {}
fsd_generator = None  # Will hold your FSD generator instance

# Pydantic models for request bodies
class ConfigurationRequest(BaseModel):
    GEMINI_API_KEY: str
    gemini_api_url: str
    project_name: str
    max_tokens: int
    temperature: float
    requirement_list_excel: str

class ProcessingRequest(BaseModel):
    file_paths: list[str]
    template_path: str | None = None
    output_dir: str | None = None

class FileDeleteRequest(BaseModel):
    path: str

# Health & Root endpoints
@app.get("/")
async def root():
    return {"message": "API is running", "version": app.version}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Configuration endpoint
def initialize_fsd_generator(config_data: dict):
    global fsd_generator
    # TODO: import and initialize your EnhancedIntelligentFSDGenerator here
    # from your_module import EnhancedIntelligentFSDGenerator
    # fsd_generator = EnhancedIntelligentFSDGenerator(config_file_or_data)
    fsd_generator = True  # placeholder

@app.post("/api/configure")
async def configure_fsd_generator(cfg: ConfigurationRequest):
    config_data = cfg.dict()
    initialize_fsd_generator(config_data)
    return {"success": True, "message": "Generator configured"}

# File upload endpoint
@app.post("/api/store-file")
async def store_file_locally(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.html', '.htm')):
        raise HTTPException(status_code=400, detail="Only HTML files allowed")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{os.path.splitext(file.filename)[0]}_{timestamp}.html"
    path = os.path.join(UPLOAD_DIR, filename)
    content = await file.read()
    with open(path, 'wb') as f:
        f.write(content)
    info = {"id": str(uuid.uuid4()), "path": path, "name": filename}
    stored_files.append(info)
    return {"success": True, "file_info": info}

# List stored files
@app.get("/api/list-files")
async def list_files():
    return {"success": True, "files": stored_files}

# Processing endpoint (starts background job)
@app.post("/api/process-files")
async def process_files(
    background_tasks: BackgroundTasks,
    request: ProcessingRequest
):
    if not fsd_generator:
        raise HTTPException(status_code=503, detail="Generator not configured")
    valid = [p for p in request.file_paths if os.path.exists(p)]
    if not valid:
        raise HTTPException(status_code=400, detail="No valid file paths")
    job_id = str(uuid.uuid4())
    processing_jobs[job_id] = {"status": "pending", "progress": 0}
    background_tasks.add_task(
        _process_job, job_id, valid, request.template_path, request.output_dir or OUTPUT_DIR
    )
    return {"success": True, "job_id": job_id}

async def _process_job(job_id: str, paths: list[str], tpl: str | None, out_dir: str):
    processing_jobs[job_id]["status"] = "processing"
    processing_jobs[job_id]["progress"] = 50
    # TODO: call your fsd_generator.process_file or process_multiple_files here
    # For now, we simulate completion
    processing_jobs[job_id]["status"] = "completed"
    processing_jobs[job_id]["progress"] = 100
    processing_jobs[job_id]["results"] = {"processed": paths}

# Job status & results
@app.get("/api/job-status/{job_id}")
async def job_status(job_id: str):
    job = processing_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# Download generated file
@app.get("/api/download-file")
async def download_file(file_path: str):
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=os.path.basename(file_path))

# Delete a stored file
@app.delete("/api/delete-file")
async def delete_file(req: FileDeleteRequest):
    if os.path.exists(req.path):
        os.remove(req.path)
        return {"success": True, "message": "File deleted"}
    raise HTTPException(status_code=404, detail="File not found")

# Clear all stored files and jobs
@app.delete("/api/clear-files")
async def clear_all():
    for f in stored_files[:]:
        try:
            os.remove(f['path'])
        except:
            pass
    stored_files.clear()
    processing_jobs.clear()
    return {"success": True}
