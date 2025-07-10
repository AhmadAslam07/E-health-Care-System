import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../patientdashboard.css";

const PatientChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);

    if (data.newPassword !== data.confirmPassword) {
      setError("New and confirm password do not match.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/patients/${user.patient_id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        })
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Password update failed.");
      } else {
        setSuccess("Password updated successfully.");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="password-tab">
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <form onSubmit={handleSubmit(onSubmit)} className="row needs-validation" noValidate>
            <div className="input-sec">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                {...register("oldPassword", {
                  required: "Old password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                className={`form-control ${errors.oldPassword ? "is-invalid" : ""}`}
              />
              {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword.message}</div>}
            </div>

            <div className="input-sec">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
              />
              {errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
            </div>

            <div className="input-sec">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: value => value === watch("newPassword") || "Passwords do not match"
                })}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>

            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {success && <div className="alert alert-success mt-2">{success}</div>}

            <div className="row px-1 mt- confirm-btn">
              <button className="btn btn-primary" type="submit">Save Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientChangePassword;
