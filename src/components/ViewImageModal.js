import React from 'react'
import { Image, Modal } from 'react-bootstrap'

function ViewImageModal(props) {
  const { show, onHide, selectedImage } = props;
  return (
    <Modal className='bg-dark' show={show} onHide={onHide} size='xl' centered>
      <Modal.Header closeButton/>
        {selectedImage && (
          <Image
            src={localStorage.getItem("url") + "/images/" + selectedImage}
            alt="Zoomed Image"
            className="img-fluid"
          />
        )}
    </Modal>
  )
}

export default ViewImageModal