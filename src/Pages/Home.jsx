import "react";

import EventCard from "../Componants/EventCard.jsx";
import sampleEvents from "../data/sampleEvents.js";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Events</h1>

      <div className="event-list">
        {sampleEvents.map(event => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
          />
        ))}
      </div>
    </div>
  );
}
