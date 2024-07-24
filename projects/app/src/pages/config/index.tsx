import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { serviceSideProps } from '@/web/common/utils/i18n';
import PageContainer from '@/components/PageContainer';
//动态引入 TabTag 组件
const TabTag = dynamic(() => import('./tab/TabTag'));
const Config = () => {
  return (
    <PageContainer>
      <Tabs pt={4}>
        <TabList>
          <Tab>分类</Tab>
          <Tab>标签</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>分类配置</TabPanel>
          <TabPanel>
            <TabTag></TabTag>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};

const ConfigRender = () => {
  return <Config />;
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content))
    }
  };
}

export default ConfigRender;
