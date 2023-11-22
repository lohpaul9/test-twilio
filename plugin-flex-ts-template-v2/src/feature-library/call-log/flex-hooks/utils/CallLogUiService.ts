import ApiService from '../../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../../types/serverless';

export interface CallLog {
  _id: string;
  caller_number: string;
  receiver_number: string;
  call_start: string;
  call_end: string;
  agent_name: string;
  callStatus: string;
}

export interface CallLogResponse {
  logs: CallLog[];
}

class CallLogService extends ApiService {
  fetchLogs = async (): Promise<CallLogResponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };
      console.log('TEST123', this.serverlessProtocol);
      console.log('TEST123', this.serverlessDomain);
      console.log('TEST123', encodedParams);
      console.log('TEST123', this.manager.store.getState().flex.session.ssoTokenPayload.token);

      this.fetchJsonWithReject<CallLogResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/call-log/store-call-log-in-sync`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response) => {
          console.log('SUCCESS123', response);
          resolve(response);
        })
        .catch((error) => {
          console.error(`FAILURE123', 'Error fetching call logs\r\n`, error);
          reject(error);
        });
    });
  };

  // Add more functions if needed...
}

export default new CallLogService();
