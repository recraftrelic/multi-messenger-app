import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface Props {
    buttonLabel: string;
    className: string;
    save: string;
    cancel: string;
    add: string;
    children: React.ReactNode;
    onClickSave?: (e: React.MouseEvent) => void;
    modal: boolean;
    onClickCancel?: (e: React.MouseEvent) => void;
}

const ModalBox: React.FunctionComponent<Props> = (props: Props) => {

  return (
    <div>
      <Modal isOpen={props.modal} className={props.className} centered>
        <ModalHeader>Add URL</ModalHeader>
        <ModalBody>
          {props.children}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.onClickSave}>{props.save}</Button>{' '}
          <Button color="secondary" onClick={props.onClickCancel}>{props.cancel}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalBox;
