// Document templates placeholder
export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'functional' | 'technical' | 'test-cases';
  template: string;
  variables: string[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'fd-template-1',
    name: 'SAP Functional Document Template',
    type: 'functional',
    template: `
# SAP Functional Document

## Document Information
- **Project**: {{PROJECT_NAME}}
- **Module**: {{MODULE_NAME}}
- **Version**: {{VERSION}}
- **Date**: {{CREATION_DATE}}

## Overview
{{OVERVIEW}}

## Functional Requirements
{{FUNCTIONAL_REQUIREMENTS}}

## Business Logic
{{BUSINESS_LOGIC}}

## User Interface
{{USER_INTERFACE}}

## Data Flow
{{DATA_FLOW}}

## Integration Points
{{INTEGRATION_POINTS}}

## Validation Rules
{{VALIDATION_RULES}}

## Error Handling
{{ERROR_HANDLING}}

## Performance Requirements
{{PERFORMANCE_REQUIREMENTS}}

## Security Considerations
{{SECURITY_CONSIDERATIONS}}

## Approval
- **Business Analyst**: {{BA_APPROVAL}}
- **Technical Lead**: {{TECH_APPROVAL}}
- **Project Manager**: {{PM_APPROVAL}}
    `,
    variables: [
      'PROJECT_NAME', 'MODULE_NAME', 'VERSION', 'CREATION_DATE',
      'OVERVIEW', 'FUNCTIONAL_REQUIREMENTS', 'BUSINESS_LOGIC',
      'USER_INTERFACE', 'DATA_FLOW', 'INTEGRATION_POINTS',
      'VALIDATION_RULES', 'ERROR_HANDLING', 'PERFORMANCE_REQUIREMENTS',
      'SECURITY_CONSIDERATIONS', 'BA_APPROVAL', 'TECH_APPROVAL', 'PM_APPROVAL'
    ]
  },
  {
    id: 'td-template-1',
    name: 'SAP Technical Document Template',
    type: 'technical',
    template: `
# SAP Technical Document

## Document Information
- **Project**: {{PROJECT_NAME}}
- **Module**: {{MODULE_NAME}}
- **Version**: {{VERSION}}
- **Date**: {{CREATION_DATE}}

## Technical Overview
{{TECHNICAL_OVERVIEW}}

## System Architecture
{{SYSTEM_ARCHITECTURE}}

## Technical Requirements
{{TECHNICAL_REQUIREMENTS}}

## Data Model
{{DATA_MODEL}}

## API Specifications
{{API_SPECIFICATIONS}}

## Database Design
{{DATABASE_DESIGN}}

## Integration Architecture
{{INTEGRATION_ARCHITECTURE}}

## Security Implementation
{{SECURITY_IMPLEMENTATION}}

## Performance Optimization
{{PERFORMANCE_OPTIMIZATION}}

## Error Handling & Logging
{{ERROR_HANDLING_LOGGING}}

## Deployment Configuration
{{DEPLOYMENT_CONFIG}}

## Testing Strategy
{{TESTING_STRATEGY}}

## Monitoring & Alerts
{{MONITORING_ALERTS}}

## Technical Approval
- **Technical Architect**: {{ARCH_APPROVAL}}
- **Senior Developer**: {{DEV_APPROVAL}}
- **Infrastructure Lead**: {{INFRA_APPROVAL}}
    `,
    variables: [
      'PROJECT_NAME', 'MODULE_NAME', 'VERSION', 'CREATION_DATE',
      'TECHNICAL_OVERVIEW', 'SYSTEM_ARCHITECTURE', 'TECHNICAL_REQUIREMENTS',
      'DATA_MODEL', 'API_SPECIFICATIONS', 'DATABASE_DESIGN',
      'INTEGRATION_ARCHITECTURE', 'SECURITY_IMPLEMENTATION',
      'PERFORMANCE_OPTIMIZATION', 'ERROR_HANDLING_LOGGING',
      'DEPLOYMENT_CONFIG', 'TESTING_STRATEGY', 'MONITORING_ALERTS',
      'ARCH_APPROVAL', 'DEV_APPROVAL', 'INFRA_APPROVAL'
    ]
  },
  {
    id: 'tc-template-1',
    name: 'SAP Test Cases Template',
    type: 'test-cases',
    template: `
# SAP Test Cases Document

## Document Information
- **Project**: {{PROJECT_NAME}}
- **Module**: {{MODULE_NAME}}
- **Version**: {{VERSION}}
- **Date**: {{CREATION_DATE}}

## Test Plan Overview
{{TEST_PLAN_OVERVIEW}}

## Test Environment
{{TEST_ENVIRONMENT}}

## Test Data Requirements
{{TEST_DATA_REQUIREMENTS}}

## Functional Test Cases
{{FUNCTIONAL_TEST_CASES}}

## Integration Test Cases
{{INTEGRATION_TEST_CASES}}

## Performance Test Cases
{{PERFORMANCE_TEST_CASES}}

## Security Test Cases
{{SECURITY_TEST_CASES}}

## User Acceptance Test Cases
{{UAT_TEST_CASES}}

## Negative Test Cases
{{NEGATIVE_TEST_CASES}}

## Regression Test Cases
{{REGRESSION_TEST_CASES}}

## Test Execution Schedule
{{TEST_EXECUTION_SCHEDULE}}

## Expected Results
{{EXPECTED_RESULTS}}

## Test Sign-off
- **QA Lead**: {{QA_APPROVAL}}
- **Business Analyst**: {{BA_APPROVAL}}
- **Project Manager**: {{PM_APPROVAL}}
    `,
    variables: [
      'PROJECT_NAME', 'MODULE_NAME', 'VERSION', 'CREATION_DATE',
      'TEST_PLAN_OVERVIEW', 'TEST_ENVIRONMENT', 'TEST_DATA_REQUIREMENTS',
      'FUNCTIONAL_TEST_CASES', 'INTEGRATION_TEST_CASES', 'PERFORMANCE_TEST_CASES',
      'SECURITY_TEST_CASES', 'UAT_TEST_CASES', 'NEGATIVE_TEST_CASES',
      'REGRESSION_TEST_CASES', 'TEST_EXECUTION_SCHEDULE', 'EXPECTED_RESULTS',
      'QA_APPROVAL', 'BA_APPROVAL', 'PM_APPROVAL'
    ]
  }
];

// Function to get template by type and section
export function getTemplate(section: string): DocumentTemplate | undefined {
  const templateMap: Record<string, string> = {
    'generate-fd': 'fd-template-1',
    'generate-td': 'td-template-1',
    'generate-tc': 'tc-template-1'
  };
  
  const templateId = templateMap[section];
  return documentTemplates.find(template => template.id === templateId);
}