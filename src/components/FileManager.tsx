import React, { useState, useEffect } from 'react';
import { File, Trash2, Download, Eye, Clock } from 'lucide-react';
import { getStoredFiles, deleteStoredFile, getFileContent, formatFileSize, StoredFile } from '../utils/fileStorage';

interface FileManagerProps {
  isDarkMode: boolean;
}

export function FileManager({ isDarkMode }: FileManagerProps) {
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  useEffect(() => {
    loadStoredFiles();
  }, []);

  const loadStoredFiles = () => {
    const files = getStoredFiles();
    setStoredFiles(files);
  };

  const handleDeleteFile = (path: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      if (deleteStoredFile(path)) {
        loadStoredFiles();
        if (selectedFile?.path === path) {
          setSelectedFile(null);
          setFileContent('');
        }
      }
    }
  };

  const handleViewFile = (file: StoredFile) => {
    setSelectedFile(file);
    const content = getFileContent(file.path);
    setFileContent(content || 'Unable to load file content');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={`rounded-xl border shadow-sm ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            File Manager
          </h2>
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {storedFiles.length} files stored
          </span>
        </div>

        {storedFiles.length === 0 ? (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {storedFiles.map((file, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  selectedFile?.path === file.path
                    ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {file.name}
                      </p>
                      <div className={`flex items-center space-x-2 text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewFile(file)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                      }`}
                      title="View file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.path)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                          : 'hover:bg-red-100 text-red-500 hover:text-red-700'
                      }`}
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Content Preview */}
        {selectedFile && fileContent && (
          <div className={`mt-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                File Preview: {selectedFile.name}
              </h3>
            </div>
            <div className="p-4">
              <pre className={`text-sm whitespace-pre-wrap max-h-96 overflow-y-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {fileContent.substring(0, 2000)}
                {fileContent.length > 2000 && '...\n\n[Content truncated for preview]'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}