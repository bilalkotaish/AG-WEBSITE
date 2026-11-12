import React, { useRef, useState, useContext } from "react";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { myContext } from "../../App";

const OtpBox = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const histroy = useNavigate();
  const context = useContext(myContext);
  const actiontype = localStorage.getItem("action-type");

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const digits = value.slice(0, 6 - index).split("");
    const nextOtp = [...otp];

    if (digits.length === 0) {
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    digits.forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    setOtp(nextOtp);

    const nextIndex = Math.min(index + digits.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6 - index);
    if (!digits) return;

    const nextOtp = [...otp];
    digits.split("").forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    setOtp(nextOtp);

    const nextIndex = Math.min(index + digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      alert("Please enter all 6 digits");
      return;
    }
    if (actiontype !== "forgetPassword") {
      postData("/api/user/verify", {
        email: localStorage.getItem("userEmail"),
        otp: fullOtp,
      }).then((res) => {
        console.log(res);
        if (res.success) {
          context.Alertbox("success", res.message);
          localStorage.removeItem("userEmail"), histroy("/login");
          // redirect or next action
        } else {
          context.Alertbox("error", res.message);
        }
      });
    } else {
      postData("/api/user/verify-forgetpassword", {
        email: localStorage.getItem("userEmail"),
        otp: fullOtp,
      }).then((res) => {
        console.log(res);
        if (res.success) {
          context.Alertbox("success", res.message);
          histroy("/Resetpassword");
          // redirect or next action
        } else {
          context.Alertbox("error", res.message);
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex gap-3 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`OTP digit ${index + 1}`}
            className="w-12 h-12 text-center text-lg border border-gray-400 rounded-md focus:outline-primary"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>

      <button
        onClick={verifyOtp}
        className="bg-primary text-white px-6 py-2 rounded hover:bg-gray-700"
      >
        Submit OTP
      </button>
    </div>
  );
};

export default OtpBox;
