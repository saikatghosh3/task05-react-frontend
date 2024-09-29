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

import { useDebouncedCallback } from "use-debounce";
const App = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(42);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useDebouncedCallback(async()=> {
    if (region && seed) {
      try {
        setIsLoading(true);
        const users = await fetchUsers(region, errors, seed, page);
        setUsers((prevUsers) => {
        const newUsers = users.map((user, index)=> {
        return ({...user, index: index + prevUsers.length + 1});
        });
        return [...prevUsers, ...newUsers];
        });
      }finally {
        setIsLoading(false);
      }
    }
  }, 420);

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
    loadData();
  }, [region, errors, seed, page, loadData]);

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

  const handleInputSeedChange = (e)=> {
    console.log(e);
    setUsers([]); // Reset data on seed change
    setPage(1); // Reset pagination
    setSeed(e.target.value);
  }
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
      <h1 className="text-center my-4">Random User Data Generator</h1>
      <Row className="mb-4">
        <Col>
          <Controls
            onInputSeedChange={handleInputSeedChange}
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
          <Table isLoading={isLoading} users={users} onLoadMore={loadMoreUsers} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;