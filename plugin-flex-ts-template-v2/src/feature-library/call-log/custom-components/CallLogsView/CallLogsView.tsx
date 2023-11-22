import React, { useState, useEffect } from 'react';
import {
  Button,
  Paragraph,
  Table,
  THead,
  Tr,
  Th,
  Td,
  TBody,
  Box,
  Tooltip,
  Text,
  Heading,
  Stack,
  Card,
} from '@twilio-paste/core';
import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';
import { WarningIcon } from '@twilio-paste/icons/esm/WarningIcon';
import CallLogService, { CallLog } from '../../flex-hooks/utils/CallLogUiService';
import { CallLogStringTemplates, callLogStringsHook } from '../../flex-hooks/strings';

const CallLogViewComponent: React.FC = () => {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const strings = callLogStringsHook()['en-US'];

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await CallLogService.fetchLogs();
      setLogs(response.logs);
    } catch (err) {
      console.error(strings[CallLogStringTemplates.FetchErrorMsg], err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(strings[CallLogStringTemplates.FetchErrorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Box padding="space40">
      <Text as="h1">{strings[CallLogStringTemplates.CallLogTitle]}</Text>
      <LogsView logs={logs} />
      {/* {error ? <Text color="colorTextError">{error}</Text> : <LogsView logs={logs} />} */}
      <Box marginTop="space40">
        <Button variant="primary" onClick={fetchLogs}>
          {strings[CallLogStringTemplates.RefreshButton]}
        </Button>
      </Box>
    </Box>
  );
};

const LogsView: React.FC<{ logs: CallLog[] }> = ({ logs }) => {
  const strings = callLogStringsHook()['en-US'];

  return (
    <Table>
      <THead>
        <Tr>
          <Th>{strings[CallLogStringTemplates.CallerHeader]}</Th>
          <Th>{strings[CallLogStringTemplates.ReceiverHeader]}</Th>
          <Th>{strings[CallLogStringTemplates.StartTimeHeader]}</Th>
          <Th>{strings[CallLogStringTemplates.EndTimeHeader]}</Th>
          <Th>{strings[CallLogStringTemplates.AgentNameHeader]}</Th>
          <Th>{strings[CallLogStringTemplates.StatusHeader]}</Th>
        </Tr>
      </THead>
      <TBody>
        {logs.map((log, idx) => (
          <Tr key={idx}>
            <Td>{log.caller_number}</Td>
            <Td>{log.receiver_number}</Td>
            <Td>{new Date(log.call_start).toLocaleString()}</Td>
            <Td>{new Date(log.call_end).toLocaleString()}</Td>
            <Td>{log.agent_name}</Td>
            <Td>{log.callStatus}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
};

export default CallLogViewComponent;
