import TextField from "@mui/material/TextField";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { postData } from "../../utils/api";
import { myContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseapp } from "../../firebase";
import Logo from "../../Component/Logo";

const auth = getAuth(firebaseapp);
const Googleprovider = new GoogleAuthProvider();

export default function Register() {
  const context = useContext(myContext);
  const history = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [ShowPassword, setShowPasword] = useState(false);

  const [formFields, setfromFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setfromFields({ ...formFields, [name]: value });
  };

  const validValue = Object.values(formFields).every((el) => el);

  const handlesubmit = (e) => {
    e.preventDefault();
    setisLoading(true);

    const { name, email, password } = formFields;
    if (!name || !email || !password) {
      context.Alertbox("error", "All fields are required");
      setisLoading(false);
      return;
    }

    postData("/api/user/register", formFields).then((res) => {
      setisLoading(false);
      if (res.success && !res.error) {
        context.Alertbox("success", res.message);
        localStorage.setItem("userEmail", formFields.email);
        setfromFields({ name: "", email: "", password: "" });
        history("/verify");
      } else {
        context.Alertbox("error", res.message);
      }
    });
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-black/10 p-8">
        <div className="text-center mb-6">
          <Logo className="h-14 w-auto mx-auto mb-3" />

          <h1 className="text-2xl font-semibold text-black">
            Create your AgCell account
          </h1>
          <p className="text-sm text-gray-500">
            Save phones, track orders, and check out faster
          </p>
        </div>

        <form onSubmit={handlesubmit} className="space-y-5 !rounded-full">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            value={formFields.name}
            onChange={onChangeInput}
            disabled={isLoading}
            fullWidth
            variant="outlined"
            className="w-full h-12 rounded-full px-4 bg-[#f6f4f1] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600] transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formFields.email}
            onChange={onChangeInput}
            disabled={isLoading}
            className="w-full h-12 rounded-full px-4 bg-[#f6f4f1] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600] transition"
          />

          <div className="relative">
            <input
              type={ShowPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formFields.password}
              onChange={onChangeInput}
              disabled={isLoading}
              className="w-full h-12 rounded-full px-4 bg-[#f6f4f1] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600] transition"
            />
            <Button
              type="button"
              onClick={() => setShowPasword(!ShowPassword)}
              className="!absolute !top-[10px] !right-[10px] !min-w-[35px] !h-[35px] !rounded-full !text-gray-600"
            >
              {ShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </Button>
          </div>

          <Button
            type="submit"
            disabled={!validValue}
            className="w-full h-12 !rounded-full !bg-black hover:!bg-primary !text-white flex items-center justify-center text-lg font-semibold transition"
          >
            Sign Up{" "}
            {isLoading && (
              <CircularProgress size={20} color="inherit" className="ml-2" />
            )}
          </Button>

          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#E10600] font-medium hover:underline"
            >
              Login
            </Link>
          </div>

          <div className="border-t pt-4 mt-4 text-center text-gray-400 text-sm">
            Or register with
          </div>

          <Button
            onClick={authWithGoogle}
            className="w-full h-12 !rounded-full !bg-black hover:!bg-primary !text-white flex items-center justify-center text-lg font-semibold transition"
          >
            <FcGoogle className="text-xl" /> Sign up with Google
          </Button>
        </form>
      </div>
    </section>
  );
}
