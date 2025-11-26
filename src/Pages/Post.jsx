import React from "react";
import { supabase } from "../supaBaseClient.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Post() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [image, setImage] = React.useState(null);

    const imageChange = (e) => {
      const file = e.target.files[0];
      if(file && file.type.startsWith("image/")){
        setImage(file);
      }  else {
        alert ("Please choose a valid image file");
        setImage(null);
      }
     };


  const addEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) {
      setLoading(false);
      setMessage("Please log in before posting an event.");
      return;
    }

    if (!startDate || !endDate) {
      setLoading(false);
      setMessage("Please pick both a start and end date.");
      return;
    }



     let imageUrl = null;

     if(image){
      const fileName = `${Date.now()}_${image.name}`;
      const {data, error} = await supabase.storage
      .from("images")
      .upload(fileName, image);

      if(error){
        console.error("Image upload error: ", error);
        setMessage("Failed to upload image.");
        setLoading(false);
        return;
      }
      const {data: {publicUrl}} = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = publicUrl;
      console.log("Image URL: ", imageUrl);
     }

    const toDateString = (date) => date.toISOString().slice(0, 10); // yyyy-mm-dd for Supabase date columns

    const payload = {
      image_url: imageUrl, 
      date_start: toDateString(startDate),
      date_end: toDateString(endDate),
      title,
      description,
      user_id: user.id,
    };

    const { data: eventData, error: eventError } = await supabase
      .from("Event")
      .insert(payload)
      .select()
      .single();

    if (eventError) {
      console.error("Error adding event: ", eventError);
      setMessage(`Failed to add event: ${eventError.message}`);
    } else {
      console.log("Event added: ", eventData);
      setMessage("Event added!");
      setTitle("");
      setDescription("");
      setStartDate(null);
      setEndDate(null);
      setImage(null);
    }

    setLoading(false);
  };

  return (
    <div className="event-add">
      <h2>Create a new event</h2>
      <form onSubmit={addEvent}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description"
          required
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Select Start Date"
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Select End Date"
          dateFormat="yyyy-MM-dd"
          minDate={startDate || undefined}
        />
        <input type="file" accept="image/*" onChange={imageChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
