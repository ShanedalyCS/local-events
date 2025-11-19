export default function EventCard({ title, description, date }) {
  return (
    <div className="event-card">
      {/* Left grey block */}
      <div className="event-card-image" />

      {/* Right content */}
      <div className="event-card-body">
        <div className="event-card-header">
          <h3>{title}</h3>
          <span>{date}</span>
        </div>

        <p>{description}</p>

        <button className="read-more-btn">Read More</button>
      </div>
    </div>
  );
}
