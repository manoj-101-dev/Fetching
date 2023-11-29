import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]); // State for storing users
  const [editedUserId, setEditedUserId] = useState(null); // State for edited user ID
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "" }); // State for new user details

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Fetches users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handles user edit
  const handleEdit = (userId) => {
    setEditedUserId(userId);
    const selectedUser = users.find((user) => user.id === userId);
    setNewUser(selectedUser); // Sets the details of the selected user to be edited
  };

  // Handles saving edited user data
  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${editedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUsers = users.map((user) =>
        user.id === editedUserId ? newUser : user
      );
      setUsers(updatedUsers); // Updates the user list with the edited user
      setEditedUserId(null);
      setNewUser({ name: "", email: "", phone: "" }); // Resets the form fields
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handles user deletion
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers); // Updates the user list after deleting the user
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handles input change in the form
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handles addition of a new user
  const handleAddUser = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      const data = await response.json();
      setUsers([...users, data]); // Adds the new user to the user list
      setNewUser({ name: "", email: "", phone: "" }); // Resets the form fields
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="App">
      <h1>User List</h1>

      {/* Centered Add User section */}
      <div className="add-user-container">
        <div className="add-user-form">
          <h2>{editedUserId ? "Edit User" : "Add New User"}</h2>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
          <input
            type="text"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
          <input
            type="text"
            name="phone"
            value={newUser.phone}
            onChange={handleInputChange}
            placeholder="Enter phone"
          />
          {editedUserId ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditedUserId(null)}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAddUser}>Add User</button>
          )}
        </div>
      </div>

      {/* Displaying user cards */}
      <div className="user-cards">
        {users.map((user) => (
          <div className="card" key={user.id}>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <button onClick={() => handleEdit(user.id)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
