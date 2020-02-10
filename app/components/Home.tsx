import React, { useEffect, useState } from "react";
import BrowserTabRenderer from "./BrowserTabRenderer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { remote, BrowserView as ElectronBrowserView, BrowserWindow as ElectronBrowserWindow } from "electron";
import { ipcMain } from 'electron';
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

const { ipcRenderer } = require('electron');

const MainBrowserWindow: React.FunctionComponent<Props> = (props: Props) => {
  const [mainTabIndex, setTabIndex] = useState<number>(0);
  const [tabs, updateTabs] = useState<BrowserTab[]>([]);
  const [url, updateUrl] = useState<string>('');
  const [title, updateTitle] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorUrl, setErrorUrl] = useState<string>('');

  const { BrowserWindow } = remote
  let win = new BrowserWindow({ width: 500, height: 420, show: false, frame: false, webPreferences: {
    nodeIntegration: true, devTools: false
  }})

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

  const handleNewTab = (title, url): void => {

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
    localStorage.setItem('tabtitle', JSON.stringify(modifiedTabs))
    win.close();
  }

  if(modal){
    win.show()
    win.loadURL('file://' + __dirname + '/modal.html');
  }

  ipcRenderer.on('action-update-label', (event, arg) => {
    let argTitle = arg.message;
    let argUrl = arg.link;
    handleNewTab(argTitle, argUrl)
  });

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
    </>
  )
}

export default MainBrowserWindow;
