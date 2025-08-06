// CSV Database lookup placeholder
export interface CSVRecord {
  id: string;
  category: string;
  keyword: string;
  description: string;
  template_mapping: string;
  priority: number;
}

// Sample CSV database for SAP document keywords
export const csvDatabase: CSVRecord[] = [
  {
    id: '1',
    category: 'functional',
    keyword: 'user story',
    description: 'User story requirement',
    template_mapping: 'FUNCTIONAL_REQUIREMENTS',
    priority: 1
  },
  {
    id: '2',
    category: 'functional',
    keyword: 'business rule',
    description: 'Business logic rule',
    template_mapping: 'BUSINESS_LOGIC',
    priority: 1
  },
  {
    id: '3',
    category: 'functional',
    keyword: 'validation',
    description: 'Data validation rule',
    template_mapping: 'VALIDATION_RULES',
    priority: 2
  },
  {
    id: '4',
    category: 'technical',
    keyword: 'api endpoint',
    description: 'API specification',
    template_mapping: 'API_SPECIFICATIONS',
    priority: 1
  },
  {
    id: '5',
    category: 'technical',
    keyword: 'database table',
    description: 'Database design element',
    template_mapping: 'DATABASE_DESIGN',
    priority: 1
  },
  {
    id: '6',
    category: 'technical',
    keyword: 'integration point',
    description: 'System integration',
    template_mapping: 'INTEGRATION_ARCHITECTURE',
    priority: 2
  },
  {
    id: '7',
    category: 'test',
    keyword: 'test case',
    description: 'Test scenario',
    template_mapping: 'FUNCTIONAL_TEST_CASES',
    priority: 1
  },
  {
    id: '8',
    category: 'test',
    keyword: 'negative test',
    description: 'Negative test scenario',
    template_mapping: 'NEGATIVE_TEST_CASES',
    priority: 2
  },
  {
    id: '9',
    category: 'functional',
    keyword: 'error handling',
    description: 'Error handling requirement',
    template_mapping: 'ERROR_HANDLING',
    priority: 2
  },
  {
    id: '10',
    category: 'technical',
    keyword: 'performance',
    description: 'Performance requirement',
    template_mapping: 'PERFORMANCE_OPTIMIZATION',
    priority: 2
  }
];

// Function to search CSV database
export function searchCSVDatabase(query: string, category?: string): CSVRecord[] {
  const normalizedQuery = query.toLowerCase();
  
  return csvDatabase.filter(record => {
    const matchesQuery = record.keyword.toLowerCase().includes(normalizedQuery) ||
                        record.description.toLowerCase().includes(normalizedQuery);
    
    const matchesCategory = !category || record.category === category;
    
    return matchesQuery && matchesCategory;
  }).sort((a, b) => a.priority - b.priority);
}

// Function to get all keywords by category
export function getKeywordsByCategory(category: string): CSVRecord[] {
  return csvDatabase.filter(record => record.category === category);
}

// Function to get template mapping suggestions
export function getTemplateMappings(keywords: string[]): Record<string, string[]> {
  const mappings: Record<string, string[]> = {};
  
  keywords.forEach(keyword => {
    const matches = searchCSVDatabase(keyword);
    matches.forEach(match => {
      if (!mappings[match.template_mapping]) {
        mappings[match.template_mapping] = [];
      }
      mappings[match.template_mapping].push(match.description);
    });
  });
  
  return mappings;
}