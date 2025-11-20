import { useEffect, useState } from "react";
import EventCard from "../Componants/EventCard.jsx";
import { supabase } from "../supaBaseClient.jsx";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("Event")
        .select("*")
        .order("date_start", { ascending: true })
        .limit(6);

      if (fetchError) throw fetchError;

      const rsvpCounts = await fetchRsvpCounts(data ?? []);
      const profiles = await fetchProfiles(data ?? []);
      const enriched = (data ?? []).map((evt) => ({
        ...evt,
        rsvpCount: Math.max(1, rsvpCounts[evt.id] || 0),
        posterName: profiles[evt.user_id]?.username || "Unknown poster",
      }));

      setEvents(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRsvpCounts(eventRows) {
    const ids = eventRows.map((e) => e.id);
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

  async function fetchProfiles(eventRows) {
    const ids = Array.from(new Set(eventRows.map((e) => e.user_id).filter(Boolean)));
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
    <div className="home-container">
      <h1>Upcoming Events</h1>

      {loading && <p>Loading events...</p>}
      {error && <p>Error loading events: {error}</p>}
      {!loading && !error && events.length === 0 && <p>No events yet. Be the first to post!</p>}

      <div className="event-list">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            dateStart={event.date_start}
            dateEnd={event.date_end}
            location={event.location}
            rsvpCount={event.rsvpCount}
            posterName={event.posterName}
            posterId={event.user_id}
          />
        ))}
      </div>
    </div>
  );
}
