import React from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock, Database, FileText, Users, Shield, TestTube, Settings, BarChart3, Terminal, Code } from 'lucide-react';

interface InsightsPanelProps {
  isDarkMode: boolean;
  processedDocument: any;
}

export function InsightsPanel({ isDarkMode, processedDocument }: InsightsPanelProps) {
  const insights = [
    {
      icon: Brain,
      title: 'FSD Analysis',
      description: processedDocument ? 'Document analysis completed' : 'Analyzing FSD structure',
      status: processedDocument ? 'completed' : 'pending',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Program Analysis',
      description: processedDocument ? `Program: ${processedDocument.program_name || 'Identified'}` : 'Extracting program details',
      status: processedDocument ? 'completed' : 'pending',
      color: 'green'
    },
    {
      icon: Database,
      title: 'Field Mappings',
      description: processedDocument ? `${processedDocument.field_mappings || 0} mappings found` : 'Processing field mappings',
      status: processedDocument ? 'completed' : 'pending',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Processing Time',
      description: processedDocument ? `Generated on: ${new Date().toLocaleString()}` : 'Processing...',
      status: processedDocument ? 'completed' : 'pending',
      color: 'orange'
    }
  ];

  return (
    <div className={`rounded-xl border shadow-sm ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className={`w-6 h-6 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI Insights
          </h2>
        </div>

        {/* Insights List */}
        <div className="space-y-4 mb-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const isCompleted = insight.status === 'completed';
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isCompleted
                      ? `bg-${insight.color}-100 dark:bg-${insight.color}-900/30`
                      : isDarkMode
                        ? 'bg-gray-600'
                        : 'bg-gray-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isCompleted
                        ? `text-${insight.color}-600`
                        : isDarkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {insight.title}
                      </h3>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className={`w-4 h-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Metrics */}
        {processedDocument && (
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              FSD Analysis Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {processedDocument.selection_parameters || 0}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Selection Parameters
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {processedDocument.field_mappings || 0}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Field Mappings
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {processedDocument.validation_rules || 0}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Validation Rules
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {processedDocument.error_scenarios || 0}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Error Scenarios
                </div>
              </div>
            </div>
            
            {/* Additional Statistics Row */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {processedDocument.test_scenarios || 0}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Test Scenarios
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {processedDocument.authorization_objects || 0}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Authorization Objects
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FSD Analysis Completeness */}
        {processedDocument && (
          <div className={`mt-6 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Analysis Completeness
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  User Requirements
                </span>
                <span className={`text-sm font-medium ${
                  processedDocument.user_requirements ? 'text-green-600' : 'text-red-500'
                }`}>
                  {processedDocument.user_requirements ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Assumptions
                </span>
                <span className={`text-sm font-medium ${
                  processedDocument.assumptions ? 'text-green-600' : 'text-red-500'
                }`}>
                  {processedDocument.assumptions ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Field Mappings
                </span>
                <span className={`text-sm font-medium ${
                  processedDocument.field_mappings && processedDocument.field_mappings > 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {processedDocument.field_mappings && processedDocument.field_mappings > 0 ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Error Handling
                </span>
                <span className={`text-sm font-medium ${
                  processedDocument.error_scenarios && processedDocument.error_scenarios > 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {processedDocument.error_scenarios && processedDocument.error_scenarios > 0 ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Test Coverage
                </span>
                <span className={`text-sm font-medium ${
                  processedDocument.test_scenarios && processedDocument.test_scenarios > 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {processedDocument.test_scenarios && processedDocument.test_scenarios > 0 ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Program Information */}
        {processedDocument && processedDocument.program_name && (
          <div className={`mt-6 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Program Details
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className={`font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Program Name: 
                </span>
                <span className={`ml-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {processedDocument.program_name}
                </span>
              </div>
              {processedDocument.transaction_code && (
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Transaction Code: 
                  </span>
                  <span className={`ml-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {processedDocument.transaction_code}
                  </span>
                </div>
              )}
              {processedDocument.report_description && (
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description: 
                  </span>
                  <span className={`ml-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {processedDocument.report_description}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FSD Analysis Recommendations */}
        <div className={`mt-6 p-4 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              FSD Analysis Recommendations
            </h3>
          </div>
          <ul className={`text-sm space-y-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {processedDocument && processedDocument.field_mappings === 0 && (
              <li>• Review and add field mapping definitions</li>
            )}
            {processedDocument && processedDocument.validation_rules === 0 && (
              <li>• Define validation rules for data integrity</li>
            )}
            {processedDocument && processedDocument.error_scenarios === 0 && (
              <li>• Add error handling scenarios</li>
            )}
            {processedDocument && processedDocument.test_scenarios === 0 && (
              <li>• Include comprehensive test scenarios</li>
            )}
            {processedDocument && processedDocument.authorization_objects === 0 && (
              <li>• Define authorization objects for security</li>
            )}
            {(!processedDocument || (
              processedDocument.field_mappings > 0 && 
              processedDocument.validation_rules > 0 && 
              processedDocument.error_scenarios > 0 && 
              processedDocument.test_scenarios > 0
            )) && (
              <li>• FSD analysis appears complete - ready for review</li>
            )}
          </ul>
        </div>

        {/* Raw Python Summary Output */}
        {processedDocument && processedDocument.raw_summary_lines && (
          <div className={`mt-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`p-4 border-b ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-green-600" />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Python main.py Analysis Output
                </h3>
              </div>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Raw summary lines generated by the FSD analysis engine
              </p>
            </div>
            <div className="p-4">
              <div className={`rounded-lg p-4 font-mono text-sm ${
                isDarkMode 
                  ? 'bg-gray-800 text-green-400' 
                  : 'bg-black text-green-500'
              }`}>
                <pre className="whitespace-pre-wrap">
                  {processedDocument.raw_summary_lines.join('\n')}
                </pre>
              </div>
              <div className={`mt-3 text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <div className="flex items-center space-x-4">
                  <span>Generated: {processedDocument.processing_timestamp}</span>
                  <span>•</span>
                  <span>Content Length: {processedDocument.html_content_length} chars</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}