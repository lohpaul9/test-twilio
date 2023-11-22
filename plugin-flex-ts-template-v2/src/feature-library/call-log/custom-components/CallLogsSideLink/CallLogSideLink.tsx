import React from 'react';
import { SideLink, Actions, Template, templates } from '@twilio/flex-ui';
import { CallLogStringTemplates } from '../../flex-hooks/strings';

interface CallLogProps {
  activeView?: string;
  viewName: string;
}

const CallLogSideLink = ({ activeView, viewName }: CallLogProps) => {
  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName,
    });
  };

  return (
    <SideLink
      showLabel={true}
      icon="Dashboard"
      iconActive="DashboardBold"
      isActive={activeView === viewName}
      onClick={navigateHandler}
      key="call-log-side-link"
    >
      <Template source={templates[CallLogStringTemplates.CallLogTitle]} />
    </SideLink>
  );
};

export default CallLogSideLink;
