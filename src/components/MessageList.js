import React, { useEffect } from 'react';
import { Image, ListGroup } from 'react-bootstrap';

export default function MessageList(props) {
  const { userId, username, message, image, date } = props;
  const isUserComment = userId === localStorage.getItem("userCommentId");

  useEffect(() => {
    console.log("image nato: " + image)
  }, [image])
  

  return (
    <ListGroup className="mb-2">
      <ListGroup.Item variant={isUserComment ? "primary" : "secondary"}>
        <div className='ms-2'>
          <div className='fw-bold'>{username}</div>
          {message}
          {image && (
            <Image src={localStorage.getItem("url") + "/images/" + image} className='card-image' rounded />
          )}
          <p className='text-end'>{date}</p>
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
}
