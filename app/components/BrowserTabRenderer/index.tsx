import React, { useEffect, useState } from 'react';
import { remote, BrowserView as ElectronBrowserView, BrowserWindow as ElectronBrowserWindow } from "electron";

interface Bounds {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Props {
  url: string;
  title: string;
  config: any;
  isActive: boolean;
}

const createBrowserTab = (url?: string, config?: any): ElectronBrowserView => {
  const { BrowserView } = remote;

  const view: ElectronBrowserView = new BrowserView(config);
  view.webContents.loadURL(url);

  return view;
}

export const setBrowserView = (view: ElectronBrowserView|undefined): void => {
  if (!view) return;

  const { BrowserWindow } = remote
  const focusedWindow: ElectronBrowserWindow = BrowserWindow.getFocusedWindow();
  
  focusedWindow.setBrowserView(view);

  const bounds: Bounds = focusedWindow.getBounds();

  view.setBounds({...bounds, width: bounds.width, height: bounds.height - 50, x: 0, y: 50});
  view.setAutoResize({width: true, height: true, vertical: true, horizontal: true})
}

const BrowserTabRenderer: React.FunctionComponent<Props> = (props: Props) => {
  const { BrowserView } = remote;

  const [view, setView] = useState<ElectronBrowserView>(new BrowserView())

  useEffect(() => {
    setView(createBrowserTab(props.url, props.config))
  }, [])

  useEffect(() => {
    if (props.isActive) {
      setBrowserView(view)
    }
  }, [props.isActive])

  useEffect(() => {
    setBrowserView(view)
  }, [view])

  return null
}

export default BrowserTabRenderer
