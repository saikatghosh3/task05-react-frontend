import { useEffect, useState } from "react";
import Controls from "./components/Controls";
import Table from "./components/Table";
import {
  fetchUsers,
  fetchRandomSeed,
  fetchRegions,
} from "./services/apiService";
import { Container, Row, Col } from "react-bootstrap";
import "./App.scss";

const App = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadRegions = async () => {
      const response = await fetchRegions();
      if (response.regions) {
        setRegions((prev) => [...prev, ...response.regions]);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const loadSeed = async () => {
      const response = await fetchRandomSeed();
      setSeed(response.seed);
    };
    loadSeed();
  }, []);
  useEffect(() => {
    const loadData = async () => {
      if (region && seed) {
        const users = await fetchUsers(region, errors, seed, page);
        // console.log(response);
        setUsers((prev) => [...prev, ...users]);
      }
    };
    loadData();
  }, [region, errors, seed, page]);

  const handleRegionChange = (newRegion) => {
    setUsers([]); // Reset data on region change
    setPage(1); // Reset pagination
    setRegion(newRegion);
  };

  const handleErrorsChange = (newErrors) => {
    setUsers([]); // Reset data on errors change
    setPage(1); // Reset pagination
    setErrors(newErrors);
  };

  const handleSeedChange = async () => {
    const response = await fetchRandomSeed();
    setUsers([]); // Reset data on seed change
    setPage(1); // Reset pagination
    setSeed(response.seed);
  };

  const loadMoreUsers = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Container className="app">
      <h1 className="text-center my-4">Random User Generator</h1>
      <Row className="mb-4">
        <Col>
          <Controls
            regions={regions}
            region={region}
            onRegionChange={handleRegionChange}
            errors={errors}
            onErrorsChange={handleErrorsChange}
            seed={seed}
            onSeedChange={handleSeedChange}
            users={users}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table users={users} onLoadMore={loadMoreUsers} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
