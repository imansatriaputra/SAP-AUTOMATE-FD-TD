import React from 'react';
import { Moon, Sun, Zap, Settings } from 'lucide-react';
import { TeamType, SectionType } from '../App';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeTeam: TeamType;
  setActiveTeam: (team: TeamType) => void;
  setActiveSection: (section: SectionType) => void;
}

export function Navbar({ 
  isDarkMode, 
  toggleDarkMode, 
  activeTeam, 
  setActiveTeam, 
  setActiveSection 
}: NavbarProps) {
  const handleTeamChange = (team: TeamType) => {
    setActiveTeam(team);
    // Set default section based on team
    if (team === 'functional') {
      setActiveSection('generate-fd');
    } else {
      setActiveSection('generate-td');
    }
  };

  return (
    <nav className={`border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Accenture CRM
              </h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                SAP Document Automation
              </p>
            </div>
          </div>

          {/* Team Tabs */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleTeamChange('functional')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTeam === 'functional'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Functional Team
            </button>
            <button
              onClick={() => handleTeamChange('technical')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTeam === 'technical'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Technical Team
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}