import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import "../docterdashboard.css";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [message, setMessage] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setMessage({ type: "error", text: "New and confirm passwords do not match" });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors/${user.doctor_id}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        })
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully" });
      } else {
        setMessage({ type: "error", text: result.message || "Password update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error occurred" });
    }
  };

  return (
    <div className="password-tab">
      <div className="row">
        <div className='col-lg-12 col-md-12'>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="input-sec">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <input
                type="password"
                className={errors.oldPassword ? "form-control is-invalid" : "form-control"}
                {...register("oldPassword", {
                  required: "Old password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword.message}</div>}
            </div>

            <div className="input-sec">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                className={errors.newPassword ? "form-control is-invalid" : "form-control"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              {errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
            </div>

            <div className="input-sec">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className={errors.confirmPassword ? "form-control is-invalid" : "form-control"}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: value => value === watch("newPassword") || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>

            {message && (
              <div className={`alert mt-3 ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
                {message.text}
              </div>
            )}

            <div className="row px-1 mt-3 confirm-btn">
              <button className="btn" type="submit">Save Password</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
