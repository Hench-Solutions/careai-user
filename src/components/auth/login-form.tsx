"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useCareaiSession } from "@/hooks/use-careai-session";
import { careaiLogin } from "@/lib/careai/classes";
import { readCareaiSession, writeCareaiSession } from "@/lib/careai/session";
import { cn } from "@/lib/utils";

const roleIcons: Record<AccountRole, typeof UserRound> = {
  patient: UserRound,
  facilitator: Handshake,
};

export function LoginForm() {
  const router = useRouter();
  const session = useCareaiSession();
  const [tab, setTab] = useState<AuthTab>("signin");
  const [selectedRole, setSelectedRole] = useState<AccountRole>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  useEffect(() => {
    const activeSession = readCareaiSession();
    if (activeSession) {
      router.replace(dashboardPathForRole(activeSession.role));
    }
  }, [router, session]);

  const switchTab = useCallback((next: AuthTab) => {
    setTab(next);
    setMessage(null);
    if (next === "signup") {
      setSelectedRole((role) =>
        role === "facilitator" ? "patient" : (role ?? "patient"),
      );
    }
  }, []);

  const handleSubmit = () => {
    if (!selectedRole) {
      setMessage({ text: "Please select your account type.", type: "error" });
      return;
    }
    if (tab === "signup" && !canSelfRegister(selectedRole)) {
      setMessage({
        text: "Agent accounts are created by an administrator. Please sign in or contact support.",
        type: "error",
      });
      return;
    }
    if (tab === "signup" && !name.trim()) {
      setMessage({ text: "Please enter your full name.", type: "error" });
      return;
    }
    if (!email.trim()) {
      setMessage({ text: "Please enter your email address.", type: "error" });
      return;
    }
    if (!password) {
      setMessage({ text: "Please enter your password.", type: "error" });
      return;
    }

    setMessage({
      text:
        tab === "signin" ?
          `Signing in as ${roleLabels[selectedRole]}…`
        : "Creating your patient account…",
      type: "success",
    });

    writeCareaiSession({
      role: selectedRole,
      email: email.trim(),
      name: tab === "signup" ? name.trim() : undefined,
    });

    const destination = dashboardPathForRole(selectedRole);
    window.setTimeout(() => {
      router.push(destination);
    }, 400);
  };

  const isSignIn = tab === "signin";

  return (
    <div className={careaiLogin.root}>
      <Link href="/" className={careaiLogin.backLink}>
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
                  locked ?
                    "Agent accounts are created by an administrator"
                  : undefined
                }
                className={careaiLogin.roleBtn(active, locked)}
                onClick={() => {
                  if (locked) {
                    setMessage({
                      text: "Agent accounts are created by an administrator. Please sign in or contact support.",
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
            Email Address
          </label>
          <div className="input-wrap">
            <span className="input-icon">
              <Mail aria-hidden />
            </span>
            <input
              className="form-input"
              type="email"
              id="email-input"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        <button className="btn-signin" type="button" onClick={handleSubmit}>
          {isSignIn ?
            <LogIn aria-hidden />
          : <UserPlus aria-hidden />}
          <span>{isSignIn ? "Sign In" : "Create Account"}</span>
        </button>
        <p
          className={cn(
            "msg",
            message?.type === "error" && "error",
            message?.type === "success" && "success",
          )}
        >
          {message?.text ?? ""}
        </p>

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
          <Link href="/patient/contact-us" className="foot-link">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
