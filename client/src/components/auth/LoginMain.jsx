import { useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MyButton } from "../../utils/MyButton";
import { ValidationType } from "../../functions/validation";
import { CtrlInput } from "../../utils/CtrlInput";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userLogin } from "../../redux/user/userSlice";
import { useAuthUserLoginMutation } from "./AuthQuery";

const LoginMain = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { state } = useLocation();
 
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [authFunc, { isLoading }] = useAuthUserLoginMutation();

  const inputProps = [
    {
      name: "email",
      placeholder: "Enter your email",
      icon: "mail",
    },
    {
      name: "password",
      placeholder: "Enter your password",
      icon: "lock",
    },
  ];

  const handleLogin = async (val) => {
    const { email, password } = val;
    let res = await authFunc({
      body: { email, password },
      method: "POST",
      msz: true,
    });
    if (res?.data?.status_code === 200 || res?.data?.status_code === 201) {
      const { user } = res?.data?.data || {};

      dispatch(userLogin(user));

      navigate(`${state?.pathname ? state.pathname : "/my-bookshelf"}`);
    }
  };

  const handleForgotPassword = (email) => {
    setShowForgotPassword(false);
    // Handle password reset logic
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mt-[100px]">
        {/* Login card */}
        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-xl overflow-hidden">
          {/* Card header */}
          <div className="bg-[var(--bg-secondary)] px-6 py-4 border-b border-[var(--bg-secondary)]">
            <h2 className="text-xl font-medium text-[var(--text-primary)]">
              {showForgotPassword
                ? "Reset Password"
                : "Sign In to Your Account"}
            </h2>
          </div>

          {/* Card body */}
          <div className="p-6">
            {!showForgotPassword ? (
              <Formik
                initialValues={{ email: "", password: "", remember: false }}
                onSubmit={(values) => handleLogin(values)}
                validationSchema={Yup.object({
                  email: ValidationType("normal", {
                    type: "normal",
                    required: true,
                  }),
                  password: Yup.string()
                    .min(6, "Minimum 6 characters required")
                    .required("Password is required"),
                })}
              >
                {(formik) => (
                  <Form className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                      >
                        Email Address
                      </label>
                      <CtrlInput.Normal
                        ref={inputRef}
                        type="email"
                        formik={formik}
                        {...inputProps[0]}
                        className="w-full rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-[var(--text-primary)]"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          className="text-sm text-[var(--primary)] hover:text-[var(--secondary)] font-medium"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <CtrlInput.Password
                        ref={inputRef}
                        formik={formik}
                        {...inputProps[1]}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        onChange={() =>
                          formik.setFieldValue(
                            "remember",
                            !formik.values.remember
                          )
                        }
                        checked={formik.values.remember}
                        className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-[var(--text-primary)]"
                      >
                        Remember me
                      </label>
                    </div>

                    <div>
                      <MyButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        isLoading={isLoading}
                        loadingText="Signing in..."
                        className="rounded-lg"
                      >
                        Sign In
                      </MyButton>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ email: "" }}
                onSubmit={(values) => handleForgotPassword(values.email)}
                validationSchema={Yup.object({
                  email: ValidationType("normal", {
                    type: "normal",
                    required: true,
                  }),
                })}
              >
                {(formik) => (
                  <Form className="space-y-5">
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </p>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                      >
                        Email Address
                      </label>
                      <CtrlInput.Normal
                        ref={inputRef}
                        formik={formik}
                        {...inputProps[0]}
                        className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <MyButton
                        type="button"
                        variant="secondary"
                        fullWidth
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Back to Login
                      </MyButton>
                      <MyButton type="submit" variant="contained" fullWidth>
                        Send Reset Link
                      </MyButton>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>

          {/* Card footer */}
          <div className="px-6 py-4 bg-[var(--bg-secondary)] text-center border-t border-[var(--bg-secondary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="font-medium text-[var(--primary)] hover:text-[var(--secondary)] cursor-pointer"
              >
                Sign up now
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          <p>© 2025 ProjectShelf. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginMain;
