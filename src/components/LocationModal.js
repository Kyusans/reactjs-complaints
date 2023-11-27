import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, Modal, Spinner, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import UpdateLocation from './UpdateLocation';
import UpdateLocationCategory from './UpdateLocationCategory';

function LocationModal(props) {
  const { show, onHide } = props;
  const [locationCategoryTitle, setLocationCategoryTitle] = useState("Select Category");
  const [locationCategoryId, setLocationCategoryId] = useState(0);
  const [locationCategory, setLocationCategory] = useState([]);
  const [locationName, setLocationName] = useState([]);
  const [locationId, setLocationId] = useState(0);
  const [updateLocationIndex, setUpdateLocationIndex] = useState(null);
  const [updateLocationCateg, setUpdateLocationCateg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateClick = (index) => {
    setUpdateLocationIndex(index);
  };

  const handleCancelClick = () => {
    getLocation(locationId);
    setUpdateLocationIndex(null);
    setUpdateLocationCateg(false);
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

  const getLocation = async (id) => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      setLocationId(id);
      const jsonData = { categoryId: id };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getLocations");
      const response = await axios.post(url, formData);
      console.log("response", JSON.stringify(response));
      if (response.data !== 0) {
        setLocationName(response.data);
        setLocationCategoryTitle(response.data[0].locCateg_name);
        setLocationCategoryId(response.data[0].locCateg_id);
      } else {
        setLocationCategoryTitle("No location found");
        setLocationName([]);
      }
      setIsLoading(false)
    } catch (err) {
      alert("There was an unexpected error: " + err);
    }
  };

  const deleteLocation = async (id) => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { locationId: id };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "deleteLocation");

      const response = await axios.post(url, formData);
      if (response.data !== 0) {
        const updatedLocations = locationName.filter(location => location.location_id !== id);
        setLocationName(updatedLocations);
      }
      setIsLoading(false);
    } catch (err) {
      alert("There was an unexpected error: " + err);
    }
  };

  const handleDelete = (name, id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete " + name + "?");
    if (isConfirmed) {
      deleteLocation(id)
    }
  }

  function handleClose() {
    setLocationCategoryTitle("Select Category");
    setUpdateLocationIndex(null)
    onHide();
  }

  return (
    <Modal show={show} onHide={handleClose} fullscreen>
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
        {locationCategoryTitle === "Select Category" ? <></> :
          <>
            {isLoading ?
              <Container className='text-center'>
                <Spinner animation='border' variant='success' />
              </Container>
              :
              <div>
                {updateLocationCateg ? 
                  <UpdateLocationCategory locationCategName={locationCategoryTitle} onCancel={handleCancelClick} id={locationCategoryId} /> 
                :
                  <div className="d-flex align-items-center justify-content-center">
                    <h3 className='text-center'>{locationCategoryTitle}</h3>
                    {locationCategoryTitle !== "No location found" && <FontAwesomeIcon icon={faEdit} className="ms-2 clickable" onClick={() => setUpdateLocationCateg(true)}/>}
                  </div>
                }
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
                        <td>
                          {updateLocationIndex === index ?
                            <UpdateLocation locationName={name.location_name} onCancel={handleCancelClick} id={name.location_id} />
                            : name.location_name
                          }
                        </td>
                        <td>
                          <Button className='mb-2' onClick={() => handleUpdateClick(index)}><FontAwesomeIcon icon={faEdit} /> Edit</Button>
                          <Button className='btn-danger ms-1 mb-2' onClick={() => handleDelete(name.location_name, name.location_id)}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            }
          </>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-danger' onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LocationModal;
