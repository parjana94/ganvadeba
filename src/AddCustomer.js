// src/components/AddCustomer.js
import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { format, addDays } from "date-fns";

export default function AddCustomer() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    items: "",
    total: "",
    weekly: "",
    startDate: "",
    status: "white",
    sellerName: "" // დამატებული ველი
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const weeks = Math.ceil(form.total / form.weekly);
    const endDate = format(addDays(new Date(form.startDate), weeks * 7), "yyyy-MM-dd");

    await addDoc(collection(db, "customers"), {
      ...form,
      total: Number(form.total),
      weekly: Number(form.weekly),
      endDate,
    });

    setForm({
      firstName: "",
      lastName: "",
      idNumber: "",
      items: "",
      total: "",
      weekly: "",
      startDate: "",
      status: "white",
      sellerName: ""
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="სახელი" value={form.firstName} onChange={handleChange} />
      <input name="lastName" placeholder="გვარი" value={form.lastName} onChange={handleChange} />
      <input name="idNumber" placeholder="პირადი ნომერი" value={form.idNumber} onChange={handleChange} />
      <input name="items" placeholder="ნივთები" value={form.items} onChange={handleChange} />
      <input name="total" placeholder="საერთო ღირებულება" type="number" value={form.total} onChange={handleChange} />
      <input name="weekly" placeholder="კვირაში გადასახდელი" type="number" value={form.weekly} onChange={handleChange} />
      <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
      <input name="sellerName" placeholder="გამყიდველის სახელი" value={form.sellerName} onChange={handleChange} /> {/* დამატებული ველი */}
      <button type="submit">დამატება</button>
    </form>
  );
}
