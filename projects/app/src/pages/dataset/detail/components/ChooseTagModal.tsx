import React, { useCallback, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  ModalFooter,
  ModalBody,
  Input,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  HStack,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { useRouter } from 'next/router';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useRequest } from '@fastgpt/web/hooks/useRequest';
import MyModal from '@fastgpt/web/components/common/MyModal';
import { postCreateDataset } from '@/web/core/dataset/api';
import type { CreateDatasetParams } from '@/global/core/dataset/api.d';
import { useTranslation } from 'next-i18next';
import MyRadio from '@/components/common/MyRadio';
import { DatasetTypeEnum } from '@fastgpt/global/core/dataset/constants';
import { useI18n } from '@/web/context/I18n';
import { useUserStore } from '@/web/support/user/useUserStore';

type ChooseTagModalProps = {
  inputValue: string;
  radioValue: string;
  checkboxValues: string[];
};

//上传时去选择标签弹窗
const ChooseTagModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { datasetT } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const { isPc, feConfigs } = useSystemStore();

  const { register, setValue, getValues, handleSubmit, control } = useForm<ChooseTagModalProps>({
    defaultValues: {
      inputValue: '',
      radioValue: '',
      checkboxValues: []
    }
  });
  const { userInfo } = useUserStore();

  /* create a new kb and router to it */
  const { mutate: onclickCreate, isLoading: creating } = useRequest({
    mutationFn: async (data: ChooseTagModalProps) => {
      // const id = await postCreateDataset(data);
      // return { id };
      console.log('getValues', getValues());
      console.log('data', data);
      return null;
    },
    successToast: '设置成功',
    errorToast: '设置失败',
    onSuccess({ id }) {
      //设置成功以后执行的操作
    }
  });

  const handleRadioChange = useCallback(
    (e: string) => {
      setValue('radioValue', e);
    },
    [setValue, toast]
  );

  return (
    <MyModal
      iconSrc="/imgs/workflow/db.png"
      title={'请选择标签'}
      isOpen
      onClose={onClose}
      isCentered={!isPc}
      w={'600px'}
    >
      <ModalBody py={2}>
        <FormControl>
          <FormLabel>Radio Group</FormLabel>
          <Controller
            name="radioValue"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <RadioGroup {...field}>
                <HStack spacing={3} align="stretch">
                  <Radio value="1">Option 1</Radio>
                  <Radio value="2">Option 2</Radio>
                  <Radio value="3">Option 3</Radio>
                </HStack>
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormControl mt={3}>
          <FormLabel>Checkbox Group</FormLabel>
          <Controller
            name="checkboxValues"
            control={control}
            rules={{
              validate: (value) => value.length > 0 || 'At least one checkbox must be selected'
            }}
            render={({ field }) => (
              <CheckboxGroup
                {...field}
                value={field.value || []}
                onChange={(values) => field.onChange(values)}
              >
                <HStack spacing={3} align="stretch">
                  <Checkbox value="A">Option A</Checkbox>
                  <Checkbox value="B">Option B</Checkbox>
                  <Checkbox value="C">Option C</Checkbox>
                </HStack>
              </CheckboxGroup>
            )}
          />
        </FormControl>

        <Box mt={5}>
          <Box color={'myGray.900'}>{t('common.Set Name')}</Box>
          <Flex mt={1} alignItems={'center'}>
            <Input
              flex={1}
              autoFocus
              bg={'myWhite.600'}
              placeholder={t('common.Name')}
              maxLength={30}
              {...register('inputValue', {
                required: true
              })}
            />
          </Flex>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button variant={'whiteBase'} mr={3} onClick={onClose}>
          {t('common.Close')}
        </Button>
        <Button isLoading={creating} onClick={handleSubmit((data) => onclickCreate(data))}>
          {t('common.Confirm Create')}
        </Button>
      </ModalFooter>
    </MyModal>
  );
};

export default ChooseTagModal;
