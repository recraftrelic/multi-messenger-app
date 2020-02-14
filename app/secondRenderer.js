import React from 'react';
import ReactDOM from 'react-dom';
import ModalShow from './components/ModalShow';

class Modals extends React.Component {
  render() {
      return (
          <div>
            <ModalShow className="mojo"></ModalShow>
          </div>
      );
  }
}

ReactDOM.render(
 <Modals />,
  document.getElementById('root')
);
