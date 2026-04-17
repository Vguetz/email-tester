interface EmailPayload {
  html: string;
  css: string;
  targetClient: 'gmail' | 'outlook';
}
interface CompatibilityIssue { 
  property: string;
  value: string;
  message: string;
  severity: 'warning' | 'error';
}

export type { EmailPayload, CompatibilityIssue };