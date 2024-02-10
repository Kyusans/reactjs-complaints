import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, FormControl, Row, Spinner } from "react-bootstrap";
import AlertScript from "./AlertScript";

export default function AdminShowDepartment() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [department, setDepartment] = useState([]);
  const [editMode, setEditMode] = useState({});

  // for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  // const getEquipment = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const url = localStorage.getItem("url") + "admin.php";
  //     const formData = new FormData();
  //     formData.append("operation", "getEquipment");

  //     const res = await axios.post(url, formData);
  //     //console.log("res ni getEquipment", JSON.stringify(res.data));

  //     if (res.data !== 0) {
  //       setEquipments(res.data);
  //     } else {
  //       getAlert("danger", "No Equipment yet");
  //     }
  //   } catch (error) {
  //     getAlert("danger", "There was an error occurred: " + error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   getEquipment();
  // }, [getEquipment]);

  const handleUpdateName = (index) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [index]: true,
    }));
  };

  const handleInputChange = (index, event) => {
    const newDepartment = [...department];
    newDepartment[index].equip_name = event.target.value;
    setDepartment(newDepartment);
  };

  const updateDepartment= async (index, department) => {
    setIsUpdating(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { departmentName: department.equip_name, departmentId: department.equip_id };

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "updateDepartment");

      const res = await axios.post(url, formData);
      if (res.data !== 1) {
        getAlert("danger", "Failed to update department name");
      }
    } catch (error) {
      getAlert("There was an error occurred: " + error);
    } finally {
      setEditMode((prevEditMode) => ({
        ...prevEditMode,
        [index]: false,
      }));
      setIsUpdating(false);
    }
  };

  const handleCancelUpdate = (index) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [index]: false,
    }));
  };

  return (
    <>
      {isLoading ? (
        <Container className="text-center">
          <Spinner variant="success" animation="border" />
        </Container>
      ) : (
        <Container>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          {department.map((departments, index) => (
            <Card key={index} className="mb-2">
              <Row className="p-3 d-flex align-items-center justify-content-around">
                <Col className="ms-2">
                  {editMode[index] ? (
                    <FormControl
                      type="text"
                      value={departments.dept_name}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  ) : (
                    <h4>{departments.dept_name}</h4>
                  )}
                </Col>
                <Col className="text-end me-5">
                  {editMode[index] ? (
                    <>
                      <Button
                        variant="success"
                        onClick={() => updateDepartment(index, departments)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => handleCancelUpdate(index)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleUpdateName(index)} disabled={isUpdating}>
                      {isUpdating && <Spinner animation="border" size="sm" />}
                      Update name
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          ))}
        </Container>
      )}
    </>
  );
}
