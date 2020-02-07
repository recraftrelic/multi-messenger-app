import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { remote, BrowserView as ElectronBrowserView, BrowserWindow as ElectronBrowserWindow } from "electron";
import ModalBox from './ModalBox';
import './Home.global.css';

type Props = {};

const ModalShow: React.FunctionComponent<Props> = (props: Props) => {
    const [url, updateUrl] = useState<string>('');
    const [title, updateTitle] = useState<string>('');
    const [modal, setModal] = useState<boolean>(true);
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorUrl, setErrorUrl] = useState<string>('');

    const handleNewTab = (): void => {

        if (!url || !title) {
          return
        }
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex .test(url)) {
          setErrorUrl('Invalid URL');
          return
        }

        updateUrl('');
        updateTitle('');
        setModal(false);
        setErrorTitle('')
        setErrorUrl('')
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
            <input className="search-tab" value={title} onChange={onTitleChange} />
            {errorTitle ? <span className="errormsg">{errorTitle}</span> : null}
            <label className="search-label">Url </label>
            <input className="search-tab" value={url} onChange={onUrlChange} />
            {errorUrl ? <span className="errormsg">{errorUrl}</span> : null}
      </ModalBox>
    </div>
  );
}

export default ModalShow;