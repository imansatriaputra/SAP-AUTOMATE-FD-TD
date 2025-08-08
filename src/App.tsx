// src/App.tsx
import React, { useState } from 'react'
import {
  Moon,
  Sun,
  FileText,
  Users,
  Zap,
  Download,
  Upload,
  Eye,
  Settings,
} from 'lucide-react'

import { Navbar }               from './components/Navbar'
import { Sidebar }              from './components/Sidebar'
import { DocumentGenerator }    from './components/DocumentGenerator'
import { InsightsPanel }        from './components/InsightsPanel'
import { ProcessingStatus }     from './components/ProcessingStatus'
import { FileManager }          from './components/FileManager'

// (If you really want to use Button in here later, import it relatively:)
// import { Button } from './components/ui/button'

export type TeamType = 'functional' | 'technical'
export type SectionType =
  | 'generate-fd'
  | 'generate-tc'
  | 'generate-td'
  | 'file-manager'

function App() {
  const [isDarkMode, setIsDarkMode]         = useState(false)
  const [activeTeam, setActiveTeam]         = useState<TeamType>('functional')
  const [activeSection, setActiveSection]   = useState<SectionType>('generate-fd')
  const [isProcessing, setIsProcessing]     = useState(false)
  const [processedDocument, setProcessedDocument] = useState<any>(null)
  const [processingLogs, setProcessingLogs] = useState<string[]>([])

  const toggleDarkMode = () => setIsDarkMode(d => !d)

  return (
    <div
      className={`
        min-h-screen
        transition-colors duration-300
        ${isDarkMode
          ? 'dark bg-gray-900 text-white'
          : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900'}
      `}
    >
      {/* Navigation */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        activeTeam={activeTeam}
        setActiveTeam={setActiveTeam}
        setActiveSection={setActiveSection}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isDarkMode={isDarkMode}
          activeTeam={activeTeam}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1
                className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                AI‑Powered SAP Document Generation
              </h1>
              <p
                className={`mt-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Streamline your SAP documentation process with intelligent automation
              </p>
            </div>

            {/* Processing Status */}
            {isProcessing && <ProcessingStatus isDarkMode={isDarkMode} />}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {activeSection === 'file-manager' ? (
                <div className="xl:col-span-3">
                  <FileManager isDarkMode={isDarkMode} />
                </div>
              ) : (
                <>
                  <div className="xl:col-span-2">
                    <DocumentGenerator
                      isDarkMode={isDarkMode}
                      activeTeam={activeTeam}
                      activeSection={activeSection}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      setProcessedDocument={setProcessedDocument}
                      processingLogs={processingLogs}
                      setProcessingLogs={setProcessingLogs}
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <InsightsPanel 
                      isDarkMode={isDarkMode} 
                      processedDocument={processedDocument}
                      processingLogs={processingLogs}
                      isProcessing={isProcessing}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
