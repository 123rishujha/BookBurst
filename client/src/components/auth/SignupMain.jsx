import { useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MyButton } from "../../utils/MyButton";
import { ValidationType } from "../../functions/validation";
import { CtrlInput } from "../../utils/CtrlInput";
import { useAuthUserSignupMutation } from "./AuthQuery";
import { useNavigate } from "react-router-dom";

const SignupMain = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [API, { isLoading }] = useAuthUserSignupMutation();

  const inputProps = [
    {
      name: "fullName",
      placeholder: "Enter your full name",
      icon: "user",
    },
    {
      name: "email",
      placeholder: "Enter your email address",
      icon: "mail",
    },
    {
      name: "password",
      placeholder: "Create a password",
      icon: "lock",
    },
    {
      name: "confirmPassword",
      placeholder: "Confirm your password",
      icon: "shield",
    },
  ];

  const handleSignup = async (values) => {
    const { fullName, email, password } = values;
    const res = await API({ body: { name: fullName, email, password } });
    if (res?.data?.status_code === 200) {
      navigate("/login");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg mt-[100px]">
        {/* Signup card */}
        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Card header */}
          <div className="bg-[var(--bg-secondary)] px-6 py-5 border-b border-[var(--bg-secondary)]">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Create Your Account
            </h2>
            <p className="text-[var(--text-secondary)] mt-1">
              Fill in your details to get started
            </p>
          </div>

          {/* Card body */}
          <div className="p-6">
            <Formik
              initialValues={{
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              onSubmit={(values) => handleSignup(values)}
              validationSchema={Yup.object({
                fullName: Yup.string().required("Full name is required"),
                email: ValidationType("normal", {
                  type: "normal",
                  required: true,
                }),
                password: Yup.string()
                  .min(8, "Password must be at least 8 characters")
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                  )
                  .required("Password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("password"), null], "Passwords must match")
                  .required("Please confirm your password"),
              })}
            >
              {(formik) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                      >
                        Full Name
                      </label>
                      <CtrlInput.Normal
                        ref={inputRef}
                        formik={formik}
                        {...inputProps[0]}
                        className="w-full rounded-lg"
                        name="fullName"
                      />
                    </div>

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
                        {...inputProps[1]}
                        className="w-full rounded-lg"
                        name="email"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                      >
                        Password
                      </label>
                      <CtrlInput.Password
                        ref={inputRef}
                        formik={formik}
                        {...inputProps[2]}
                        className="w-full rounded-lg"
                        name="password"
                      />
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        Min. 8 characters with uppercase, lowercase, and numbers
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                      >
                        Confirm Password
                      </label>
                      <CtrlInput.Password
                        ref={inputRef}
                        formik={formik}
                        {...inputProps[3]}
                        className="w-full rounded-lg"
                        name="confirmPassword"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <MyButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      isLoading={isLoading}
                      loadingText="Creating account..."
                      className="rounded-lg h-12 text-base"
                    >
                      Create Account
                    </MyButton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Card footer */}
          <div className="px-6 py-4 bg-[var(--bg-secondary)] text-center border-t border-[var(--bg-secondary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
              >
                Sign in
              </a>
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

export default SignupMain;
