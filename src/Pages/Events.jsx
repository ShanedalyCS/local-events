import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../Componants/EventCard.jsx";
import { supabase } from "../supaBaseClient.jsx";

export default function Events() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    query: "",
    start: "",
    end: "",
    hasImage: false,
    sort: "startAsc",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setFilters((prev) => ({ ...prev, query }));
  }, [searchParams]);

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

  const visibleEvents = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const start = filters.start ? new Date(filters.start) : null;
    const end = filters.end ? new Date(filters.end) : null;

    const filtered = (eventData || []).filter((evt) => {
      const matchesQuery =
        !query ||
        [evt.title, evt.description, evt.location]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query));

      const evtStart = evt.date_start ? new Date(evt.date_start) : null;
      const evtEnd = evt.date_end ? new Date(evt.date_end) : null;

      const matchesStart = !start || (evtStart && evtStart >= start);
      const matchesEnd = !end || (evtEnd && evtEnd <= end);
      const matchesImage = !filters.hasImage || Boolean(evt.image_url);

      return matchesQuery && matchesStart && matchesEnd && matchesImage;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aStart = a.date_start ? new Date(a.date_start) : null;
      const bStart = b.date_start ? new Date(b.date_start) : null;
      if (filters.sort === "startDesc") return (bStart?.getTime() || 0) - (aStart?.getTime() || 0);
      if (filters.sort === "alpha") return (a.title || "").localeCompare(b.title || "");
      return (aStart?.getTime() || 0) - (bStart?.getTime() || 0);
    });

    return sorted;
  }, [eventData, filters]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ query: "", start: "", end: "", hasImage: false, sort: "startAsc" });
  }

  useEffect(() => {
    const current = searchParams.get("search") || "";
    if (filters.query === current) return;
    const next = new URLSearchParams(searchParams);
    if (filters.query) {
      next.set("search", filters.query);
    } else {
      next.delete("search");
    }
    setSearchParams(next);
  }, [filters.query]);

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
    <div className="page-shell">
      <div className="page-hero">
        <p className="eyebrow">Discover</p>
        <div className="page-hero__row">
          <h1>All events</h1>
          <button className="ghost-btn" onClick={fetchEvents} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <p className="muted">Browse everything coming up. Sorted by start date.</p>
      </div>

      <div className="filter-panel">
        <div className="filter-header">
          <div>
            <p className="eyebrow">Filter</p>
            <h3 className="filter-title">Find the perfect event</h3>
          </div>
          <button className="ghost-btn small" onClick={clearFilters}>
            Reset
          </button>
        </div>

        <div className="filter-row">
          <div className="filter-field">
            <label>Search</label>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              placeholder="Title, description, or location"
            />
          </div>
          <div className="filter-field">
            <label>Start after</label>
            <input
              type="date"
              value={filters.start}
              onChange={(e) => updateFilter("start", e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>End before</label>
            <input
              type="date"
              value={filters.end}
              onChange={(e) => updateFilter("end", e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Sort</label>
            <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}>
              <option value="startAsc">Start date (soonest)</option>
              <option value="startDesc">Start date (latest)</option>
              <option value="alpha">Title A-Z</option>
            </select>
          </div>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.hasImage}
              onChange={(e) => updateFilter("hasImage", e.target.checked)}
            />
            Only show events with images
          </label>
        </div>
      </div>

      {loading && <p className="muted">Loading events...</p>}
      {error && <p className="muted">Error: {error}</p>}
      {!loading && !error && visibleEvents.length === 0 && <p className="muted">No events found.</p>}

      <div className="event-list">
        {visibleEvents.map((item) => (
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
