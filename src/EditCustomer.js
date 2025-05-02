import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { format, addDays } from "date-fns";
import axios from "axios";

export default function EditCustomer({ customerId, onClose }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    items: "",
    total: "",
    weekly: "",
    startDate: "",
    status: "white",
    sellerName: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const docRef = doc(db, "customers", customerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      } else {
        console.error("Document not found");
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = "d57a79af64f579acd885acb1e891d259"; // Insert your API key here
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Image upload error:", error.response?.data || error.message);
      throw new Error("Image upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const weeks = Math.ceil(form.total / form.weekly);
      const endDate = format(addDays(new Date(form.startDate), weeks * 7), "yyyy-MM-dd");

      const docRef = doc(db, "customers", customerId);
      await updateDoc(docRef, {
        ...form,
        total: Number(form.total),
        weekly: Number(form.weekly),
        endDate,
        imageUrl,
      });

      alert("მომხმარებელი წარმატებით განახლდა!");
      onClose(); // Close the edit form after submission
    } catch (err) {
      alert(err.message || "დაფიქსირდა შეცდომა");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", backgroundColor: "#f9f9f9", marginTop: "20px" }}>
      <h3>მომხმარებლის რედაქტირება</h3>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="სახელი" value={form.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="გვარი" value={form.lastName} onChange={handleChange} />
        <input name="idNumber" placeholder="პირადი ნომერი" value={form.idNumber} onChange={handleChange} />
        <input name="items" placeholder="ნივთები" value={form.items} onChange={handleChange} />
        <input name="total" placeholder="სულ თანხა" type="number" value={form.total} onChange={handleChange} />
        <input name="weekly" placeholder="კვირაში გადასახდელი" type="number" value={form.weekly} onChange={handleChange} />
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <input name="sellerName" placeholder="გამყიდველი" value={form.sellerName} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">განახლება</button>
      </form>
      <button onClick={onClose}>დახურვა</button>
    </div>
  );
}
