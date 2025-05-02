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
import EditCustomer from "./EditCustomer";  // ახალ კომპონენტზე გადამისამართება

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editCustomerId, setEditCustomerId] = useState(null); // მონიშნული მომხმარებელი რედაქტირებისათვის

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
    fetchCustomers();
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
          <p>გამყიდველი: <strong>{c.sellerName}</strong></p>
          <p>სტატუსი: <strong style={{ color: c.status === "red" ? "red" : "gray" }}>{c.status}</strong></p>

          {c.imageUrl && (
            <img
              src={c.imageUrl}
              alt="პროდუქტის სურათი"
              style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }}
              onClick={() => setSelectedImage(c.imageUrl)}
            />
          )}

          <button onClick={() => toggleStatus(c)}>სტატუსის შეცვლა</button>
          <button onClick={() => setEditCustomerId(c.id)}>რედაქტირება</button> {/* რედაქტირების ღილაკი */}
        </div>
      ))}

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
        >
          <img src={selectedImage} alt="გადიდებული სურათი" style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </div>
      )}

      {editCustomerId && (
        <EditCustomer customerId={editCustomerId} onClose={() => setEditCustomerId(null)} /> /* რედაქტირების ფორმის ჩართვა */
      )}
    </div>
  );
}
