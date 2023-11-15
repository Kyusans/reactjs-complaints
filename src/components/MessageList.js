import React from 'react';
import { ListGroup } from 'react-bootstrap';

export default function MessageList(props) {
  const { userId, username, message, date } = props;
  const isUserComment = userId === localStorage.getItem("userCommentId");

  return (
    <ListGroup className="mb-2">
      <ListGroup.Item variant={isUserComment ? "primary" : "secondary"}>
        <div className='ms-2'>
          <div className='fw-bold'>{username}</div>
          {message}
          <p className='text-end'>{date}</p>
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
}
