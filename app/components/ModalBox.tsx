import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalBox = (props) => {
  const {
    buttonLabel,
    className,
    save,
    cancel, 
    add,
    children,
    onClickSave
  } = props;

  const [modal, setModal] = useState<boolean>(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button className={add} onClick={toggle}>{buttonLabel}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className} centered>
        <ModalHeader toggle={toggle}>Add URL</ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClickSave}>{save}</Button>{' '}
          <Button color="secondary" onClick={toggle}>{cancel}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalBox;