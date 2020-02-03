import React, { useEffect, useState } from "react";
import BrowserTabRenderer from "./BrowserTabRenderer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { remote, BrowserView as ElectronBrowserView, BrowserWindow as ElectronBrowserWindow } from "electron";
import FontIcon from './FontIcon';
import ModalBox from './ModalBox';
import Tab from './Tab';
import './Home.global.css';

type Props = {};

interface BrowserTab {
  url: string;
  title: string;
  config?: any;
}

const MainBrowserWindow: React.FunctionComponent<Props> = (props: Props) => {
  const [mainTabIndex, setTabIndex] = useState<number>(0);
  const [tabs, updateTabs] = useState<BrowserTab[]>([]);
  const [url, updateUrl] = useState<string>('');
  const [title, updateTitle] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);

  const { BrowserWindow } = remote
  const focusedWindow: ElectronBrowserWindow = BrowserWindow.getFocusedWindow();

  const handleNewTab = (): void => {
    if (!url || !title) {
      return
    }
    const newTab: BrowserTab = {
      url,
      title: title,
      config: {
        webPreferences: {
          partition: `persist:${url}`
        }
      }
    }

    const modifiedTabs: BrowserTab[] = tabs.concat(newTab);
    updateTabs(modifiedTabs);
    setTabIndex(modifiedTabs.length - 1);
    updateUrl('');
    updateTitle('');
    setModal(false);
  }

  if(modal){
    focusedWindow.setBrowserView(modal);
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => updateTitle(event.target.value)
  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => updateUrl(event.target.value)

  const onRemovingTab = (index: number): void => {
    const tabItems: BrowserTab = tabs.filter((_,tabIndex: number) => tabIndex !== index)
    updateTabs(tabItems);
  }
  return (
    <>
      {
        tabs.map(
          (tab: BrowserTab, index: number) =>  {
            return <Tab 
              className="urlview" 
              onClickSave={() => setTabIndex(index)} 
              add={index}
              removeTab={() => onRemovingTab(index)}
              tab={tab}
              key={index}
              isActive={index == mainTabIndex}
              />
          }
        )
      }
      {
        tabs.map(
          (tab: BrowserTab, index: number) => (
            <BrowserTabRenderer
              key={index}
              url={tab.url}
              config={tab.config}
              title={tab.title}
              isActive={index == mainTabIndex}
            />
          )
        )
      }
      <Button className="new-tab" onClick={() => setModal(true)}>+</Button>
      <ModalBox className="mymodal" save="Save" cancel="Cancel" onClickCancel={() => setModal(false)} onClickSave={handleNewTab} modal={modal}>
        <label className="search-label">Title </label>
        <input className="search-tab" value={title} onChange={onTitleChange} />
        <label className="search-label">Url </label>
        <input className="search-tab" value={url} onChange={onUrlChange} />
      </ModalBox>
    </>
  )
}

export default MainBrowserWindow;
