import React, { useEffect, useState } from 'react';
import { FaRegThumbsUp, FaRegThumbsDown, FaStar } from 'react-icons/fa';
import "../docterdashboard.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const doctorId = JSON.parse(localStorage.getItem("user"))?.doctor_id;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${doctorId}`);
        const data = await response.json();

        if (response.ok) {
          setReviews(data);
        } else {
          setError(data.message || 'Failed to load reviews');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  return (
    <div className="review-tab p-3">
      <h3 className="mb-4" style={{ color: '#00205b' }}>Doctor Reviews</h3>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-muted">No reviews available for this doctor.</p>
      )}

      <div className="doc-review review-listing">
        <ul className="comments-list">
          {reviews.map((review, index) => (
            <li key={index}>
              <div className="comment">
                <img className="avatar rounded-circle" alt="User" src="/images/Default.png" />
                <div className="comment-body">
                  <div className="meta-data">
                    <span className="comment-author">{review.Patient?.name || "Anonymous"}</span>
                    <span className="comment-date">Reviewed recently</span>
                    {/* <div className="review-count rating">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <FaStar className="filled" key={i} />
                      ))}
                    </div> */}
                  </div>
                  <p className="recommended">
                    <FaRegThumbsUp /> Recommend
                  </p>
                  <p className="comment-content">{review.comments}</p>
                  <div className="comment-reply">
                    <p className="recommend-btn">
                      {/* <span>Recommend?</span>
                      <a href="#" className="like-btn"><FaRegThumbsUp /> Yes</a>
                      <a href="#" className="dislike-btn"><FaRegThumbsDown /> No</a> */}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reviews;
