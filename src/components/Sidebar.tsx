import React from 'react';
import { FileText, TestTube, FileCheck, Cpu, FolderOpen } from 'lucide-react';
import { TeamType, SectionType } from '../App';

interface SidebarProps {
  isDarkMode: boolean;
  activeTeam: TeamType;
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

export function Sidebar({ 
  isDarkMode, 
  activeTeam, 
  activeSection, 
  setActiveSection 
}: SidebarProps) {
  const functionalSections = [
    { id: 'generate-fd' as SectionType, label: 'Generate FD', icon: FileText, description: 'Functional Document' },
    { id: 'generate-tc' as SectionType, label: 'Generate TC', icon: TestTube, description: 'Test Cases' },
    { id: 'file-manager' as SectionType, label: 'File Manager', icon: FolderOpen, description: 'Manage Files' }
  ];

  const technicalSections = [
    { id: 'generate-td' as SectionType, label: 'Generate TD', icon: Cpu, description: 'Technical Document' },
    { id: 'generate-tc' as SectionType, label: 'Generate TC', icon: FileCheck, description: 'Test Cases' },
    { id: 'file-manager' as SectionType, label: 'File Manager', icon: FolderOpen, description: 'Manage Files' }
  ];

  const sections = activeTeam === 'functional' ? functionalSections : technicalSections;

  return (
    <aside className={`fixed left-0 top-[81px] w-64 h-[calc(100vh-81px)] border-r transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <h2 className={`text-lg font-semibold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {activeTeam === 'functional' ? 'Functional' : 'Technical'} Tools
        </h2>
        
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const teamColor = activeTeam === 'functional' ? 'blue' : 'purple';
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? `${teamColor === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} text-white shadow-lg`
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-white' : 'text-current'
                }`} />
                <div>
                  <div className="font-medium">{section.label}</div>
                  <div className={`text-xs ${
                    isActive 
                      ? 'text-blue-100' 
                      : isDarkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                  }`}>
                    {section.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className={`mt-8 p-4 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Documents Generated
              </span>
              <span className={`font-medium ${
                activeTeam === 'functional' ? 'text-blue-600' : 'text-purple-600'
              }`}>
                247
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Processing Time
              </span>
              <span className={`font-medium ${
                activeTeam === 'functional' ? 'text-blue-600' : 'text-purple-600'
              }`}>
                2.3s avg
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}