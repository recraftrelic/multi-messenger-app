import React, { useEffect, useState, useCallback } from "react";
import BrowserTabRenderer from "./BrowserTabRenderer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { remote, BrowserView as ElectronBrowserView, BrowserWindow as ElectronBrowserWindow, BrowserWindow } from "electron";
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
  const [modalWindow, setModalWindow] = useState<ElectronBrowserWindow>(null)

  const handleNewTab = useCallback((title, url): void => {
    
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
    setTabIndex(modifiedTabs.length - 2);
    updateUrl('');
    updateTitle('');
    setModal(false);

    if (modalWindow) {
      modalWindow.close();
      setModalWindow(null)
    }

    localStorage.setItem('tabtitle', JSON.stringify(modifiedTabs))
  }, [tabs, modalWindow])

  const onRemovingTab = (index: number): void => {
    const tabItems: BrowserTab[] = tabs.filter((_,tabIndex: number) => tabIndex !== index)
    updateTabs(tabItems);
    setTabIndex(tabItems.length - 1);
    localStorage.setItem('tabtitle', JSON.stringify(tabItems))
  }

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
    setTabIndex(update.length - 1);
  }, [])

  useEffect(() => {
    const onEvent = (event, arg) => {
      let argTitle = arg.message;
      let argUrl = arg.link;
      handleNewTab(argTitle, argUrl)
    }

    ipcRenderer.on('action-update-label', onEvent);

    return () => ipcRenderer.removeListener('action-update-label', onEvent)
  }, [handleNewTab]);

  useEffect(() => {
    if (modal && !modalWindow) {
      const { BrowserWindow } = remote
      let win = new BrowserWindow({ width: 500, height: 420, alwaysOnTop: true, show: false, frame: false, webPreferences: {
        nodeIntegration: true, devTools: false
      }})

      win.on('closed', () => {
        win = null
      })
      win.loadURL('file://' + __dirname + '/modal.html');
      win.show();

      setModalWindow(win)
    }
  }, [modal])

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
