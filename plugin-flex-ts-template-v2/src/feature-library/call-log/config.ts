import { getFeatureFlags } from '../../utils/configuration';
import CallLogConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.call_log as CallLogConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
