import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface Props {
    className: string;
    save: string;
    cancel: string;
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
        <form onSubmit={() => props.onClickSave}>
        <ModalBody>
          {props.children}
        </ModalBody>
        <ModalFooter>
          <Button color="primary">{props.save}</Button>{' '}
          <Button color="secondary" onClick={props.onClickCancel}>{props.cancel}</Button>
        </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

export default ModalBox;
