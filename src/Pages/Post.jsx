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
  const [preview, setPreview] = React.useState(null);

  const imageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please choose a valid image file");
      setImage(null);
      setPreview(null);
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
      setPreview(null);
    }

    setLoading(false);
  };

  return (
    <div className="post-page">
      <div className="post-hero">
        <p className="eyebrow">Create</p>
        <h2>Share your next event</h2>
        <p className="muted">
          Add the essentials, upload a hero image, and your event will appear in the feed instantly.
        </p>
      </div>

      <div className="post-shell">
        <form className="post-form" onSubmit={addEvent}>
          <div className="post-field">
            <label>Event title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Community meetup at the park"
              required
            />
          </div>

          <div className="post-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should people expect?"
              rows={5}
              required
            />
          </div>

          <div className="post-row">
            <div className="post-field">
              <label>Start date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Select start date"
                dateFormat="yyyy-MM-dd"
                className="date-input"
              />
            </div>
            <div className="post-field">
              <label>End date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Select end date"
                dateFormat="yyyy-MM-dd"
                minDate={startDate || undefined}
                className="date-input"
              />
            </div>
          </div>

          <div className="post-field">
            <label>Display image</label>
            <div className="upload-tile">
              <div className="upload-copy">
                <p className="upload-title">Drop or browse</p>
                <p className="muted">JPG, PNG — keep it under 5MB.</p>
              </div>
              <input type="file" accept="image/*" onChange={imageChange} />
            </div>
            {preview && <img className="upload-preview" src={preview} alt="Event preview" />}
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Publish event"}
          </button>
          {message && <p className="muted status-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
