import React, { useState } from 'react'
import { Button, Container, FloatingLabel, Form, Modal } from 'react-bootstrap'

function AdminAddClient({ show, onHide }) {
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [deptId, setDeptId] = useState("");
  const [department, setDepartment] = useState([
    { "dept_name": "CITE", "dept_id": "1" },
    { "dept_name": "Department01", "dept_id": "2" },
    { "dept_name": "Department02", "dept_id": "3" },
    { "dept_name": "Department03", "dept_id": "4" },
  ]);
  const handleHide = () => {
    onHide();
  }

  return (
    <div>
      <Modal show={show} onHide={handleHide}>
        <Form>
          <Modal.Header>
            <Modal.Title>
              Add Client
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              <FloatingLabel className='mb-3' label="Id">
                <Form.Control
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder='Id'
                />
              </FloatingLabel>

              <FloatingLabel className='mb-3' label="Full name">
                <Form.Control
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='Full name'
                />
              </FloatingLabel>

              <FloatingLabel className='mb-3' label="Password">
                <Form.Control
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Full name'
                />
              </FloatingLabel>

              <FloatingLabel className='mb-3' label="Select department">
                <Form.Select
                  type="text"
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  placeholder='Full name'
                >
                  <option>Open this select menu</option>
                  {department.map((departments, index) => (
                    <option key={index} value={departments.dept_id}>{departments.dept_name}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>

            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='outline-secondary'>Close</Button>
            <Button variant='outline-success'>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminAddClient