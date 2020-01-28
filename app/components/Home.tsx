import React, { useEffect, useState } from "react";
import BrowserTabRenderer from "./BrowserTabRenderer";

import './Home.css';

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

  const handleNewTab = (): void => {
    const newTab: BrowserTab = {
      url,
      title: url,
      config: {
        webPreferences: {
          partition: `persist:${url}`
        }
      }
    }

    const modifiedTabs: BrowserTab[] = tabs.concat(newTab);
    updateTabs(modifiedTabs);
    setTabIndex(modifiedTabs.length - 1);
  }

  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateUrl(event.target.value)
  }

  const handleDelete = index => {
    const tabItem = tabs.filter((tab,tabIndex) => {
      return tabIndex !== index
    })
    updateUrl(tabItem);
  }

  return (
    <>
      {
        tabs.map(
          (tab: BrowserTab, index: number) => <><img src="../Recraft_relic_web_logo_icon.png" /><button className="urlview" onClick={() => setTabIndex(index)} key={index}>{tab.title}<i className="fa fa-times" onClick={() => handleDelete(index)}></i></button></>
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
      <input value={url} onChange={onUrlChange} />
      <button onClick={handleNewTab}>New tab</button>
    </>
  )
}

export default MainBrowserWindow;
