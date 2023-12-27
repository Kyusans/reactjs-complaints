import React, { useState } from 'react';
import { Container, Image, ListGroup, Row } from 'react-bootstrap';
import ViewImageModal from './ViewImageModal';

export default function MessageList(props) {
  const { userId, username, message, image, date } = props;

  const [selectedImage, setSelectedImage] = useState(null);
  const [showViewImage, setShowViewImage] = useState(false);
  const isUserComment = userId === localStorage.getItem("userCommentId");

  // view image modal
  const hideViewImage = async () => {
    setShowViewImage(false);
  }
  const handleViewImage = (selectedImage) => {
    setSelectedImage(selectedImage);
    setShowViewImage(true);
  }

  return (
    <>
      <ListGroup className="mb-2">
        <ListGroup.Item variant={isUserComment ? "primary" : "secondary"}>
          <div className='ms-2'>
            <div className='fw-bold'>{username}</div>
            {message}
            <Row>
              {image && (
                <Container>
                  <Image
                    src={localStorage.getItem("url") + "/images/" + image}
                    onClick={() => handleViewImage(image)}
                    className='clickable card-image w-75' rounded
                  />
                </Container>
              )}
            </Row>
            <p className='text-end'>{date}</p>
          </div>
        </ListGroup.Item>
      </ListGroup>
      <ViewImageModal show={showViewImage} onHide={hideViewImage} selectedImage={selectedImage} />
    </>

  );
}
