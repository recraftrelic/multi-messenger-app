import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { remote, BrowserView as ElectronBrowserView, BrowserWindow as ElectronBrowserWindow } from "electron";
import ModalBox from './ModalBox';
import './Home.global.css';

type Props = {};

interface BrowserTab {
    url: string;
    title: string;
    config?: any;
}

const { ipcRenderer } = require('electron');

const ModalShow: React.FunctionComponent<Props> = (props: Props) => {
    const [tabs, updateTabs] = useState<BrowserTab[]>([]);
    const [url, updateUrl] = useState<string>('');
    const [title, updateTitle] = useState<string>('');
    const [modal, setModal] = useState<boolean>(true);
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

    const handleNewTab = (event): void => {
        event.preventDefault();
        if (!url || !title) {
          return
        }

        let matched = tabs.map(item => item.title).includes(title)
        if(matched){
          setErrorTitle('Title Already Exists');
          return 
        }

        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex .test(url)) {
          setErrorUrl('Invalid URL');
          return
        }

        setModal(false);
        setErrorTitle('')
        setErrorUrl('')
        let Data = {
            message: (document.getElementById("field") as HTMLInputElement).value,
            link: (document.getElementById("field2") as HTMLInputElement).value
        };

        ipcRenderer.send('request-update-label-in-second-window', Data);
        var window = remote.getCurrentWindow();
        window.hide();
    }

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTitle(event.target.value)
        setErrorTitle('')
    }
      const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateUrl(event.target.value)
        setErrorUrl('')
    }

  return (
    <div>
        <ModalBox className="mymodal" save="Save" cancel="Cancel" onClickCancel={() => setModal(false)} onClickSave={handleNewTab} modal={modal}>
            <label className="search-label">Title </label>
            <input className="search-tab" id="field" value={title} onChange={onTitleChange} />
            {errorTitle ? <span className="errormsg">{errorTitle}</span> : null}
            <label className="search-label">Url </label>
            <input className="search-tab" id="field2" value={url} onChange={onUrlChange} />
            {errorUrl ? <span className="errormsg">{errorUrl}</span> : null}
        </ModalBox>
    </div>
  );
}

export default ModalShow;