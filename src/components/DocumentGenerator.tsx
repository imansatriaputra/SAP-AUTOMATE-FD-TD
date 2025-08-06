import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, Eye, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { TeamType, SectionType } from '../App';
import { storeFileLocally, writeFileToSystem, StoredFile, formatFileSize, createFileEndpoint, getFileContent } from '../utils/fileStorage';
import { getTemplate } from '../data/templates';
import { getTemplateMappings } from '../data/csvDatabase';
import {
  processHTMLWithMainPy,
  generateDocumentWithFirstStart
} from '../api/pythonAPI';

interface DocumentGeneratorProps {
  isDarkMode: boolean;
  activeTeam: TeamType;
  activeSection: SectionType;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  setProcessedDocument: (doc: any) => void;
}

export function DocumentGenerator({ 
  isDarkMode, 
  activeTeam, 
  activeSection,
  isProcessing,
  setIsProcessing,
  setProcessedDocument
}: DocumentGeneratorProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [storedFile, setStoredFile] = useState<StoredFile | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [finalDocument, setFinalDocument] = useState<string>('');
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [systemFilePath, setSystemFilePath] = useState<string>('');

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
          console.log('File stored successfully:', stored);
          
          // Write file to system for Python access
          return writeFileToSystem(stored);
        })
        .then((systemPath) => {
          setSystemFilePath(systemPath);
          console.log('File written to system:', systemPath);
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
    setProcessingStep(1);

    try {
      // Step 1: Process HTML file with actual main.py via FastAPI
      setProcessingStep(1);
      console.log('Processing HTML file with main.py via FastAPI backend');
      
      // Create File object from stored file for API call
      const htmlContent = storedFile.content;
      const file = new File([htmlContent], storedFile.name, { type: 'text/html' });
      
      // Call actual Python backend
      const processingResult = await processHTMLWithMainPy(file);
      
      if (!processingResult.success) {
        throw new Error(processingResult.error || 'Failed to process HTML with main.py');
      }
      
      // Extract results from main.py processing
      const fsdAnalysisData = processingResult.data;
      const markdownContent = processingResult.markdown || 'No markdown generated';
      setMarkdownContent(markdownContent);
      
      setProcessingStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Process with firstStart.py
      setProcessingStep(3);
      
      const templateType = activeSection === 'generate-fd' ? 'functional' : 
                          activeSection === 'generate-td' ? 'technical' : 'test-cases';
      
      const documentResult = await generateDocumentWithFirstStart(markdownContent, templateType);
      
      if (!documentResult.success) {
        throw new Error(documentResult.error || 'Failed to generate document with firstStart.py');
      }
      
      const finalDocContent = documentResult.data?.content || `Generated ${getSectionTitle()} - Ready for download`;
      setFinalDocument(finalDocContent);

      // Set processed document with actual data from main.py
      setProcessedDocument({
        markdown: markdownContent,
        final: finalDocContent,
        ...fsdAnalysisData
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
    if (!finalDocument) return;
    
    const blob = new Blob([finalDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSection}-document.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <div className={`rounded-lg border p-4 mb-6 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Generated Insights (Markdown)
              </h3>
              <button className={`flex items-center space-x-1 text-sm ${
                teamColor === 'blue' ? 'text-blue-600' : 'text-purple-600'
              }`}>
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>
            <pre className={`text-sm whitespace-pre-wrap max-h-64 overflow-y-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {markdownContent}
            </pre>
          </div>
        )}

        {/* Download Section */}
        {finalDocument && (
          <div className={`rounded-lg border p-4 ${
            teamColor === 'blue'
              ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
              : 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700'
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
                    Document Generated Successfully
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your {getSectionTitle().toLowerCase()} is ready for download
                  </p>
                </div>
              </div>
              <button
                onClick={downloadDocument}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  teamColor === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}