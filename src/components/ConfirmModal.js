import axios from 'axios';
import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function ConfirmModal(props) {
  const {show, hide, compId} = props;

  return (
    <>
      <Modal show={show} onHide={hide} centered>
        <Modal.Header><h4>Confirmation</h4></Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this job as completed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-danger'>Close</Button>
          <Button variant='outline-success'>Mark as done</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
