import React, { useState, useEffect } from 'react';
import Account from '../Pages/Account.jsx';
import LogIn from '../Pages/LogIn.jsx';
import Post from '../Pages/Post.jsx';
import Register from '../Pages/Register.jsx';
import { Link } from 'react-router-dom';
import NavBar from "../Componants/NavBar";
import { supabase } from '../supaBaseClient.jsx';

export default function Events() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('Event')
        .select('*');
      
      if (error) throw error;
      
      setEventData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
			<NavBar />
      <h2>Events</h2>
      {eventData.map((item) => (
        <div key={item.id}>
          <p>{JSON.stringify(item)}</p>
        </div>
      ))}
    </div>
  );
}
