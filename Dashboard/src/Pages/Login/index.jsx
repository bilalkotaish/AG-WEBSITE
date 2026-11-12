import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";

import { useState, useContext } from "react";
import { Mycontext } from "../../App";
import { FaFacebookSquare } from "react-icons/fa";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";

import { postData } from "../../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseapp } from "../../firebase";
const auth = getAuth(firebaseapp);
const Googleprovider = new GoogleAuthProvider();

export default function Login() {
  const [isShowPass, setisShowPass] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const context = useContext(Mycontext);

  const [formfield, setformfield] = useState({
    email: "",
    password: "",
  });
  const history = useNavigate();
  const validValue = Object.values(formfield).every((el) => el);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setformfield(() => {
      return {
        ...formfield,
        [name]: value,
      };
    });
  };
  const handlesubmit = (e) => {
    setisLoading(true);
    e.preventDefault();

    if (formfield.email === "") {
      context.Alertbox("error", "Please Provide Your Email");
      return false;
    }
    if (formfield.password === "") {
      context.Alertbox("error", "Please Provide Your Password");
      return false;
    }

    postData("/api/user/login", formfield, { withCredentials: true }).then(
      (res) => {
        if (res.error !== true) {
          setisLoading(false);
          context.Alertbox("success", res.message);
          localStorage.setItem("userEmail", formfield.email);
          console.log(res);
          setformfield({
            email: "",
            password: "",
          });
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("refreshtoken", res.data.refreshToken);
          context.setisLogin(true);

          history("/");
        } else {
          context.Alertbox("error", res.message);
          setisLoading(false);
          context.setisLogin(false);
        }
      }
    );
  };
  const authWithGoogle = () => {
    signInWithPopup(auth, Googleprovider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;

        if (!credential?.idToken) {
          context.Alertbox("error", "Google sign-in could not be verified");
          return;
        }

        postData("/api/user/googleauth", { idToken: credential.idToken }).then((res) => {
          if (!res.error) {
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("accesstoken", res.data.accesstoken);
            localStorage.setItem("refreshtoken", res.data.refreshToken);
            context.setisLogin(true);

            context.Alertbox("success", res.message);

            history("/");
          } else {
            context.Alertbox("error", res.message);
          }
        });
      })
      .catch((error) => {
        console.error("Google Auth Error:", error);
      });
  };
  const forgetPassword = () => {
    if (formfield.email === "") {
      context.Alertbox("error", "Please Provide Your Email");
      return false;
    } else {
      context.Alertbox(
        "success",
        `The verification code is sent to ${formfield.email}`
      );
      localStorage.setItem("userEmail", formfield.email);
      localStorage.setItem("action-type", "forgetPassword");
      postData("/api/user/forgetpassword", {
        email: localStorage.getItem("userEmail"),
      }).then((res) => {
        console.log(res);
        if (res.success) {
          context.Alertbox("success", res.message);

          //localStorage.removeItem("userEmail"),
          history("/verify");
        } else {
          context.Alertbox("error", res.message);
        }
      });
    }
  };

  return (
    <section className="relative min-h-screen bg-white loginsection">
      <header className="admin-auth-header fixed left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-2 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E31E24] text-lg font-black text-white">
            A
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-[0.12em] text-[#0F1F4B]">
              AGCELL
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Admin portal
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-0">
          <NavLink
            to="/login"
            end
            className={({ isActive }) => (isActive ? "isActive" : undefined)}
          >
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 gap-2">
              <CgLogIn className="!text-[20px]" /> Login
            </Button>
          </NavLink>
          <NavLink to="/signup">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] px-4 gap-2">
              <MdOutlineFollowTheSigns className="!text-[20px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>
      <div className="loginbox relative z-10 mx-auto w-[550px]">
        <h1 className="text-center text-[35px] font-[700]">
          {" "}
          Welcome Back!!
          <br />
          Sign in With Your Credentials
        </h1>
        <div className="flex justify-center mt-5 gap-4">
          <Button
            size="small"
            onClick={authWithGoogle}
            endIcon={<FcGoogle />}
            loadingPosition="end"
            variant="outlined"
            className="!bg-none !text-[14px] !capitalize hover:!bg-red-600 hover:text-white"
          >
            Sign In With Google
          </Button>
        </div>
        <br />

        <div className="w-full flex items-center justify-center gap-3">
          <span className="flex items-center w-[100px] h-[2px] bg-slate-300"></span>
          <span className="text-[13px]"> Or Sign In With Your Email</span>
          <span className="flex items-center w-[100px] h-[2px] bg-slate-300"></span>
        </div>

        <form className="w-full px-8" onSubmit={handlesubmit}>
          <div className="w-full form-group mb-4">
            <h4>Email</h4>
            <input
              type="email"
              disabled={isLoading}
              value={formfield.email}
              onChange={onChangeInput}
              name="email"
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] 
              focus:outline-none px-3"
            />
          </div>
          <div className="w-full form-group mb-4">
            <h4>Password</h4>
            <div className="relative w-full">
              <input
                disabled={isLoading}
                name="password"
                value={formfield.password}
                onChange={onChangeInput}
                type={isShowPass === true ? "text" : "password"}
                className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] 
              focus:outline-none px-3"
              />
              <Button
                className="!absolute top-[7px] right-[7px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px]"
                onClick={() => setisShowPass(!isShowPass)}
              >
                {isShowPass === false ? (
                  <FaEye className="text-[18px]" />
                ) : (
                  <FaEyeSlash className="text-[18px]" />
                )}
              </Button>
            </div>
          </div>
          <div className="w-full form-group mb-4 flex items-center justify-between">
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember Me"
            />

            <a
              className="link cursor-pointer text-[14px] font-[500] "
              onClick={forgetPassword}
            >
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={!validValue}
            className="!bg-black !text-white w-full gap-3"
          >
            Login
            {isLoading === true ? <CircularProgress color="inherit" /> : ""}
          </Button>
          <h2 className="text-[13px]  text-gray-700 cursor-pointer pt-3">
            New here?
            <Link
              to="/signup"
              className="link text-[14px] link !text-red-700 cursor-pointer"
            >
              Create your account!
            </Link>
          </h2>
        </form>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </section>
  );
}
