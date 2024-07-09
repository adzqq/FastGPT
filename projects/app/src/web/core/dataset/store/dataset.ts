import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  DatasetListItemType,
  DatasetSimpleItemType
} from '@fastgpt/global/core/dataset/type.d';
import { getAllDataset, getDatasets ,getAdDatasets} from '@/web/core/dataset/api';

import { getTokenLogin } from '@/web/support/user/api';



type State = {
  allDatasets: DatasetSimpleItemType[];
  loadAllDatasets: () => Promise<DatasetSimpleItemType[]>;
  myDatasets: DatasetListItemType[];
  loadMyDatasets: (parentId?: string) => Promise<any>;
};

export const useDatasetStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({
        allDatasets: [],
        async loadAllDatasets() {
          const res = await getAllDataset();
            //获取账号信息
            const accountInfo = await getTokenLogin();
            //用户id
            const userId = accountInfo._id
            //获取知识库列表
            const adres = await getAdDatasets(userId);
            res.forEach((item,index) => {
              item.adId = adres[index][1] === item.name?adres[index][0]:''
            });
          set((state) => {
            state.allDatasets = res;
          });
          return res;
        },
        myDatasets: [],
        async loadMyDatasets(parentId = '') {
            console.log('爱动loadMyDatasets');
          const res = await getDatasets({ parentId });
          //获取账号信息
          const accountInfo = await getTokenLogin();
          //用户id
          const userId = accountInfo._id
          //获取知识库列表
          const adres = await getAdDatasets(userId);
          res.forEach((item,index) => {
            item.adId = adres[index][1] === item.name?adres[index][0]:''
          });
          set((state) => {
            state.myDatasets = res;
          });
          return res;
        }
      })),
      {
        name: 'datasetStore',
        partialize: (state) => ({})
      }
    )
  )
);
