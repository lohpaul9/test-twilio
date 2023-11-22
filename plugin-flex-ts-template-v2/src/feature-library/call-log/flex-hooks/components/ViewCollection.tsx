import * as Flex from '@twilio/flex-ui';
import { View } from '@twilio/flex-ui';
import CallLogViewComponent from '../../custom-components/CallLogsView/CallLogsView';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function CallLogsView(_manager: Flex.Manager) {
  Flex.ViewCollection.Content.add(
    <View name="call-log" key="call-log-view">
      <CallLogViewComponent key="call-log-view-content" />
    </View>,
  );
};
