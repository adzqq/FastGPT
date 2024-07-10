import { useUserStore } from '@/web/support/user/useUserStore';
import React, { useCallback, useRef } from 'react';
import ChatBox from '@/components/ChatBox';
import type { ComponentRef, StartChatFnProps } from '@/components/ChatBox/type.d';
import { streamFetch } from '@/web/common/api/fetch';
import { adStreamFetch } from '@/web/common/api/adfetch';
import { checkChatSupportSelectFileByModules } from '@/web/core/chat/utils';
import {
  getDefaultEntryNodeIds,
  getMaxHistoryLimitFromNodes,
  initWorkflowEdgeStatus,
  storeNodes2RuntimeNodes
} from '@fastgpt/global/core/workflow/runtime/utils';
import { useMemoizedFn } from 'ahooks';
import { AppChatConfigType } from '@fastgpt/global/core/app/type';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from './context';
import { StoreNodeItemType } from '@fastgpt/global/core/workflow/type';
import { StoreEdgeItemType } from '@fastgpt/global/core/workflow/type/edge';
import { getAppDetailById} from '@/web/core/app/api';
import {FlowNodeTypeEnum} from '@fastgpt/global/core/workflow/node/constant';
export const useChatTest = ({
  nodes,
  edges,
  chatConfig
}: {
  nodes: StoreNodeItemType[];
  edges: StoreEdgeItemType[];
  chatConfig: AppChatConfigType;
}) => {
  const { userInfo } = useUserStore();
  const ChatBoxRef = useRef<ComponentRef>(null);
  const { appDetail } = useContextSelector(AppContext, (v) => v);

  const startChat = useMemoizedFn(
    async ({ chatList, controller, generatingMessage, variables }: StartChatFnProps) => {
      /* get histories */
      let historyMaxLen = getMaxHistoryLimitFromNodes(nodes);

      const history = chatList.slice(-historyMaxLen - 2, -2);

       
      //根据appId 获取知识库id

      const node = appDetail.modules.find(x =>x.flowNodeType==FlowNodeTypeEnum.datasetSearchNode)
      const datasetInfos = node?.inputs.find(x => x.key === 'datasets')?.value;
      const kb_ids = datasetInfos.map(x =>x.datasetId);
      console.log("爱动知识库kb_ids",kb_ids);


      const prompt = chatList[chatList.length - 2].value;
      console.log("爱动prompt",prompt);
     

      // 流请求，获取数据
      const { responseText, responseData } = await adStreamFetch({
        // url: '/api/core/chat/chatTest',
        data: {
          history,
          prompt: prompt,
          nodes: storeNodes2RuntimeNodes(nodes, getDefaultEntryNodeIds(nodes)),
          edges: initWorkflowEdgeStatus(edges),
          variables,
          appId: appDetail._id,
          appName: `调试-${appDetail.name}`,
          user_id:userInfo?._id,
          kb_ids:kb_ids,
          question:prompt[0].text.content
        },
        onMessage: generatingMessage,
        abortCtrl: controller
      });

      return { responseText, responseData };
    }
  );

  const resetChatBox = useCallback(() => {
    ChatBoxRef.current?.resetHistory([]);
    ChatBoxRef.current?.resetVariables();
  }, []);

  const CustomChatBox = useMemoizedFn(() => (
    <ChatBox
      ref={ChatBoxRef}
      appId={appDetail._id}
      appAvatar={appDetail.avatar}
      userAvatar={userInfo?.avatar}
      showMarkIcon
      chatConfig={chatConfig}
      showFileSelector={checkChatSupportSelectFileByModules(nodes)}
      onStartChat={startChat}
      onDelMessage={() => {}}
    />
  ));

  return {
    resetChatBox,
    ChatBox: CustomChatBox
  };
};

export default function Dom() {
  return <></>;
}
