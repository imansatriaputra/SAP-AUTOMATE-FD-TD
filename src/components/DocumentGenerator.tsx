import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, Eye, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { TeamType, SectionType } from '../App';
import { storeFileLocally, writeFileToSystem, StoredFile, formatFileSize, createFileEndpoint, getFileContent } from '../utils/fileStorage';
import { getTemplate } from '../data/templates';
import { getTemplateMappings } from '../data/csvDatabase';
import {
  processHTMLWithMainPy,
  generateDocumentWithFirstStart,
  API_BASE_URL
} from '../api/pythonAPI';

interface DocumentGeneratorProps {
  isDarkMode: boolean;
  activeTeam: TeamType;
  activeSection: SectionType;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  setProcessedDocument: (doc: any) => void;
  processingLogs: string[];
  setProcessingLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DocumentGenerator({ 
  isDarkMode, 
  activeTeam, 
  activeSection,
  isProcessing,
  setIsProcessing,
  setProcessedDocument,
  processingLogs,
  setProcessingLogs
}: DocumentGeneratorProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [storedFile, setStoredFile] = useState<StoredFile | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [finalDocument, setFinalDocument] = useState<string>('');
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [systemFilePath, setSystemFilePath] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<any>(null);

  const getSectionTitle = () => {
    const titles: Record<SectionType, string> = {
      'generate-fd': 'Generate Functional Document',
      'generate-td': 'Generate Technical Document',
      'generate-tc': 'Generate Test Cases'
    };
    return titles[activeSection];
  };

  const getSectionDescription = () => {
    const descriptions: Record<SectionType, string> = {
      'generate-fd': 'Upload HTML files to automatically generate comprehensive functional documentation',
      'generate-td': 'Transform HTML specifications into detailed technical documentation',
      'generate-tc': 'Create comprehensive test cases from your requirements'
    };
    return descriptions[activeSection];
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/html') {
      setUploadedFile(file);
      
      // Store file locally
      storeFileLocally(file)
        .then((stored) => {
          setStoredFile(stored);
          // console.log('File stored successfully:', stored);
          
          // // Write file to system for Python access
          // return writeFileToSystem(stored);
          // return true
          console.log('then')
        })
        .then((systemPath) => {
          // setSystemFilePath(systemPath);
          // console.log('File written to system:', systemPath);
          console.log("Then")
        })
        .catch((error) => {
          console.error('Failed to store file:', error);
          // Don't show error for system write failure, file is still stored in localStorage
          console.warn('File stored in localStorage but not written to system');
        });
    } else {
      alert('Please upload a valid HTML file');
    }
  }, []);

  const processDocument = async () => {
    if (!storedFile) return;

    setIsProcessing(true);
    setProcessingLogs(['[INFO] Starting document processing...']);

    try {
      // Process HTML file with main.py via FastAPI
      setProcessingLogs(prev => [...prev, '[INFO] Initializing main.py processing...']);
      setProcessingLogs(prev => [...prev, `[INFO] Processing file: ${storedFile.name}`]);
      setProcessingLogs(prev => [...prev, `[INFO] File size: ${formatFileSize(storedFile.size)}`]);
      
      // Create File object from stored file for API call
      const htmlContent = storedFile.content;
      const file = new File([htmlContent], storedFile.name, { type: 'text/html' });
      
      setProcessingLogs(prev => [...prev, '[INFO] Sending file to FastAPI backend...']);
      
      // Call actual Python backend
      const processingResult = await processHTMLWithMainPy(file);
      
      if (!processingResult.success) {
        setProcessingLogs(prev => [...prev, `[ERROR] main.py processing failed: ${processingResult.error}`]);
        throw new Error(processingResult.error || 'Failed to process HTML with main.py');
      }
      
      setProcessingLogs(prev => [...prev, '[SUCCESS] main.py processing completed successfully']);
      
      // Extract results from main.py processing
      const fsdAnalysisData = processingResult.data;
      const markdownContent = processingResult.markdown || 'No markdown generated';
      const outputFiles = processingResult.output_files || {};
      setMarkdownContent(markdownContent);
      
      setProcessingLogs(prev => [...prev, `[INFO] Generated markdown content (${markdownContent.length} characters)`]);
      setProcessingLogs(prev => [...prev, `[INFO] Program identified: ${fsdAnalysisData.program_name || 'Unknown'}`]);
      setProcessingLogs(prev => [...prev, `[INFO] Field mappings found: ${fsdAnalysisData.field_mappings || 0}`]);
      setProcessingLogs(prev => [...prev, `[INFO] Test scenarios generated: ${fsdAnalysisData.test_scenarios || 0}`]);
      setProcessingLogs(prev => [...prev, `[INFO] Generated files:`]);
      
      // Log all generated files
      if (outputFiles.markdown) {
        setProcessingLogs(prev => [...prev, `[INFO] - Markdown: ${outputFiles.markdown}`]);
      }
      if (outputFiles.json) {
        setProcessingLogs(prev => [...prev, `[INFO] - JSON: ${outputFiles.json}`]);
      }
      if (outputFiles.docx) {
        setProcessingLogs(prev => [...prev, `[INFO] - DOCX: ${outputFiles.docx}`]);
      }
      if (outputFiles.final_docx) {
        setProcessingLogs(prev => [...prev, `[INFO] - Final DOCX: ${outputFiles.final_docx}`]);
      }
      if (outputFiles.summary) {
        setProcessingLogs(prev => [...prev, `[INFO] - Summary: ${outputFiles.summary}`]);
      }
      
      // Set final document content from markdown or use default
      const finalDocContent = markdownContent || `Generated ${getSectionTitle()} - Ready for download`;
      setFinalDocument(finalDocContent);
      
      // Set processed document with actual data from main.py
      setProcessedDocument({
        markdown: markdownContent,
        final: finalDocContent,
        output_files: outputFiles,
        ...fsdAnalysisData
      });
      
      // Store generated files for download
      setGeneratedFiles(outputFiles);

      setProcessingLogs(prev => [...prev, '[SUCCESS] Document processing completed successfully!']);

    } catch (error) {
      console.error('Processing error:', error);
      setProcessingLogs(prev => [...prev, `[ERROR] Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      alert(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processDocument_old = async () => {
    if (!uploadedFile || !storedFile) return;

    setIsProcessing(true);
    setProcessingStep(1);

    try {
      // Step 1: Process HTML file that's already stored locally
      setProcessingStep(1);
      console.log('Processing stored file from path:', storedFile.path);
      
      // This would call your actual FastAPI backend when it's running
      // const processingResult = await processHTMLWithMainPy(uploadedFile);
      
      // For now, simulate the processing
      const processingResult = {
        success: true,
        data: {
          markdown: 'Generated markdown content from main.py processing...',
          metadata: {
            requirements: 15,
            integrations: 8,
            validations: 12
          }
        }
      };
      
      // Extract markdown from processing result
      const generatedMarkdown = processingResult.data?.markdown || 'No markdown generated';
      setMarkdownContent(generatedMarkdown);
      
      setProcessingStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Process with firstStart.py
      setProcessingStep(3);
      
      // Determine template type based on active section
      const templateType = activeSection === 'generate-fd' ? 'functional' : 
                          activeSection === 'generate-td' ? 'technical' : 'test-cases';
      
      // This would call your actual FastAPI backend when it's running
      // const documentResult = await generateDocumentWithFirstStart(generatedMarkdown, templateType);
      
      // For now, simulate the processing
      const documentResult = {
        success: true,
        data: {
          content: `Generated ${getSectionTitle()} - Ready for download\n\nProcessed with template type: ${templateType}`
        }
      };

      // Extract final document content
      const finalDocContent = documentResult.data?.content || `Generated ${getSectionTitle()} - Ready for download`;
      setFinalDocument(finalDocContent);

      setProcessedDocument({
        markdown: generatedMarkdown,
        final: finalDocContent,
        metadata: processingResult.data?.metadata || {
          requirements: processingResult.data?.metadata?.requirements || 0,
          integrations: processingResult.data?.metadata?.integrations || 0,
          validations: processingResult.data?.metadata?.validations || 0,
          errors: 0
        }
      });

      setProcessingStep(4);
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Processing error:', error);
      alert(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  const downloadDocument = () => {
    downloadGeneratedDocument();
  };

  const downloadGeneratedDocument = () => {
    if (!generatedFiles?.final_docx) {
      alert('No DOCX document available for download');
      return;
    }
    
    // Extract filename from the full path
    const fileName = generatedFiles.final_docx.split('/').pop() || 'document.docx';
    
    // Create download URL using FastAPI backend
    const downloadUrl = `${API_BASE_URL}/api/download-file?file_path=${encodeURIComponent(generatedFiles.final_docx)}`;
    
    // Create temporary link to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.target = '_blank'; // Fallback to open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const teamColor = activeTeam === 'functional' ? 'blue' : 'purple';

  return (
    <div className={`rounded-xl border shadow-sm ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {getSectionTitle()}
            </h2>
            <p className={`mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {getSectionDescription()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            teamColor === 'blue'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {activeTeam.charAt(0).toUpperCase() + activeTeam.slice(1)} Team
          </div>
        </div>

        {/* File Upload Section */}
        <div className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
          uploadedFile
            ? teamColor === 'blue'
              ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
              : 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
            : isDarkMode
              ? 'border-gray-600 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
        }`}>
          {uploadedFile ? (
            <div className="space-y-3">
              <CheckCircle className={`w-12 h-12 mx-auto ${
                teamColor === 'blue' ? 'text-blue-600' : 'text-purple-600'
              }`} />
              <div>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {uploadedFile.name}
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatFileSize(uploadedFile.size)} • HTML file
                </p>
                {storedFile && (
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Stored locally: {storedFile.path}
                    {systemFilePath && (
                      <><br />System path: {systemFilePath}</>
                    )}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className={`w-12 h-12 mx-auto ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <div>
                <label htmlFor="file-upload" className={`cursor-pointer font-medium ${
                  teamColor === 'blue' ? 'text-blue-600' : 'text-purple-600'
                }`}>
                  Click to upload HTML file
                </label>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  or drag and drop your HTML file here
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".html"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Process Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={processDocument}
            disabled={!storedFile || isProcessing}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              teamColor === 'blue'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing Document...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Generate Document</span>
              </div>
            )}
          </button>
        </div>

        {/* Markdown Preview */}
        {markdownContent && (
          <>
            {/* Generated Document Download */}
            <div className={`mb-6 p-4 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`w-6 h-6 ${
                    teamColor === 'blue' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Generated Document Ready
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Generated DOCX document from main.py processing
                    </p>
                  </div>
                </div>
                <button
                  onClick={downloadDocument}
                  disabled={!generatedFiles?.final_docx}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    teamColor === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
              
              {/* Generated Files Info */}
              {generatedFiles && (
                <div className={`mt-4 p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Generated Files Available on Server:
                  </h4>
                  <div className={`text-sm space-y-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {generatedFiles.markdown && <p>• Markdown: {generatedFiles.markdown}</p>}
                    {generatedFiles.json && <p>• JSON: {generatedFiles.json}</p>}
                    {generatedFiles.docx && <p>• DOCX: {generatedFiles.docx}</p>}
                    {generatedFiles.final_docx && <p>• Final DOCX: {generatedFiles.final_docx}</p>}
                    {generatedFiles.summary && <p>• Summary: {generatedFiles.summary}</p>}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DocumentGenerator;