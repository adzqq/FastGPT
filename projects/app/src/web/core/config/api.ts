import { GET, POST, PUT, DELETE } from '@/web/common/api/request';
import type { CreateTagParams } from '@/global/core/config/api.d';

/**
 * 创建一个模型
 */
export const postCreateConfigTag = (data: CreateTagParams) => {
  return POST<string>(`/core/dataset/create`, data);
};

/**
 * 根据ID更新模型
 */
export const putConfigTagById = (id: string) => PUT<void>(`/core/dataset/update?id=${id}`);

/**
 * 根据ID删除模型
 */
export const delConfigTagById = (id: string) => DELETE(`/core/config/delete?id=${id}`);

/**
 * 根据user_id获取模型列表
 */
export const getConfigTagListByUid = (user_id: string) =>
  POST(`/core/dataset/data/list`, { user_id });
