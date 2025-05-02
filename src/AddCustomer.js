import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { format, addDays } from "date-fns";
import axios from "axios";

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
    sellerName: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = "d57a79af64f579acd885acb1e891d259"; // ჩასვი შენი ImgBB API Key აქ
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
      console.error("სურათის ატვირთვის შეცდომა:", error.response?.data || error.message);
      throw new Error("სურათის ატვირთვა ვერ მოხერხდა.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // რეფრეშება შეცდომის დროს

    try {
      // პირადობის ნომრის შემოწმება
      const q = query(collection(db, "customers"), where("idNumber", "==", form.idNumber));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("მომხმარებელი უკვე არსებობს ამ პირადობის ნომრით.");
        return;
      }

      setUploading(true);

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const weeks = Math.ceil(form.total / form.weekly);
      const endDate = format(addDays(new Date(form.startDate), weeks * 7), "yyyy-MM-dd");

      await addDoc(collection(db, "customers"), {
        ...form,
        total: Number(form.total),
        weekly: Number(form.weekly),
        endDate,
        imageUrl,
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
        sellerName: "",
      });
      setImageFile(null);
      alert("დამატდა წარმატებით!");
    } catch (err) {
      alert(err.message || "დაფიქსირდა შეცდომა");
    } finally {
      setUploading(false);
    }
  };

  return (
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
      <button type="submit" disabled={uploading}>
        {uploading ? "იტვირთება..." : "დამატება"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
