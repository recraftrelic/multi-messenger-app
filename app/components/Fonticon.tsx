import React from 'react';

interface Props {
    className: string;
}

const FontIcon: React.FunctionComponent<Props> = (props: Props) => {

    return (
        <i className ={props.className} ></i>
    );

}

export default FontIcon;
