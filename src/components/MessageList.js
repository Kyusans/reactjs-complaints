import React from 'react';
import { ListGroup } from 'react-bootstrap';

export default function MessageList(props) {
  const {message} = props;
  return (
    <ListGroup>
      <ListGroup.Item>
        {message}
      </ListGroup.Item>
    </ListGroup>
  )
}
