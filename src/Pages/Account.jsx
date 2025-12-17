import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supaBaseClient.jsx";
import defaultImage from "../assets/group1.png";

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
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
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
      fetchProfile();
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

  async function fetchProfile() {
    setProfileLoading(true);
    setProfileMessage("");
    const { data, error: profileError } = await supabase
      .from("testtable")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setProfileMessage(profileError.message);
      setProfile(null);
      setUsernameInput("");
    } else {
      setProfile(data);
      setUsernameInput(data?.username || "");
    }
    setProfileLoading(false);
  }

  async function saveProfile() {
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setProfileMessage("Username cannot be empty.");
      return;
    }
    setProfileMessage("Saving profile...");

    const { data: existing, error: checkError } = await supabase
      .from("testtable")
      .select("id")
      .eq("username", trimmed)
      .neq("id", user.id);

    if (checkError) {
      setProfileMessage(checkError.message);
      return;
    }
    if (existing && existing.length > 0) {
      setProfileMessage("That username is already taken.");
      return;
    }

    const { data, error: upsertError } = await supabase
      .from("testtable")
      .upsert({ id: user.id, username: trimmed })
      .select()
      .single();

    if (upsertError) {
      setProfileMessage(upsertError.message);
      return;
    }

    setProfile(data);
    setProfileMessage("Profile updated.");
  }

  async function updatePassword() {
    if (!currentPasswordInput) {
      setPasswordMessage("Enter your current password.");
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage("Verifying current password...");

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPasswordInput,
    });

    if (verifyError) {
      setPasswordMessage("Current password is incorrect.");
      setPasswordLoading(false);
      return;
    }

    setPasswordMessage("Updating password...");
    const { error: updateError } = await supabase.auth.updateUser({ password: newPasswordInput });
    setPasswordLoading(false);

    if (updateError) {
      setPasswordMessage(updateError.message);
      return;
    }

    setPasswordMessage("Password updated.");
    setCurrentPasswordInput("");
    setNewPasswordInput("");
  }

  async function deleteAccount() {
    setProfileMessage("Deleting account...");
    // best effort cleanup of RSVPs, then profile
    await supabase.from("Rsvp").delete().eq("user_id", user.id);
    const { error: deleteProfileError } = await supabase.from("testtable").delete().eq("id", user.id);
    if (deleteProfileError) {
      setProfileMessage(`Delete failed: ${deleteProfileError.message}`);
      return;
    }
    setProfileMessage("Account deleted. Signing out...");
    await signOut();
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
    return <div className="page-shell"><p className="muted">Loading account...</p></div>;
  }

  if (!user) {
    return (
      <div className="page-shell">
        <div className="account-hero">
          <p className="eyebrow">Account</p>
          <h2>You're not logged in</h2>
          {error && <p className="muted">Error: {error}</p>}
          <p className="muted">
            <Link className="account-link" to="/login">Log in</Link> or{" "}
            <Link className="account-link" to="/register">create an account</Link> to post and manage events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell account-page">
      <div className="page-hero account-hero">
        <p className="eyebrow">Account</p>
        <h2>Welcome back</h2>
        <p className="muted">Manage your profile, hosted events, and RSVPs.</p>
        <div className="account-cta">
          <Link className="primary-btn" to="/post">Post a new event</Link>
          <button onClick={signOut} disabled={loading} className="primary-btn secondary">Sign out</button>
        </div>
        <div className="account-stats">
          <div className="stat-pill">
            <span className="stat-label">Email</span>
            <span className="stat-value">{user.email}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Joined</span>
            <span className="stat-value">
              {user.created_at
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(user.created_at))
                : "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="account-grid">
        <div className="account-card-shell">
          <div className="manage-header">
            <div>
              <p className="eyebrow">Profile</p>
              <h3>Update your info</h3>
            </div>
            {profile && <p className="muted">Current: {profile.username || "n/a"}</p>}
          </div>

          <div className="profile-form">
            <label>
              Username
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Choose a unique username"
                disabled={profileLoading}
              />
            </label>
            <label>
              Current password
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="Enter current password"
                disabled={profileLoading || passwordLoading}
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Update password"
                disabled={profileLoading || passwordLoading}
              />
            </label>
            <div className="profile-actions">
              <button className="primary-btn" onClick={saveProfile} disabled={profileLoading}>
                {profileLoading ? "Saving..." : "Save changes"}
              </button>
              <button className="primary-btn" onClick={updatePassword} disabled={profileLoading || passwordLoading}>
                {passwordLoading ? "Updating..." : "Update password"}
              </button>
              <button className="primary-btn secondary" onClick={deleteAccount} disabled={profileLoading}>
                Delete account
              </button>
            </div>
            {profileMessage && <p className="muted">{profileMessage}</p>}
            {passwordMessage && <p className="muted">{passwordMessage}</p>}
          </div>
        </div>

        <div className="account-card-shell">
          <div className="manage-header">
            <div>
              <p className="eyebrow">Hosted</p>
              <h3>Your active events</h3>
            </div>
            <button className="ghost-btn small" onClick={fetchActiveEvents} disabled={eventsLoading}>
              {eventsLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {actionMessage && <p className="muted">{actionMessage}</p>}
          {eventsLoading && <p className="muted">Loading events...</p>}
          {!eventsLoading && events.length === 0 && <p className="muted">No active events to manage.</p>}

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
                        <p className="muted">
                          {formatDate(event.date_start)} {event.date_end ? `- ${formatDate(event.date_end)}` : ""}
                        </p>
                        <p>{event.description}</p>
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
          <p className="muted small-note">
            Events are filtered by upcoming end date. To scope per user, add a user reference column (e.g., user_id)
            to the Event table and filter on it.
          </p>
        </div>

        <div className="account-card-shell">
          <div className="manage-header">
            <div>
              <p className="eyebrow">RSVPs</p>
              <h3>Your RSVPs</h3>
            </div>
            <button className="ghost-btn small" onClick={fetchRsvpEvents} disabled={rsvpLoading}>
              {rsvpLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {rsvpMessage && <p className="muted">{rsvpMessage}</p>}
          {rsvpLoading && <p className="muted">Loading RSVPs...</p>}
          {!rsvpLoading && rsvpEvents.length === 0 && <p className="muted">No RSVPs yet.</p>}

          <div className="rsvp-list">
            {rsvpEvents.map((evt) => (
              <Link key={evt.id} to={`/events/${evt.id}`} className="rsvp-card">
                <div
                  className="rsvp-thumb"
                  style={{ backgroundImage: `url(${evt.image_url || defaultImage})` }}
                />
                <div className="rsvp-copy">
                  <h4>{evt.title}</h4>
                  <p className="muted">
                    {formatDate(evt.date_start)} {evt.date_end ? `- ${formatDate(evt.date_end)}` : ""}
                  </p>
                  {evt.description && <p className="muted">{evt.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
