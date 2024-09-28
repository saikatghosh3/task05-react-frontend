import { useRef, useCallback } from "react";
import { Table as BootstrapTable } from "react-bootstrap";
import { useDebouncedCallback } from "use-debounce";

const Table = ({ users, onLoadMore }) => {
  const observer = useRef();

  const loadMore = useDebouncedCallback(() => {
    onLoadMore();
  }, 0);

  const lastUserElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadMore]
  );

  return (
    <div
      className="table-container"
      style={{ maxHeight: "min(420px, 80vh)", overflowY: "auto" }}
    >
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
              key={user.id}
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
  );
};

export default Table;
