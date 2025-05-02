// src/components/CustomerList.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchCustomers = async () => {
    const q = query(collection(db, "customers"), orderBy("endDate"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleStatus = async (customer) => {
    const newStatus = customer.status === "white" ? "red" : "white";
    const docRef = doc(db, "customers", customer.id);
    await updateDoc(docRef, { status: newStatus });
    fetchCustomers(); // ხელახლა ამოიღე განახლებული სიით
  };

  const filtered = customers.filter(c =>
    c.firstName.toLowerCase().includes(filter.toLowerCase()) ||
    c.lastName.toLowerCase().includes(filter.toLowerCase()) ||
    c.idNumber.includes(filter)
  );

  return (
    <div>
      <input
        placeholder="ძებნა: სახელი, გვარი ან პირადი ნომერი"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />

      {filtered.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: c.status === "red" ? "#ffd6d6" : "#ffffff"
          }}
        >
          <p><strong>{c.firstName} {c.lastName}</strong></p>
          <p>პირადი ნომერი: {c.idNumber}</p>
          <p>ნივთები: {c.items}</p>
          <p>სულ: {c.total} ₾ | კვირაში: {c.weekly} ₾</p>
          <p>დაწყების თარიღი: {c.startDate}</p>
          <p>დასრულების თარიღი: {c.endDate}</p>
          <p>გამყიდველი: <strong>{c.sellerName}</strong></p> {/* დამატებული ველი */}
          <p>სტატუსი: <strong style={{ color: c.status === "red" ? "red" : "gray" }}>{c.status}</strong></p>
          <button onClick={() => toggleStatus(c)}>სტატუსის შეცვლა</button>
        </div>
      ))}
    </div>
  );
}
