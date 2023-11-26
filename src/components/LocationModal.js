import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, Modal, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import UpdateLocation from './UpdateLocation';

function LocationModal(props) {
  const { show, onHide } = props;
  const [locationCategoryTitle, setLocationCategoryTitle] = useState("Select Category");
  const [locationCategory, setLocationCategory] = useState([]);
  const [locationName, setLocationName] = useState([]);
  const [locationId, setLocationId] = useState(0);
  const [updateLocationIndex, setUpdateLocationIndex] = useState(null);

  const handleUpdateClick = (index) => {
    setUpdateLocationIndex(index);
  };

  const handleCancelClick = () => {
    getLocation(locationId);
    setUpdateLocationIndex(null);
  };

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
    setLocationId(id);
    const jsonData = { categoryId: id };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "getLocations");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        console.log("res ni getLocations", JSON.stringify(res.data));
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
    setUpdateLocationIndex(null)
    onHide();
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" fullscreen>
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
        {locationCategoryTitle === "Select Category" ? <></>:
          <>
            <div className="d-flex align-items-center justify-content-center">
              <h3 className='text-center'>{locationCategoryTitle}</h3>
              <FontAwesomeIcon icon={faEdit} className="ms-2"/>
            </div>
            <Table bordered striped variant='success' size='sm' className='text-center'>
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locationName.map((name, index) => (
                  <tr key={index}>
                    <td>{updateLocationIndex === index ? <UpdateLocation locationName={name.location_name} onCancel={handleCancelClick} id={name.location_id}/> : name.location_name}</td>
                    <td>
                      <Button variant='outline-primary' className='mb-2' onClick={() => handleUpdateClick(index)}>Update</Button>
                      <Button variant='outline-danger' className='ms-1 mb-2'>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LocationModal;
