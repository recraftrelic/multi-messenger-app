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
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorUrl, setErrorUrl] = useState<string>('');

  useEffect(() => {
    let getList = JSON.parse(localStorage.getItem('tabtitle') || '[]');
    let update = getList.map(item => {
      const newTab: BrowserTab = {
        url: item.url,
        title: item.title,
        config: {
          webPreferences: {
            partition: `persist:${item.title}`
          }
        }
      }
      return newTab
    })

    updateTabs(update);
    
  }, []);

  const handleNewTab = (): void => {

    if (!url || !title) {
      return
    }
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(url)) {
      setErrorUrl('Invalid URL');
      return
    }
    let matched = tabs.map(item => item.title).includes(title)
    if(matched){
      setErrorTitle('Title Already Exists');
      return 
    }
    
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
    updateTitle('');
    setModal(false);
    setErrorTitle('')
    setErrorUrl('')
    localStorage.setItem('tabtitle', JSON.stringify(modifiedTabs))
  }

  if(modal){
    const { BrowserWindow } = remote
    let win = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences: {
      nodeIntegration: true
    }})
    win.show()
    win.loadURL('file://' + __dirname + '/modal.html');
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateTitle(event.target.value)
    setErrorTitle('')
  }
  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateUrl(event.target.value)
    setErrorUrl('')
  }

  const onRemovingTab = (index: number): void => {
    const tabItems: BrowserTab[] = tabs.filter((_,tabIndex: number) => tabIndex !== index)
    updateTabs(tabItems);
    localStorage.setItem('tabtitle', JSON.stringify(tabItems))
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
              tab={tab.title}
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
        {errorTitle ? <span className="errormsg">{errorTitle}</span> : null}
        <label className="search-label">Url </label>
        <input className="search-tab" value={url} onChange={onUrlChange} />
        {errorUrl ? <span className="errormsg">{errorUrl}</span> : null}
      </ModalBox>
    </>
  )
}

export default MainBrowserWindow;
