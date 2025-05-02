// src/App.js
import React from "react";
import AddCustomer from "./AddCustomer";
import CustomerList from "./CustomerList";

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>განვადების მართვა</h1>
      <AddCustomer />
      <hr />
      <CustomerList />
    </div>
  );
}

export default App;
