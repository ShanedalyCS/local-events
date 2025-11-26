import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supaBaseClient.jsx";
import defaultImage from "../assets/group1.png";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [rsvpCount, setRsvpCount] = useState(1);
  const [actionMessage, setActionMessage] = useState("");
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    fetchEvent();
    loadUser();
  }, [id]);

  async function fetchEvent() {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from("Event").select("*").eq("id", id).single();
    if (fetchError) {
      setError(fetchError.message);
      setEvent(null);
    } else {
      setEvent(data);
      if (data?.user_id) {
        const { data: profile, error: profileError } = await supabase
          .from("testtable")
          .select("id, username")
          .eq("id", data.user_id)
          .single();
        if (!profileError) setPoster(profile);
      }
    }
    await fetchRsvpCount();
    setLoading(false);
  }

  async function fetchRsvpCount() {
    const { data, error: rsvpError } = await supabase.from("Rsvp").select("event_id").eq("event_id", id);
    if (rsvpError) {
      console.error("RSVP fetch error", rsvpError);
      setRsvpCount(1);
      return;
    }
    setRsvpCount(Math.max(1, (data || []).length));
  }

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user || null);
  }

  async function handleRsvp() {
    if (!user) {
      setActionMessage("Please log in to RSVP.");
      return;
    }
    setActionMessage("Saving your RSVP...");
    const eventId = Number(id);
    const { error: insertError } = await supabase
      .from("Rsvp")
      .insert({ event_id: eventId, user_id: user.id });

    if (insertError) {
      console.error("RSVP insert error", insertError);
      setActionMessage(`RSVP failed: ${insertError.message}`);
      return;
    }

    setActionMessage("You're going! See you there.");
    fetchRsvpCount();
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  }

  if (loading) return <div className="page-shell"><p className="muted">Loading event...</p></div>;
  if (error) return <div className="page-shell"><p className="muted">Error: {error}</p></div>;
  if (!event) return <div className="page-shell"><p className="muted">Event not found.</p></div>;

  const dateRange = [formatDate(event.date_start), formatDate(event.date_end)].filter(Boolean).join(" - ");
  const contactHref = `mailto:?subject=${encodeURIComponent(event.title || "Event")}`;

  return (
    <div className="page-shell">
      <div className="page-hero event-detail-hero">
        <div className="page-hero__row">
          <p className="eyebrow">Event</p>
          <Link to="/events" className="ghost-btn small">Back to events</Link>
        </div>
        <h1>{event.title}</h1>
        {dateRange && <p className="muted">{dateRange}</p>}
        <p className="muted">
          {rsvpCount} going
          {poster && (
            <>
              {" • "}Posted by{" "}
              <Link to={`/profile/${poster.id}`} className="account-link">
                {poster.username}
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="event-detail-card">
        <div
          className="event-detail-image"
          style={{ backgroundImage: `url(${event.image_url || defaultImage})` }}
        />
        <div className="event-detail-body">
          {event.description && <p className="event-detail__description">{event.description}</p>}

          <div className="event-detail__actions">
            <a className="primary-btn" href={contactHref}>
              Get in contact
            </a>
            <button className="primary-btn secondary" onClick={handleRsvp}>
              RSVP
            </button>
          </div>
          {actionMessage && <p className="muted">{actionMessage}</p>}
        </div>
      </div>
    </div>
  );
}
