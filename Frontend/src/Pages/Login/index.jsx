import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FcGoogle } from "react-icons/fc";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import { myContext } from "../../App";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseapp } from "../../firebase";
import Logo from "../../Component/Logo";

const auth = getAuth(firebaseapp);
const Googleprovider = new GoogleAuthProvider();

export default function Login() {
  const [ShowPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(myContext);
  const history = useNavigate();

  const [formfield, setFormField] = useState({
    email: "",
    password: "",
  });

  const validValue = Object.values(formfield).every((el) => el);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formfield.email || !formfield.password) {
      context.Alertbox("error", "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    postData("/api/user/login", formfield, { withCredentials: true }).then(
      (res) => {
        setIsLoading(false);
        if (!res.error) {
          context.Alertbox("success", res.message);
          localStorage.setItem("userEmail", formfield.email);
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("refreshtoken", res.data.refreshToken);
          context.setislogin(true);
          history("/");
        } else {
          context.Alertbox("error", res.message);
        }
      }
    );
  };

  const forgetPassword = () => {
    if (!formfield.email) {
      context.Alertbox("error", "Please provide your email");
      return;
    }

    localStorage.setItem("userEmail", formfield.email);
    localStorage.setItem("action-type", "forgetPassword");

    postData("/api/user/forgetpassword", { email: formfield.email }).then(
      (res) => {
        if (res.success) {
          context.Alertbox("success", res.message);
          history("/verify");
        } else {
          context.Alertbox("error", res.message);
        }
      }
    );
  };

  const authWithGoogle = () => {
    signInWithPopup(auth, Googleprovider)
      .then((result) => {
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (!credential?.idToken) {
          context.Alertbox("error", "Google sign-in could not be verified");
          return;
        }

        postData("/api/user/googleauth", { idToken: credential.idToken }).then((res) => {
          if (!res.error) {
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("accesstoken", res.data.accesstoken);
            localStorage.setItem("refreshtoken", res.data.refreshToken);
            context.setislogin(true);
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

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f6f6f7] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-black/10 p-8">
        <div className="text-center mb-6">
          <Logo className="h-14 w-auto mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-black">Welcome back</h1>
          <p className="text-sm text-gray-500">Log in to your AgCell account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formfield.email}
            onChange={onChangeInput}
            disabled={isLoading}
            className="w-full h-12 rounded-full px-4 bg-[#f6f4f1] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600] transition"
          />

          <div className="relative">
            <input
              type={ShowPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formfield.password}
              onChange={onChangeInput}
              disabled={isLoading}
              className="w-full h-12 rounded-full px-4 bg-[#f6f4f1] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!ShowPassword)}
              className="absolute top-4 right-3 text-gray-500"
            >
              {ShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <button
              type="button"
              onClick={forgetPassword}
              className="hover:text-[#E10600] transition"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={!validValue}
            className="w-full h-12 !rounded-full !bg-black hover:!bg-primary !text-white flex items-center justify-center text-lg font-semibold transition"
          >
            Login{" "}
            {isLoading && (
              <CircularProgress size={20} color="inherit" className="ml-2" />
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#E10600] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

          <div className="border-t text-center text-gray-600 text-md">
            Or login with
          </div>

          <Button
            onClick={authWithGoogle}
            className="w-full h-12 flex justify-center !text-black items-center gap-1 border border-black/10 !bg-white !rounded-full hover:!bg-black hover:!text-white transition"
          >
            <FcGoogle className="text-xl" /> Sign in with Google
          </Button>
        </form>
      </div>
    </section>
  );
}
