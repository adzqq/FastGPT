import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { UpdateHistoryProps } from '@/global/core/chat/api.d';
import { MongoChat } from '@fastgpt/service/core/chat/chatSchema';
import { autChatCrud } from '@/service/support/permission/auth/chat';
import { NextAPI } from '@/service/middleware/entry';
import { ApiRequestProps } from '@fastgpt/service/type/next';

/* update chat top, custom title */
async function handler(req: ApiRequestProps<UpdateHistoryProps>, res: NextApiResponse) {
  const { appId, chatId, title, customTitle, top } = req.body;

  console.log("爱动req.body",req.body)

  await autChatCrud({
    req,
    authToken: true,
    ...req.body,
    per: 'w'
  });

  const result = await MongoChat.findOneAndUpdate(
    { appId, chatId },
    {
      updateTime: new Date(),
      ...(title !== undefined && { title }),
      ...(customTitle !== undefined && { customTitle }),
      ...(top !== undefined && { top })
    },
    {upsert: true}
  );
  console.log("爱动updateHistory",result)
  jsonRes(res);
}

export default NextAPI(handler);
