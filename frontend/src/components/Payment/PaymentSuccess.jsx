import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get('appointment_id');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}/mark-paid`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          alert('Payment successful!');
        } else {
          alert('Could not update payment status. Please contact support.');
        }
      } catch (err) {
        console.error('Error confirming payment:', err);
        alert('Something went wrong.');
      } finally {
        navigate('/PatientDashboard/appointments');
      }
    };

    if (appointmentId) {
      confirmPayment();
    }
  }, [appointmentId, navigate]);

  return (
    <div className="container text-center py-5">
      <h2>Processing your payment...</h2>
    </div>
  );
};

export default PaymentSuccess;
