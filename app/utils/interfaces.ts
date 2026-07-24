type TargetClient =
  | 'gmail'
  | 'outlook-2016-2019'
  | 'outlook-com'
  | 'apple-mail'
  | 'gmail-ios'
  | 'gmail-android'
  | 'yahoo-mail'
  | 'samsung-mail';

// Single source of truth for display labels, shared by the UI (client dropdown)
// and the rules engine, so the two can't silently drift apart.
const CLIENT_LABELS: Record<TargetClient, string> = {
  gmail: 'Gmail',
  'outlook-2016-2019': 'Outlook 2016-2019',
  'outlook-com': 'Outlook.com',
  'apple-mail': 'Apple Mail',
  'gmail-ios': 'Gmail (iOS)',
  'gmail-android': 'Gmail (Android)',
  'yahoo-mail': 'Yahoo Mail',
  'samsung-mail': 'Samsung Mail',
};

interface EmailPayload {
  html: string;
  css: string;
  targetClient: TargetClient;
}
interface CompatibilityIssue {
  property: string;
  value: string;
  message: string;
  severity: 'warning' | 'error';
  ruleId?: string;
  client?: TargetClient;
}

interface Project {
  id: string;
  owner_id: string;
  org_id: string | null;
  name: string;
  html: string;
  css: string;
  target_client: TargetClient;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export type { EmailPayload, CompatibilityIssue, TargetClient, Project };
export { CLIENT_LABELS };