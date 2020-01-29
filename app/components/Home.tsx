import React, { useEffect, useState } from "react";
import BrowserTabRenderer from "./BrowserTabRenderer";

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
    updateUrl('');
  }

  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateUrl(event.target.value)
  }

  const handleDelete = index => {
    const tabItem = tabs.filter((tab,tabIndex) => {
      return tabIndex !== index
    })
    updateTabs(tabItem);
  }
  console.log(mainTabIndex);
  return (
    <>
      {
        tabs.map(
          (tab: BrowserTab, index: number) =>  {
            return <button className={`urlview ${mainTabIndex === index ? 'active' : ''}`} onClick={() => setTabIndex(index)} key={index}><img src="https://recraftrelic.com/images/Recraft_relic_web_logo_icon.png" />{tab.title}<i className="fa fa-times" onClick={() => handleDelete(index)}></i></button>
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
      <span className="search-bar"><i className="fa fa-search"></i></span><input className="search-tab" value={url} onChange={onUrlChange} />
      <button className="new-tab" onClick={!url ? null : handleNewTab}><span><i className="fa fa-plus"></i></span></button>
    </>
  )
}

export default MainBrowserWindow;