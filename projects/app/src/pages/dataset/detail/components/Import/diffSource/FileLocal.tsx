import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ImportSourceItemType } from '@/web/core/dataset/type.d';
import { Box, Button } from '@chakra-ui/react';
import FileSelector from '../components/FileSelector';
import { useTranslation } from 'next-i18next';

import dynamic from 'next/dynamic';
import Loading from '@fastgpt/web/components/common/MyLoading';
import { RenderUploadFiles } from '../components/RenderFiles';
import { useContextSelector } from 'use-context-selector';
import { DatasetImportContext } from '../Context';

const DataProcess = dynamic(() => import('../commonProgress/DataProcess'), {
  loading: () => <Loading fixed={false} />
});
const Upload = dynamic(() => import('../commonProgress/Upload'));

const fileType = '.txt, .docx, .csv, .xlsx, .pdf, .md, .html, .pptx';

const FileLocal = ({ datasetId, kb_id}: { datasetId: string,kb_id:string }) => {
  const activeStep = useContextSelector(DatasetImportContext, (v) => v.activeStep);

  return (
    <>
      {activeStep === 0 && <SelectFile datasetId={datasetId} kb_id={kb_id}/>}
      {activeStep === 1 && <DataProcess showPreviewChunks={false} />}
      {activeStep === 2 && <Upload />}
    </>
  );
};

export default React.memo(FileLocal);

const SelectFile = React.memo(function SelectFile({ datasetId, kb_id}: { datasetId: string,kb_id:string }) {
    console.log('爱动SelectFile',datasetId+"---"+kb_id);
  const { t } = useTranslation();
  const { goToNext, sources, setSources } = useContextSelector(DatasetImportContext, (v) => v);
  const [selectFiles, setSelectFiles] = useState<ImportSourceItemType[]>(
    sources.map((source) => ({
      isUploading: false,
      ...source
    }))
  );
  const [uploading, setUploading] = useState(false);
  const successFiles = useMemo(() => selectFiles.filter((item) => !item.errorMsg), [selectFiles]);

  useEffect(() => {
    setSources(successFiles);
  }, [setSources, successFiles]);

  const onclickNext = useCallback(() => {
    // filter uploaded files
    setSelectFiles((state) => state.filter((item) => (item.uploadedFileRate || 0) >= 100));
    goToNext();
  }, [goToNext]);

  return (
    <Box>
      <FileSelector
        fileType={fileType}
        selectFiles={selectFiles}
        setSelectFiles={setSelectFiles}
        datasetId={datasetId}
        kb_id={kb_id}
        onStartSelect={() => setUploading(true)}
        onFinishSelect={() => setUploading(false)}
      />

      {/* render files */}
      <RenderUploadFiles files={selectFiles} setFiles={setSelectFiles} showPreviewContent />

      <Box textAlign={'right'} mt={5}>
        <Button isDisabled={successFiles.length === 0 || uploading} onClick={onclickNext}>
          {selectFiles.length > 0
            ? `${t('core.dataset.import.Total files', { total: selectFiles.length })} | `
            : ''}
          {t('common.Next Step')}
        </Button>
      </Box>
    </Box>
  );
});
