import { Form, Row, Col, InputGroup, Button, Dropdown } from "react-bootstrap";
import { FaRandom } from "react-icons/fa";
import { saveAs } from "file-saver"; // Use file-saver for downloading files
import { jsonToCSV } from "react-papaparse"; // Convert JSON to CSV

const Controls = ({
  region,
  regions = [],
  onRegionChange,
  errors,
  onErrorsChange,
  seed,
  onSeedChange,
  users, // New prop: List of users to export
}) => {
  const isEmptyUsers = Array.isArray(users) && users.length === 0;
  console.log({ isEmptyUsers });
  const handleExport = (format) => {
    if (isEmptyUsers) {
      return;
    }
    if (format === "csv") {
      const csv = jsonToCSV(users);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `users_export_${Date.now()}.csv`);
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(users, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      saveAs(blob, `users_export_${Date.now()}.json`);
    }
  };

  return (
    <Form>
      <Row>
        <Col md={3}>
          <Form.Group controlId="regionSelect">
            <Form.Label>Region</Form.Label>
            <Form.Select
              aria-label="select regions"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
            >
              <option value=""> -- select region --</option>
              {regions.map((item, index) => (
                <option key={item + index} value={item}>
                  {" "}
                  {item}{" "}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="errorsSlider">
            <Form.Label>Errors per Record</Form.Label>
            <InputGroup>
              <Form.Control
                type="range"
                min="0"
                max="10"
                value={errors}
                onChange={(e) => onErrorsChange(e.target.value)}
              />
              <Form.Control
                type="number"
                min="0"
                max="1000"
                value={errors}
                onChange={(e) => onErrorsChange(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="seedInput">
            <Form.Label>Seed</Form.Label>
            <InputGroup>
              <Form.Control type="number" value={seed} readOnly />
              <Button variant="primary" onClick={onSeedChange}>
                <FaRandom />
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={3} className=" ms-md-auto">
          <Form.Label>Export Users</Form.Label>
          <Dropdown>
            <Dropdown.Toggle
              variant="primary"
              id="dropdown-basic"
              disabled={isEmptyUsers}
            >
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleExport("csv")}>
                Export as CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport("json")}>
                Export as JSON
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Form>
  );
};

export default Controls;
