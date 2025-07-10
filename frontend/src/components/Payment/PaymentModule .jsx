import React, { useState } from "react";

const PaymentModule = () => {
  const [loading, setLoading] = useState(false);
  const paymentLinkURL = "https://buy.stripe.com/test_fZedTb2SZ2uj1fW7ss";

  const handleRedirect = () => {
    setLoading(true);
    // Simulate payment loading
    setTimeout(() => {
      window.open(paymentLinkURL, "_blank");
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={containerStyle}>
      <p style={textStyle}>
        Click the button below to complete your transaction.
      </p>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: loading ? "#aab7ff" : "#6772e5",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        onClick={handleRedirect}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

const containerStyle = {
  backgroundColor: "#f9f9f9",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "450px",
  margin: "30px auto",
  textAlign: "center",
};

const textStyle = {
  color: "#555",
  marginBottom: "25px",
  fontFamily: "'Helvetica Neue', sans-serif",
  fontSize: "1rem",
};

const buttonStyle = {
  backgroundColor: "#6772e5",
  color: "#fff",
  border: "none",
  padding: "15px 30px",
  borderRadius: "5px",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
};

export default PaymentModule;
