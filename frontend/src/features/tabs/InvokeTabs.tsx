import { Tab, TabPanel, TabPanels, Tabs, Tooltip } from '@chakra-ui/react';
import _ from 'lodash';
import React, { ReactElement } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import NodesWIP from 'common/components/WorkInProgress/NodesWIP';
import { PostProcessingWIP } from 'common/components/WorkInProgress/PostProcessingWIP';
import ImageToImageIcon from 'common/icons/ImageToImageIcon';
import InpaintIcon from 'common/icons/InpaintIcon';
import NodesIcon from 'common/icons/NodesIcon';
import OutpaintIcon from 'common/icons/OutpaintIcon';
import PostprocessingIcon from 'common/icons/PostprocessingIcon';
import TextToImageIcon from 'common/icons/TextToImageIcon';
import {
  setActiveTab,
  setIsLightBoxOpen,
  setShouldShowOptionsPanel,
} from 'features/options/optionsSlice';
import ImageToImageWorkarea from './ImageToImage';
import TextToImageWorkarea from './TextToImage';
import Lightbox from 'features/lightbox/Lightbox';
import { setDoesCanvasNeedScaling } from 'features/canvas/canvasSlice';
import UnifiedCanvasWorkarea from './UnifiedCanvas/UnifiedCanvasWorkarea';
import { setShouldShowGallery } from 'features/gallery/gallerySlice';
import UnifiedCanvasIcon from 'common/icons/UnifiedCanvasIcon';

export const tabDict = {
  txt2img: {
    title: <TextToImageIcon fill={'black'} boxSize={'2.5rem'} />,
    workarea: <TextToImageWorkarea />,
    tooltip: 'Text To Image',
  },
  img2img: {
    title: <ImageToImageIcon fill={'black'} boxSize={'2.5rem'} />,
    workarea: <ImageToImageWorkarea />,
    tooltip: 'Image To Image',
  },
  unifiedCanvas: {
    title: <UnifiedCanvasIcon fill={'black'} boxSize={'2.5rem'} />,
    workarea: <UnifiedCanvasWorkarea />,
    tooltip: 'Unified Canvas',
  },
  nodes: {
    title: <NodesIcon fill={'black'} boxSize={'2.5rem'} />,
    workarea: <NodesWIP />,
    tooltip: 'Nodes',
  },
  postprocess: {
    title: <PostprocessingIcon fill={'black'} boxSize={'2.5rem'} />,
    workarea: <PostProcessingWIP />,
    tooltip: 'Post Processing',
  },
};

// Array where index maps to the key of tabDict
export const tabMap = _.map(tabDict, (tab, key) => key);

// Use tabMap to generate a union type of tab names
const tabMapTypes = [...tabMap] as const;
export type InvokeTabName = typeof tabMapTypes[number];

export default function InvokeTabs() {
  const activeTab = useAppSelector(
    (state: RootState) => state.options.activeTab
  );
  const isLightBoxOpen = useAppSelector(
    (state: RootState) => state.options.isLightBoxOpen
  );
  const shouldShowGallery = useAppSelector(
    (state: RootState) => state.gallery.shouldShowGallery
  );
  const shouldShowOptionsPanel = useAppSelector(
    (state: RootState) => state.options.shouldShowOptionsPanel
  );
  const dispatch = useAppDispatch();

  useHotkeys('1', () => {
    dispatch(setActiveTab(0));
  });

  useHotkeys('2', () => {
    dispatch(setActiveTab(1));
  });

  useHotkeys('3', () => {
    dispatch(setActiveTab(2));
  });

  useHotkeys('4', () => {
    dispatch(setActiveTab(3));
  });

  useHotkeys('5', () => {
    dispatch(setActiveTab(4));
  });

  useHotkeys('6', () => {
    dispatch(setActiveTab(5));
  });

  // Lightbox Hotkey
  useHotkeys(
    'v',
    () => {
      dispatch(setIsLightBoxOpen(!isLightBoxOpen));
    },
    [isLightBoxOpen]
  );

  useHotkeys(
    'f',
    () => {
      if (shouldShowGallery || shouldShowOptionsPanel) {
        dispatch(setShouldShowOptionsPanel(false));
        dispatch(setShouldShowGallery(false));
      } else {
        dispatch(setShouldShowOptionsPanel(true));
        dispatch(setShouldShowGallery(true));
      }
      setTimeout(() => dispatch(setDoesCanvasNeedScaling(true)), 400);
    },
    [shouldShowGallery, shouldShowOptionsPanel]
  );

  const renderTabs = () => {
    const tabsToRender: ReactElement[] = [];
    Object.keys(tabDict).forEach((key) => {
      tabsToRender.push(
        <Tooltip
          key={key}
          hasArrow
          label={tabDict[key as keyof typeof tabDict].tooltip}
          placement={'right'}
        >
          <Tab>{tabDict[key as keyof typeof tabDict].title}</Tab>
        </Tooltip>
      );
    });
    return tabsToRender;
  };

  const renderTabPanels = () => {
    const tabPanelsToRender: ReactElement[] = [];
    Object.keys(tabDict).forEach((key) => {
      tabPanelsToRender.push(
        <TabPanel className="app-tabs-panel" key={key}>
          {tabDict[key as keyof typeof tabDict].workarea}
        </TabPanel>
      );
    });
    return tabPanelsToRender;
  };

  return (
    <Tabs
      isLazy
      className="app-tabs"
      variant={'unstyled'}
      defaultIndex={activeTab}
      index={activeTab}
      onChange={(index: number) => {
        dispatch(setActiveTab(index));
        dispatch(setDoesCanvasNeedScaling(true));
      }}
    >
      <div className="app-tabs-list">{renderTabs()}</div>
      <TabPanels className="app-tabs-panels">
        {isLightBoxOpen ? <Lightbox /> : renderTabPanels()}
      </TabPanels>
    </Tabs>
  );
}
