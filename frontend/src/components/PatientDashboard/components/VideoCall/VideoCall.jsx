import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const { roomId, appointmentId } = useParams();
  const navigate = useNavigate();
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isPatient = user?.role === "patient";

  const doctor_id = isPatient ? roomId.split("-")[2] : user?.doctor_id;
  const patient_id = isPatient ? user?.patient_id : roomId.split("-")[2];

  useEffect(() => {
    const initCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.current.srcObject = stream;

      const peer = new Peer({
        host: "localhost",
        port: 9000,
        path: "/"
      });

      peerRef.current = peer;

      peer.on("open", async (id) => {
        setStartTime(new Date());

        const res = await fetch(`http://localhost:5000/api/calls/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            room_id: roomId,
            doctor_id,
            patient_id
          })
        });

        const data = await res.json();
        console.log("Call initiated:", data);

        // Simulate call initiation for testing — in real app, this comes from another peer
        if (isPatient) {
          setTimeout(() => {
            const call = peer.call(roomId, stream);
            call.on("stream", (remoteStream) => {
              remoteVideo.current.srcObject = remoteStream;
            });
          }, 3000); // Delay so peer is ready
        }
      });

      peer.on("call", (incomingCall) => {
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          remoteVideo.current.srcObject = remoteStream;
        });
      });
    };

    initCall();
  }, [roomId]);

  const endCall = async () => {
    await fetch(`http://localhost:5000/api/calls/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        room_id: roomId,
        doctor_id,
        patient_id,
        start_time: startTime
      })
    });

    await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: "completed" })
    });

    const redirectPath = user?.role === "doctor"
      ? "/DoctorDashboard/appointments"
      : "/PatientDashboard/appointments";

    navigate(redirectPath);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl mb-4 font-semibold">Video Call Room: {roomId}</h2>
      <div className="flex gap-4">
        <video ref={localVideo} autoPlay muted className="w-64 h-48 bg-black rounded" />
        <video ref={remoteVideo} autoPlay className="w-64 h-48 bg-black rounded" />
      </div>
      <button
        onClick={endCall}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCall;
