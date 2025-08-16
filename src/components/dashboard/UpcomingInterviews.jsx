const UpcomingInterviews = ({ interviews }) => (
  <div style={{ marginBottom: "30px" }}>
    <h3>Upcoming Interviews</h3>
    {interviews.length === 0 ? (
      <p>No upcoming interviews.</p>
    ) : (
      interviews.map(interview => (
        <div key={interview.id} style={{
          backgroundColor: "#fff3cd",
          padding: "12px",
          borderLeft: "4px solid #ffc107",
          borderRadius: "6px",
          marginBottom: "10px"
        }}>
          <strong>{interview.company}</strong> – {interview.title}<br />
          📅 {interview.date} ⏰ {interview.time}
        </div>
      ))
    )}
  </div>
);

export default UpcomingInterviews;