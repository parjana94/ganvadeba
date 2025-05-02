import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditCustomer({ customerId, close }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    items: "",
    total: "",
    weekly: "",
    startDate: "",
    sellerName: "",
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      const docRef = doc(db, "customers", customerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setForm(docSnap.data());
      } else {
        alert("მომხმარებელი არ მოიძებნა");
        close();
      }
    };
    fetchCustomerData();
  }, [customerId, close]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "customers", customerId);
    await updateDoc(docRef, form);
    alert("მომხმარებელი წარმატებით განახლდა!");
    close();
  };

  return (
    <div style={{ backgroundColor: "white", padding: "20px", border: "1px solid #ccc", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000 }}>
      <h2>რედაქტირება</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="სახელი" value={form.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="გვარი" value={form.lastName} onChange={handleChange} />
        <input name="idNumber" placeholder="პირადი ნომერი" value={form.idNumber} onChange={handleChange} />
        <input name="items" placeholder="ნივთები" value={form.items} onChange={handleChange} />
        <input name="total" placeholder="სულ თანხა" type="number" value={form.total} onChange={handleChange} />
        <input name="weekly" placeholder="კვირაში გადასახდელი" type="number" value={form.weekly} onChange={handleChange} />
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <input name="sellerName" placeholder="გამყიდველი" value={form.sellerName} onChange={handleChange} />
        <button type="submit">განახლება</button>
        <button type="button" onClick={close}>დახურვა</button>
      </form>
    </div>
  );
}
