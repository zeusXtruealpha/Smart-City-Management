import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./Feedback.css";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    traffic: { q1: "N/A", q2: "N/A", q3: "N/A", q4: "N/A" },
    events: { q1: "N/A", q2: "N/A", q3: "N/A", q4: "N/A" },
    analytics: { q1: "N/A", q2: "N/A" },
    waste: { q1: "N/A", q2: "N/A" },
    transport: { q1: "N/A", q2: "N/A" },
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleRating = (category, question, value) => {
    setFeedback((prev) => ({
      ...prev,
      [category]: { ...prev[category], [question]: value },
    }));
  };

  const calculateAverages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "feedback"));
      const feedbackList = querySnapshot.docs.map((doc) => doc.data());

      const categories = ["traffic", "events", "analytics", "waste", "transport"];
      let averages = {};

      categories.forEach((cat) => {
        let total = 0, count = 0;
        feedbackList.forEach((item) => {
          Object.values(item[cat] || {}).forEach((val) => {
            if (!isNaN(val) && val !== "N/A") {
              total += Number(val);
              count++;
            }
          });
        });
        averages[cat] = count > 0 ? (total / count).toFixed(2) : "0";
      });

      await addDoc(collection(db, "analytics"), averages);
      console.log("Averages updated:", averages);
    } catch (error) {
      console.error("Error calculating averages:", error);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", feedback);

    try {
      await addDoc(collection(db, "feedback"), feedback);
      console.log("Feedback submitted successfully!");

      await calculateAverages();

      setPopupMessage("Thank you for your feedback!");
      setShowPopup(true);

      setFeedback({
        traffic: { q1: "N/A", q2: "N/A", q3: "N/A", q4: "N/A" },
        events: { q1: "N/A", q2: "N/A", q3: "N/A", q4: "N/A" },
        analytics: { q1: "N/A", q2: "N/A" },
        waste: { q1: "N/A", q2: "N/A" },
        transport: { q1: "N/A", q2: "N/A" },
      });

      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setPopupMessage("Failed to submit feedback. Please try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className="feedback-container">
      <h2>Feedback Form</h2>
      {showPopup && <div className="popup-box">{popupMessage}</div>}
      <form onSubmit={submitFeedback}>
        {/* Traffic Management */}
        <h3>Traffic Management</h3>
        {["q1", "q2", "q3"].map((q, i) => (
          <div key={q}>
            <label>{["How is the traffic management?", "Are maps accurate?", "Is the shortest route shown?"][i]}</label>
            <div className="dot-rating">
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val} onClick={() => handleRating("traffic", q, val)}
                  className={feedback.traffic[q] >= val ? "selected" : ""}></span>
              ))}
            </div>
          </div>
        ))}

        {/* City Event Management */}
        <h3>City Event Management</h3>
        {["q1", "q2", "q3"].map((q, i) => (
          <div key={q}>
            <label>{["How is the calendar system?", "Can you check events?", "Can you manage events?"][i]}</label>
            <div className="dot-rating">
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val} onClick={() => handleRating("events", q, val)}
                  className={feedback.events[q] >= val ? "selected" : ""}></span>
              ))}
            </div>
          </div>
        ))}

        {/* Feedback and Analytics */}
        <h3>Feedback and Analytics</h3>
        {["q1", "q2"].map((q, i) => (
          <div key={q}>
            <label>{["Is feedback useful?", "Are analytics helpful?"][i]}</label>
            <div className="dot-rating">
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val} onClick={() => handleRating("analytics", q, val)}
                  className={feedback.analytics[q] >= val ? "selected" : ""}></span>
              ))}
            </div>
          </div>
        ))}

        {/* Waste Collection Management */}
        <h3>Waste Collection Management</h3>
        {["q1", "q2"].map((q, i) => (
          <div key={q}>
            <label>{["How often is garbage collected?", "Is it segregated?"][i]}</label>
            <div className="dot-rating">
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val} onClick={() => handleRating("waste", q, val)}
                  className={feedback.waste[q] >= val ? "selected" : ""}></span>
              ))}
            </div>
          </div>
        ))}

        {/* Transport Management */}
        <h3>Transport Management</h3>
        {["q1", "q2"].map((q, i) => (
          <div key={q}>
            <label>{["Can you track bus timings?", "Are buses on time?"][i]}</label>
            <div className="dot-rating">
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val} onClick={() => handleRating("transport", q, val)}
                  className={feedback.transport[q] >= val ? "selected" : ""}></span>
              ))}
            </div>
          </div>
        ))}

        <button type="submit">Submit Feedback</button>
        <button type="button" onClick={() => navigate("/analytics")}>
          View Analytics
        </button>
      </form>
    </div>
  );
};

export default Feedback;
