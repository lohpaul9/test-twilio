import * as Flex from '@twilio/flex-ui';
import CallLogSideLink from '../../custom-components/CallLogsSideLink/CallLogSideLink';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.SideNav;

export const componentHook = function KeyboardSideNav(_manager: Flex.Manager) {
  Flex.SideNav.Content.add(<CallLogSideLink key="call-log-side-nav" viewName="call-log" />, {
    sortOrder: 100,
  });
};
