import React, { useState, useEffect } from "react";
import EventCard from "../Componants/EventCard.jsx";
import { supabase } from "../supaBaseClient.jsx";

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
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("Event")
        .select("*")
        .order("date_start", { ascending: true });

      if (fetchError) throw fetchError;

      const rsvpCounts = await fetchRsvpCounts(data ?? []);
      const profiles = await fetchProfiles(data ?? []);
      const enriched = (data ?? []).map((evt) => ({
        ...evt,
        rsvpCount: Math.max(1, rsvpCounts[evt.id] || 0),
        posterName: profiles[evt.user_id]?.username || "Unknown poster",
      }));

      setEventData(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRsvpCounts(events) {
    const ids = events.map((e) => e.id);
    if (!ids.length) return {};
    const { data, error: rsvpError } = await supabase.from("Rsvp").select("event_id").in("event_id", ids);
    if (rsvpError) {
      console.error("RSVP count error", rsvpError);
      return {};
    }
    const counts = {};
    (data || []).forEach((row) => {
      counts[row.event_id] = (counts[row.event_id] || 0) + 1;
    });
    return counts;
  }

  async function fetchProfiles(events) {
    const ids = Array.from(new Set(events.map((e) => e.user_id).filter(Boolean)));
    if (!ids.length) return {};
    const { data, error } = await supabase.from("testtable").select("id, username").in("id", ids);
    if (error) {
      console.error("Profile fetch error", error);
      return {};
    }
    const map = {};
    (data || []).forEach((profile) => {
      map[profile.id] = profile;
    });
    return map;
  }

  return (
    <div>
      <div className="events-header">
        <h2>All Events</h2>
        <button className="refresh-btn" onClick={fetchEvents} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && eventData.length === 0 && <p>No events found.</p>}

      <div className="event-list">
        {eventData.map((item) => (
          <EventCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            dateStart={item.date_start}
            dateEnd={item.date_end}
            location={item.location}
            rsvpCount={item.rsvpCount}
            posterName={item.posterName}
            posterId={item.user_id}
            image={item.image_url} 
          />
        ))}
      </div>
    </div>
  );
}
