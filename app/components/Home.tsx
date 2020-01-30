import React, { useEffect, useState } from "react";
import BrowserTabRenderer from "./BrowserTabRenderer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Fonticon from './Fonticon';
import ModalBox from './ModalBox';
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

  const handleNewTab = (): void => {
    const newTab: BrowserTab = {
      url,
      title: title,
      config: {
        webPreferences: {
          partition: `persist:${title}`
        }
      }
    }

    const modifiedTabs: BrowserTab[] = tabs.concat(newTab);
    updateTabs(modifiedTabs);
    setTabIndex(modifiedTabs.length - 1);
    updateUrl('');
    setModal(modal);
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => updateTitle(event.target.value)
  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => updateUrl(event.target.value)

  const onRemovingTab = (index: number) => {
    const tabItem = tabs.filter((_,tabIndex) => tabIndex !== index)
    updateTabs(tabItem);
  }
  return (
    <>
      {
        tabs.map(
          (tab: BrowserTab, index: number) =>  {
            return <button className={`urlview ${mainTabIndex === index ? 'active' : ''}`} onClick={() => setTabIndex(index)} key={index}><img src="https://recraftrelic.com/images/Recraft_relic_web_logo_icon.png" />{tab.title}<Fonticon className="fa fa-times" onClick={() => onRemovingTab(index)} key={index}></Fonticon></button>
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
      
      <ModalBox buttonLabel="+" className="mymodal" save="Save" cancel="Cancel" add="new-tab" onClickSave={url ? handleNewTab : null}>
        <label className="search-label">Title </label>
        <input className="search-tab" value={title} onChange={onTitleChange} />
        <label className="search-label">Url </label>
        <input className="search-tab" value={url} onChange={onUrlChange} />
      </ModalBox>
    </>
  )
}

export default MainBrowserWindow;