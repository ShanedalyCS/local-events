import { Link } from "react-router-dom";

function formatDateRange(start, end) {
  if (!start && !end) return "Date pending";
  const format = (value) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  if (start && end) return `${format(start)} - ${format(end)}`;
  return format(start || end);
}

import defaultImage from '../assets/group1.png'; //import default image


export default function EventCard({ id, title, description, dateStart, dateEnd, location, rsvpCount, posterName, posterId, image}) {
  return (
    <div className="event-card">
      {/* Left image block */}
      <div
        className="event-card-image"
        style={{
          backgroundImage: `url(${image || defaultImage})`,
        }}
      />
      
      {/* Right content */}
      <div className="event-card-body">
        <div className="event-card-header">
          <h3>{title}</h3>
          <span>{formatDateRange(dateStart, dateEnd)}</span>
        </div>

        <p>{description}</p>

        {location && (
          <div className="event-meta">
            <span>{location}</span>
          </div>
        )}

        <div className="event-meta">
          <span>{Math.max(1, rsvpCount || 0)} going</span>
        </div>

        {posterName && (
          <div className="event-meta">
            <span>
              Posted by{" "}
              {posterId ? (
                <Link to={`/profile/${posterId}`} className="account-link">
                  {posterName}
                </Link>
              ) : (
                posterName
              )}
            </span>
          </div>
        )}

        <Link className="read-more-btn" to={`/events/${id}`}>
          Details
        </Link>
      </div>
    </div>
  );
}