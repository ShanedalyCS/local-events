import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supaBaseClient.jsx";
import EventCard from "../Componants/EventCard.jsx";

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);

      const [{ data: profileData, error: profileError }, { data: eventsData, error: eventsError }] =
        await Promise.all([
          supabase.from("testtable").select("id, username").eq("id", userId).single(),
          supabase.from("Event").select("*").eq("user_id", userId).order("date_start", { ascending: true }),
        ]);

      if (profileError) throw profileError;
      if (eventsError) throw eventsError;

      const rsvpCounts = await fetchRsvpCounts(eventsData ?? []);
      const enriched = (eventsData ?? []).map((evt) => ({
        ...evt,
        rsvpCount: Math.max(1, rsvpCounts[evt.id] || 0),
        posterName: profileData?.username || "Unknown poster",
        posterId: profileData?.id,
      }));

      setProfile(profileData);
      setEvents(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRsvpCounts(events) {
    const ids = events.map((e) => e.id);
    if (!ids.length) return {};
    const { data, error } = await supabase.from("Rsvp").select("event_id").in("event_id", ids);
    if (error) {
      console.error("RSVP count error", error);
      return {};
    }
    const counts = {};
    (data || []).forEach((row) => {
      counts[row.event_id] = (counts[row.event_id] || 0) + 1;
    });
    return counts;
  }

  if (loading) return <div className="page-content"><p>Loading profile...</p></div>;
  if (error) return <div className="page-content"><p>Error: {error}</p></div>;
  if (!profile) return <div className="page-content"><p>Profile not found.</p></div>;

  return (
    <div className="page-content">
      <div className="account-card">
        <h2>{profile.username}</h2>
        <p className="muted">User ID: {profile.id}</p>
        <Link className="account-link" to="/events">Back to events</Link>
      </div>

      <div className="event-list">
        {events.map((evt) => (
          <EventCard
            key={evt.id}
            id={evt.id}
            title={evt.title}
            description={evt.description}
            dateStart={evt.date_start}
            dateEnd={evt.date_end}
            location={evt.location}
            rsvpCount={evt.rsvpCount}
            posterName={evt.posterName}
            posterId={evt.posterId}
          />
        ))}
        {events.length === 0 && <p>No events posted by this user.</p>}
      </div>
    </div>
  );
}
