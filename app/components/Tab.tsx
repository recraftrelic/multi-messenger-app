import React from 'react';
import FontIcon from './FontIcon';

interface Props {
    className: string;
    add: number;
    removeTab?: (e: React.MouseEvent) => void;
    onClickSave?: (e: React.MouseEvent) => void;
    isActive?: any;
    tab?: any;
}

const Tab: React.FunctionComponent<Props> = (props: Props) => {

    return (
        <button className={`${props.className} ${props.isActive ? 'active' : ''}`} onClick={props.onClickSave} key={props.add}><img src="https://recraftrelic.com/images/Recraft_relic_web_logo_icon.png" />{props.tab.title}<FontIcon className="fa fa-times" onClick={props.removeTab}></FontIcon></button>
    );

}

export default Tab;
