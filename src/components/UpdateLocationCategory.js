import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

function UpdateLocationCategory(props) {
  const { locationCategName, onCancel, id } = props;
  const [newLocationCategoryName, setNewLocationCategoryName] = useState(locationCategName);

  const updateLocationCategory = async () => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = {newLocationCategName: newLocationCategoryName, locationCategId: id};
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "updateLocationCategory");
      await axios({url:url, data: formData, method:"post"});
      onCancel();
    } catch (error) {
      alert("There was an unexpected error: " + error.message);
    }
  }

  const handleSaveClick = () => {
    if(newLocationCategoryName === ""){
      onCancel();
    }else{
      updateLocationCategory();
    }
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div>
      <Form>
        <Container as={Row}>
          <Col>
            <Form.Control
              type='text'
              value={newLocationCategoryName}
              onChange={(e) => setNewLocationCategoryName(e.target.value)}
            />
          </Col>
        </Container>
        <Container as={Row} className='mt-1 mb-1'>
          <Col>
            <Button variant='primary' onClick={handleSaveClick}>Save</Button>
            <Button variant='danger' onClick={handleCancelClick} className='ms-1'>Cancel</Button>
          </Col>
        </Container>
      </Form>
    </div>
  );
}

export default UpdateLocationCategory