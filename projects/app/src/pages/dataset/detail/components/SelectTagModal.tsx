// SelectTagModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner
} from '@chakra-ui/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Select from 'react-select';
import { getConfigTagListByUid } from '@/web/core/tag/api';
import {
  TagItemType,
  SelectTagFormValues,
  SubmitFormTagValues
} from '@fastgpt/global/core/tag/type';

interface SelectTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SubmitFormTagValues>;
}

const SelectTagModal: React.FC<SelectTagModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    clearErrors,
    reset,
    setValue,
    resetField
  } = useForm<SubmitFormTagValues>();
  const [tags, setTags] = useState<SelectTagFormValues[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // 模拟获取标签数据
      getConfigTagListByUid('').then((res) => {
        if (res) {
          //格式转换
          const tags: TagItemType[] = res;
          const mergeTagFn = (tags: TagItemType[]): SelectTagFormValues[] => {
            const tagMap: { [key: string]: TagItemType[] } = {}; //定义tagMap的类型
            tags.forEach((tag) => {
              if (!tagMap[tag.tagKey]) {
                tagMap[tag.tagKey] = [];
              }
              tagMap[tag.tagKey].push(tag);
            });
            return Object.keys(tagMap).map((key) => ({
              key,
              values: tagMap[key]
            }));
          };
          const mergedTags = mergeTagFn(tags);
          setTags(mergedTags);
          setLoading(false);
        }
      });
    }
  }, []);

  const tagKeys = tags.map((tag) => ({ value: tag.key, label: tag.key }));
  const selectedKey = watch('key');
  const selectedTag = tags.find((tag) => tag.key === selectedKey);
  const tagValuesOptions = selectedTag
    ? selectedTag.values.map((item) => ({ value: item.tagValue, label: item.tagValue }))
    : [];

  const handleClose = () => {
    reset();
    onClose();
  };

  const customTheme = (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: '#fbe3ef',
      primary: '#d30065'
    }
  });

  const handleFormSubmit = handleSubmit((data: SubmitFormTagValues) => {
    onSubmit(data);
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>选择标签</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.key}>
                <FormLabel>标签键</FormLabel>
                <Controller
                  name="key"
                  control={control}
                  rules={{ required: '请选择标签键' }}
                  render={({ field }) => (
                    <Select
                      options={tagKeys}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value || '');
                        //切换标签键时，清空标签值
                      }}
                      isClearable
                      isSearchable
                      placeholder="请选择标签键"
                      theme={customTheme}
                    />
                  )}
                />
                <FormErrorMessage>{errors.key && errors.key.message}</FormErrorMessage>
              </FormControl>

              {selectedKey && (
                <FormControl isInvalid={!!errors.values} mt={4}>
                  <FormLabel>标签值</FormLabel>
                  <Controller
                    name="values"
                    control={control}
                    rules={{ required: '请选择标签值' }}
                    render={({ field }) => (
                      <Select
                        options={tagValuesOptions}
                        isMulti
                        onChange={(selectedOptions) =>
                          field.onChange(selectedOptions.map((option) => option.value))
                        }
                        placeholder="请选择标签值"
                        theme={customTheme}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.values && errors.values.message}</FormErrorMessage>
                </FormControl>
              )}
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={handleFormSubmit}>
            确定
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            取消
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectTagModal;
