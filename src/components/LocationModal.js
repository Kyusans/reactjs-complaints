import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Container, Dropdown, ListGroup, Modal } from 'react-bootstrap';

function LocationModal(props) {
  const { show, onHide } = props;
  const [locationCategoryTitle, setLocationCategoryTitle] = useState("Select Category");
  const [locationCategory, setLocationCategory] = useState([]);
  const [locationName, setLocationName] = useState([]);

  useEffect(() => {
    getLocationCategory();
  }, []);

  const getLocationCategory = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getLocationCategory");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setLocationCategory(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };

  const getLocation = (id) => {
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = { categoryId: id };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "getLocations");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setLocationName(res.data);
          setLocationCategoryTitle(res.data[0].locCateg_name);
        }else{
          setLocationCategoryTitle("No location found");
          setLocationName([]);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };
   
  function handleClose(){
    setLocationCategoryTitle("Select Category");
    onHide();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Container className='text-center'>
          <Dropdown onSelect={(category) => getLocation(category)}>
            <Dropdown.Toggle variant="success" >Location Category</Dropdown.Toggle>
            <Dropdown.Menu>
              {locationCategory.map((category, index) => (
                <Dropdown.Item key={index} eventKey={category.locCateg_id}>
                  {category.locCateg_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Container>

          {locationCategoryTitle === "Select Category" ? <></>:
            <Card border='secondary' className='mt-3'>
              <Card.Header className="green-header text-center"><h3>{locationCategoryTitle}</h3></Card.Header>
              <Card.Body>
                <ListGroup as="ol" numbered>
                  {locationName.map((name, index) => (
                    <ListGroup.Item key={index} as="li" className="border-dark">
                      {name.location_name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          }

        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default LocationModal;
