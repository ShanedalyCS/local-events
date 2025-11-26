import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supaBaseClient.jsx";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    date_start: "",
    date_end: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchActiveEvents();
      fetchRsvpEvents();
    }
  }, [user]);

  async function loadUser() {
    setLoading(true);
    setError(null);

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      setUser(null);
    } else {
      setUser(data?.user || null);
    }

    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  }

  async function fetchActiveEvents() {
    setEventsLoading(true);
    setActionMessage("");
    const today = new Date().toISOString().slice(0, 10);

    const { data, error: eventsError } = await supabase
      .from("Event")
      .select("*")
      .gte("date_end", today)
      .order("date_start", { ascending: true });

    if (eventsError) {
      setActionMessage(eventsError.message);
      setEvents([]);
    } else {
      setEvents(data ?? []);
    }

    setEventsLoading(false);
  }

  async function fetchRsvpEvents() {
    setRsvpLoading(true);
    setRsvpMessage("");

    const { data, error: rsvpError } = await supabase
      .from("Rsvp")
      .select("event_id")
      .eq("user_id", user.id);

    if (rsvpError) {
      setRsvpMessage(rsvpError.message);
      setRsvpEvents([]);
      setRsvpLoading(false);
      return;
    }

    const ids = Array.from(new Set((data || []).map((row) => row.event_id).filter(Boolean)));
    if (!ids.length) {
      setRsvpEvents([]);
      setRsvpLoading(false);
      return;
    }

    const { data: eventsData, error: eventsError } = await supabase.from("Event").select("*").in("id", ids);

    if (eventsError) {
      setRsvpMessage(eventsError.message);
      setRsvpEvents([]);
    } else {
      setRsvpEvents(eventsData || []);
    }

    setRsvpLoading(false);
  }

  function startEdit(event) {
    setEditingId(event.id);
    setEditForm({
      title: event.title || "",
      description: event.description || "",
      date_start: event.date_start || "",
      date_end: event.date_end || "",
    });
    setActionMessage("");
  }

  async function saveEdit() {
    if (!editingId) return;
    setActionMessage("Saving changes...");

    const payload = {
      title: editForm.title,
      description: editForm.description,
      date_start: editForm.date_start,
      date_end: editForm.date_end,
    };

    const { error: updateError } = await supabase
      .from("Event")
      .update(payload)
      .eq("id", editingId);

    if (updateError) {
      setActionMessage(`Update failed: ${updateError.message}`);
      return;
    }

    setActionMessage("Event updated.");
    setEditingId(null);
    fetchActiveEvents();
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  }

  async function deleteEvent(id) {
    setActionMessage("Deleting event...");
    const { error: deleteError } = await supabase.from("Event").delete().eq("id", id);

    if (deleteError) {
      setActionMessage(`Delete failed: ${deleteError.message}`);
      return;
    }

    setActionMessage("Event deleted.");
    if (editingId === id) setEditingId(null);
    fetchActiveEvents();
  }

  if (loading) {
    return <div>Loading account...</div>;
  }

  if (!user) {
    return (
      <div className="account-card">
        <h2>You're not logged in</h2>
        {error && <p>Error: {error}</p>}
        <p>
          <Link to="/login">Log in</Link> or <Link to="/register">create an account</Link> to post and manage
          events.
        </p>
      </div>
    );
  }

  return (
    <div className="account-card">
      <h2>Your Account</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p>
        <strong>Created:</strong>{" "}
        {user.created_at
          ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(user.created_at))
          : "Unknown"}
      </p>

      <div className="account-actions">
        <Link className="account-link" to="/post">
          Post a new event
        </Link>
        <button onClick={signOut} disabled={loading} className="account-button">
          Sign out
        </button>
      </div>

      <div className="manage-events">
        <div className="manage-header">
          <h3>Your active events</h3>
          <button className="account-button" onClick={fetchActiveEvents} disabled={eventsLoading}>
            {eventsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {actionMessage && <p className="muted">{actionMessage}</p>}
        {eventsLoading && <p>Loading events...</p>}
        {!eventsLoading && events.length === 0 && <p>No active events to manage.</p>}

        <div className="manage-list">
          {events.map((event) => {
            const isEditing = editingId === event.id;
            return (
              <div key={event.id} className="manage-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description"
                    />
                    <div className="date-row">
                      <label>
                        Start
                        <input
                          type="date"
                          value={editForm.date_start || ""}
                          onChange={(e) => setEditForm({ ...editForm, date_start: e.target.value })}
                        />
                      </label>
                      <label>
                        End
                        <input
                          type="date"
                          value={editForm.date_end || ""}
                          onChange={(e) => setEditForm({ ...editForm, date_end: e.target.value })}
                        />
                      </label>
                    </div>
                    <div className="manage-actions">
                      <button className="account-button" onClick={saveEdit}>
                        Save
                      </button>
                      <button className="account-button secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="manage-meta">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                      <p className="muted">
                        {event.date_start} → {event.date_end}
                      </p>
                    </div>
                    <div className="manage-actions">
                      <button className="account-button" onClick={() => startEdit(event)}>
                        Edit
                      </button>
                      <button className="account-button secondary" onClick={() => deleteEvent(event.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <p className="muted">
          Note: Events are filtered by upcoming end date. If you want per-user scoping, add a user reference column
          (e.g., user_id) to the Event table and filter on it.
        </p>
      </div>

      <div className="manage-events">
        <div className="manage-header">
          <h3>Your RSVPs</h3>
          <button className="account-button" onClick={fetchRsvpEvents} disabled={rsvpLoading}>
            {rsvpLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {rsvpMessage && <p className="muted">{rsvpMessage}</p>}
        {rsvpLoading && <p>Loading RSVPs...</p>}
        {!rsvpLoading && rsvpEvents.length === 0 && <p>No RSVPs yet. RSVP from an event page to see it here.</p>}

        <div className="manage-list">
          {rsvpEvents.map((evt) => (
            <div key={evt.id} className="manage-item">
              <div className="manage-meta">
                <h4>{evt.title}</h4>
                <p className="muted">
                  {formatDate(evt.date_start)} {evt.date_end ? `- ${formatDate(evt.date_end)}` : ""}
                </p>
                {evt.description && <p>{evt.description}</p>}
              </div>
              <div className="manage-actions">
                <Link className="account-button" to={`/events/${evt.id}`}>
                  View event
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
