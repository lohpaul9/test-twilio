import React from 'react';
import { Icon, useFlexSelector } from '@twilio/flex-ui';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';
import AppState from 'types/manager/AppState';

import { getChannelIcon } from '../../utils/helpers';
import QueueDataUtil from '../../utils/QueueDataUtil';
import {
  TileWrapper,
  Title,
  Channel,
  ChannelIcon,
  Content,
  Caption,
  Label,
  Metric,
  Handled,
  MetricsContainer,
} from './ChannelSLATile.Components';
import { ChannelSLMetrics, SLMetrics } from '../../types';

interface ComponentProps {
  channelName: string;
  channelList: string[];
}

const ChannelSLATileV2 = (props: ComponentProps) => {
  const { channelName, channelList } = props;
  const sla: ChannelSLMetrics = useFlexSelector((state: AppState) => {
    const queues: WorkerQueue[] = Object.values(state.flex.realtimeQueues.queuesList);
    const allSLMetrics: SLMetrics = QueueDataUtil.getSLTodayByChannel(queues, channelList);
    return allSLMetrics[channelName.toLocaleLowerCase()];
  });

  let content = '-';
  if (sla?.handledTasks && sla?.handledTasks > 0) {
    content = `${sla.serviceLevelPct}%`;
  }

  return (
    <TileWrapper value={sla?.serviceLevelPct} count={sla?.handledTasks} className="Twilio-AggregatedDataTile">
      <Channel>
        <ChannelIcon>
          <Icon icon={getChannelIcon(channelName)} />
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title">{`${channelName} SLA`}</Title>
      </Channel>
      <Content className="Twilio-AggregatedDataTile-Content">{content}</Content>
      <Caption>Today</Caption>
      <MetricsContainer>
        <Handled>
          <Label>Handled</Label>
          <Metric>{sla?.handledTasks || 0}</Metric>
        </Handled>
        <Handled>
          <Label>Within&nbsp;SL</Label>
          <Metric>{sla?.handledTasksWithinSL || 0}</Metric>
        </Handled>
      </MetricsContainer>
    </TileWrapper>
  );
};

export default ChannelSLATileV2;
