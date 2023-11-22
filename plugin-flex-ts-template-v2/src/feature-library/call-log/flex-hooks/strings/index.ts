import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

export enum CallLogStringTemplates {
  CallLogTitle = 'CallLogTitle',
  CallerHeader = 'CallerHeader',
  ReceiverHeader = 'ReceiverHeader',
  StartTimeHeader = 'StartTimeHeader',
  EndTimeHeader = 'EndTimeHeader',
  AgentNameHeader = 'AgentNameHeader',
  StatusHeader = 'StatusHeader',
  RefreshButton = 'RefreshButton',
  FetchErrorMsg = 'FetchErrorMsg',
  NoLogsMsg = 'NoLogsMsg',
  LogDetailsTitle = 'LogDetailsTitle',
  DurationLabel = 'DurationLabel',
  CallTypeLabel = 'CallTypeLabel',
  RefreshLogsNotification = 'RefreshLogsNotification',
  // Add more as needed...
}

export const callLogStringsHook = () => ({
  'en-US': {
    [CallLogStringTemplates.CallLogTitle]: 'Call Logs',
    [CallLogStringTemplates.CallerHeader]: 'Caller Number',
    [CallLogStringTemplates.ReceiverHeader]: 'Receiver Number',
    [CallLogStringTemplates.StartTimeHeader]: 'Start Time',
    [CallLogStringTemplates.EndTimeHeader]: 'End Time',
    [CallLogStringTemplates.AgentNameHeader]: 'Agent Name',
    [CallLogStringTemplates.StatusHeader]: 'Status',
    [CallLogStringTemplates.RefreshButton]: 'Refresh Logs',
    [CallLogStringTemplates.FetchErrorMsg]: 'Failed to fetch call logs. Please try again later.',
    [CallLogStringTemplates.NoLogsMsg]: 'No call logs available at the moment.',
    [CallLogStringTemplates.LogDetailsTitle]: 'Log Details',
    [CallLogStringTemplates.DurationLabel]: 'Duration',
    [CallLogStringTemplates.CallTypeLabel]: 'Call Type',
    [CallLogStringTemplates.RefreshLogsNotification]: 'Logs refreshed successfully.',
    // Add more as needed...
  },
  'es-ES': esES,
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
