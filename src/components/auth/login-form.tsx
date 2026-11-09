"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Handshake,
  HeartPulse,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
  UserRound,
} from "lucide-react";

import type { AccountRole, AuthTab } from "@/config/auth";

import {
  canSelfRegister,
  dashboardPathForRole,
  roleLabels,
  signInRoles,
} from "@/config/auth";
import {
  AUTH_MESSAGES,
  LOGIN_ID_FIELD,
  MIN_PASSWORD_LENGTH,
} from "@/config/auth-messages";
import { ROUTES } from "@/config/routes";
import { careaiLogin } from "@/lib/careai/classes";
import { writeCareaiSession } from "@/lib/careai/session";
import { cn } from "@/lib/utils";
import { patientSignup, portalLogin } from "@/services/auth";

const roleIcons: Record<AccountRole, typeof UserRound> = {
  patient: UserRound,
  facilitator: Handshake,
};

export function LoginForm() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("signin");
  const [selectedRole, setSelectedRole] = useState<AccountRole>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const switchTab = useCallback((next: AuthTab) => {
    setTab(next);
    setMessage(null);
    if (next === "signup") {
      setSelectedRole((role) =>
        role === "facilitator" ? "patient" : (role ?? "patient"),
      );
    }
  }, []);

  const isSignIn = tab === "signin";
  const idField = LOGIN_ID_FIELD[selectedRole];

  const fail = (text: string) => setMessage({ text, type: "error" });

  const validate = (): string | null => {
    if (isSignIn) {
      if (!loginId.trim()) {
        return AUTH_MESSAGES.loginIdRequired(idField.label);
      }
      return password ? null : AUTH_MESSAGES.passwordRequired;
    }
    if (!canSelfRegister(selectedRole)) {
      return AUTH_MESSAGES.agentSignupBlocked;
    }
    if (!name.trim()) return AUTH_MESSAGES.nameRequired;
    if (!email.trim()) return AUTH_MESSAGES.emailRequired;
    if (!password) return AUTH_MESSAGES.passwordRequired;
    if (password.length < MIN_PASSWORD_LENGTH)
      return AUTH_MESSAGES.passwordTooShort;
    return null;
  };

  const signIn = async () => {
    setMessage({
      text: AUTH_MESSAGES.signingIn(roleLabels[selectedRole]),
      type: "success",
    });
    try {
      const user = await portalLogin(selectedRole, loginId.trim(), password);
      writeCareaiSession({
        role: selectedRole,
        email: user.email_Id,
        name: user.user_Full_Name,
        userCd: user.user_Cd,
      });
      // Next keeps this page mounted after navigation; don't leave credentials for the next visit.
      setLoginId("");
      setPassword("");
      setMessage(null);
      router.push(dashboardPathForRole(selectedRole));
    } catch (err) {
      fail(err instanceof Error ? err.message : AUTH_MESSAGES.signInFailed);
    }
    setSubmitting(false);
  };

  const signUp = async () => {
    setMessage({ text: AUTH_MESSAGES.creatingAccount, type: "success" });
    try {
      const user = await patientSignup(name.trim(), email.trim(), password);
      setTab("signin");
      setLoginId(user.user_Cd);
      setPassword("");
      setMessage({
        text: AUTH_MESSAGES.accountCreated(user.user_Cd),
        type: "success",
      });
    } catch (err) {
      fail(err instanceof Error ? err.message : AUTH_MESSAGES.signUpFailed);
    }
    setSubmitting(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const error = validate();
    if (error) return fail(error);
    setSubmitting(true);
    void (isSignIn ? signIn() : signUp());
  };

  return (
    <div className={careaiLogin.root}>
      <Link href={ROUTES.home} className={careaiLogin.backLink}>
        <ArrowLeft size={14} aria-hidden />
        Back to Home
      </Link>

      <div className={careaiLogin.card}>
        <div className="card-head">
          <div className="logo-box">
            <HeartPulse aria-hidden />
          </div>
          <div className="head-text">
            <h1>Welcome to CareAI</h1>
            <p>
              {isSignIn ?
                "Select your account type to sign in"
              : "Select your account type to sign up"}
            </p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={careaiLogin.tab(isSignIn)}
            onClick={() => switchTab("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={careaiLogin.tab(!isSignIn)}
            onClick={() => switchTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <span className="section-label">Account type</span>
        <div className="role-grid">
          {signInRoles.map((id) => {
            const Icon = roleIcons[id];
            const active = selectedRole === id;
            const locked = !isSignIn && !canSelfRegister(id);
            return (
              <button
                key={id}
                type="button"
                aria-disabled={locked}
                title={
                  locked ? AUTH_MESSAGES.agentSignupLockedTitle : undefined
                }
                className={careaiLogin.roleBtn(active, locked)}
                onClick={() => {
                  if (locked) {
                    setMessage({
                      text: AUTH_MESSAGES.agentSignupBlocked,
                      type: "error",
                    });
                    return;
                  }
                  setSelectedRole(id);
                  setMessage(null);
                }}
              >
                {locked ?
                  <div className="tick locked">
                    <Lock aria-hidden />
                  </div>
                : <div className="tick">
                    <Check aria-hidden />
                  </div>
                }
                <div className="r-icon-wrap">
                  <Icon aria-hidden />
                </div>
                <span className="r-name">{roleLabels[id]}</span>
              </button>
            );
          })}
        </div>
        {!isSignIn ?
          <p className="role-hint">
            Agent sign-up is disabled — accounts are provisioned in the admin
            panel.
          </p>
        : selectedRole === "facilitator" ?
          <p className="role-hint">
            Signing in to the agent (business) portal.
          </p>
        : null}

        <div className="divider" />

        <form onSubmit={handleSubmit} noValidate>
          {tab === "signup" ?
            <div className="field-group">
              <label className="field-label" htmlFor="name-input">
                Full Name
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <User aria-hidden />
                </span>
                <input
                  className="form-input"
                  type="text"
                  id="name-input"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          : null}

          <div className="field-group">
            <label className="field-label" htmlFor="email-input">
              {!isSignIn ? "Email Address" : idField.label}
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <Mail aria-hidden />
              </span>
              <input
                className="form-input"
                type={isSignIn ? "text" : "email"}
                id="email-input"
                placeholder={
                  !isSignIn ? "you@example.com" : idField.placeholder
                }
                autoComplete={isSignIn ? "username" : "email"}
                value={isSignIn ? loginId : email}
                onChange={(e) =>
                  isSignIn ?
                    setLoginId(e.target.value)
                  : setEmail(e.target.value)
                }
              />
            </div>
          </div>

          <div className="field-group">
            <div className="field-top">
              <label className="field-label" htmlFor="password-input">
                Password
              </label>
              {isSignIn ?
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              : null}
            </div>
            <div className="input-wrap">
              <span className="input-icon">
                <Lock aria-hidden />
              </span>
              <input
                className="form-input pwd-input"
                type={showPassword ? "text" : "password"}
                id="password-input"
                placeholder="Enter your password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="pwd-toggle"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ?
                  <EyeOff aria-hidden />
                : <Eye aria-hidden />}
              </button>
            </div>
          </div>

          <button className="btn-signin" type="submit" disabled={submitting}>
            {isSignIn ?
              <LogIn aria-hidden />
            : <UserPlus aria-hidden />}
            <span>{isSignIn ? "Sign In" : "Create Account"}</span>
          </button>
          <p
            role="status"
            aria-live="polite"
            className={cn(
              "msg",
              message?.type === "error" && "error",
              message?.type === "success" && "success",
            )}
          >
            {message?.text ?? ""}
          </p>
        </form>

        <div className="card-foot">
          <span>
            {isSignIn ?
              <>
                No account?{" "}
                <button
                  type="button"
                  className="foot-link"
                  onClick={() => switchTab("signup")}
                >
                  Create one
                </button>
              </>
            : <>
                Have an account?{" "}
                <button
                  type="button"
                  className="foot-link"
                  onClick={() => switchTab("signin")}
                >
                  Sign in
                </button>
              </>
            }
          </span>
          <Link href={ROUTES.patient.contactUs} className="foot-link">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
