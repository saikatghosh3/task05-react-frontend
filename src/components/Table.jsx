import { useRef, useCallback } from "react";
import { Table as BootstrapTable, Spinner } from "react-bootstrap";
import { useDebouncedCallback } from "use-debounce";

const Table = ({ users, onLoadMore, isLoading: loading }) => {
  const observer = useRef();

  const loadMore = useDebouncedCallback(() => {
    onLoadMore();
  }, 0);

  const lastUserElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) { // Trigger loadMore only if not loading
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadMore, loading]
  );

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <BootstrapTable striped bordered hover responsive>
          <thead>
            <tr>
              <th>Index</th>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                ref={users.length === index + 1 ? lastUserElementRef : null}
              >
                <td>{index + 1}</td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </BootstrapTable>
      </div>
      {/* Overlay spinner when loading */}
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  );
};

export default Table;