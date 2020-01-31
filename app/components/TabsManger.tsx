import React from 'react';
import FontIcon from './FontIcon';

interface Props {
    className: string;
    add: number;
    removeTab?: (e: React.MouseEvent) => void;
    onClickSave?: (e: React.MouseEvent) => void;
    tab?: any;
}

const TabsManager: React.FunctionComponent<Props> = (props: Props) => {

    return (
        <button className={props.className} onClick={props.onClickSave} key={props.add}><img src="https://recraftrelic.com/images/Recraft_relic_web_logo_icon.png" />{props.tab.title}<FontIcon className="fa fa-times" onClick={props.removeTab} key={props.add}></FontIcon></button>
    );

}

export default TabsManager;
