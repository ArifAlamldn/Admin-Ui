import React, { useState, useEffect } from "react";
import "./App.css"
const AdminUI = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const rowsPerPage = 10;

  // Fetch users
  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Search filter
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const currentPageData = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Select/deselect rows
  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentPageData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentPageData.map((user) => user.id));
    }
  };

  // Delete actions
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleDeleteSelected = () => {
    setUsers(users.filter((user) => !selectedRows.includes(user.id)));
    setSelectedRows([]);
  };

  // Edit actions
  const handleEdit = (id) => {
    setEditingRow(id);
    const userToEdit = users.find((user) => user.id === id);
    setEditedData({ ...userToEdit });
  };

  const handleSave = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, ...editedData } : user
      )
    );
    setEditingRow(null);
  };

  // Handle input changes in edit mode
  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <div className="admin-ui">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={
                  currentPageData.length > 0 &&
                  selectedRows.length === currentPageData.length
                }
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((user) => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => toggleSelectRow(user.id)}
                />
              </td>
              <td>
                {editingRow === user.id ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingRow === user.id ? (
                  <input
                    type="text"
                    value={editedData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingRow === user.id ? (
                  <input
                    type="text"
                    value={editedData.role}
                    onChange={(e) =>
                      handleInputChange("role", e.target.value)
                    }
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingRow === user.id ? (
                  <button
                    className="save"
                    onClick={() => handleSave(user.id)}
                  >
                    💾
                  </button>
                ) : (
                  <button
                    className="edit"
                    onClick={() => handleEdit(user.id)}
                  >
                    ✏️
                  </button>
                )}
                <button
                  className="delete"
                  onClick={() => handleDelete(user.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="first-page"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="previous-page"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={
              currentPage === i + 1 ? "active-page" : "page-number"
            }
          >
            {i + 1}
          </button>
        ))}
        <button
          className="next-page"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="last-page"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
      <button
        className="delete-selected"
        onClick={handleDeleteSelected}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default AdminUI;
