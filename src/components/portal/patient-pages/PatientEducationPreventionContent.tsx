"use client";

import Image from "next/image";

import {
  careaiOptionsFromLabels,
  CareaiSelect,
} from "@/components/careai/careai-select";
import { usePgFormSubmit } from "@/components/portal/use-pg-form";
import { cn } from "@/lib/utils";

export function PatientEducationPreventionContent() {
  const { submitted, onSubmit } = usePgFormSubmit();
  return (
    <>
      <div className="pg-hero">
        <div>
          <div className="pg-hero-badge">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4l9 4-9 4-9-4z" />
            </svg>
            Our Services
          </div>
          <h1>Education & Prevention</h1>
          <p>
            Practical, doctor-reviewed guides and screening reminders that help
            patients understand risk factors early and avoid conditions before
            they become serious.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#library" className="pg-btn">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Browse Health Library
            </a>
            <a href="#ask" className="pg-btn outline">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 1.8-2 3.5" />
                <path d="M12 17h.01" />
              </svg>
              Ask a Question
            </a>
          </div>
        </div>
        <div className="pg-hero-icon">
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 4l9 4-9 4-9-4z" />
            <path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
          </svg>
        </div>
      </div>

      <div className="pg-stats-row">
        <div className="pg-stat-mini">
          <div className="num">80+</div>
          <div className="lbl">Health Guides</div>
        </div>
        <div className="pg-stat-mini">
          <div className="num">12</div>
          <div className="lbl">Specialty Topics</div>
        </div>
        <div className="pg-stat-mini">
          <div className="num">Weekly</div>
          <div className="lbl">New Content</div>
        </div>
        <div className="pg-stat-mini">
          <div className="num">Free</div>
          <div className="lbl">For All Patients</div>
        </div>
      </div>

      <div className="pg-section" id="library">
        <div className="pg-section-head">
          <div className="pg-section-title">
            <div className="pg-section-title-icon">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            Featured Health Guides
          </div>
        </div>
        <div className="pg-grid-4">
          <div className="pg-article">
            <div className="pg-article-cover">
              <Image
                src="/images/patient/BuildingaHeart.png"
                alt="Building a Heart"
                width={280}
                height={110}
                className="size-full object-cover"
              />
            </div>
            <div className="pg-article-body">
              <div className="pg-article-tag">Cardiology</div>
              <h4>Early Signs of Heart Disease You Shouldn't Ignore</h4>
              <p>
                Key risk factors and symptoms worth discussing with a doctor
                early.
              </p>
              <div className="pg-article-foot">
                <span>6 min read</span>
                <span>Reviewed by Dr. Sharma</span>
              </div>
            </div>
          </div>
          <div className="pg-article">
            <div className="pg-article-cover">
              <Image
                src="/images/patient/CancerScreening.png"
                alt="Cancer Screening"
                width={280}
                height={110}
                className="size-full object-cover"
              />
            </div>
            <div className="pg-article-body">
              <div className="pg-article-tag">Oncology</div>
              <h4>Cancer Screening Guidelines by Age</h4>
              <p>What screenings are recommended and when to start them.</p>
              <div className="pg-article-foot">
                <span>8 min read</span>
                <span>Reviewed by Dr. Khan</span>
              </div>
            </div>
          </div>
          <div className="pg-article">
            <div className="pg-article-cover">
              <Image
                src="/images/patient/EarlySigns.png"
                alt="Early Signs"
                width={280}
                height={110}
                className="size-full object-cover"
              />
            </div>
            <div className="pg-article-body">
              <div className="pg-article-tag">Nutrition</div>
              <h4>Building a Heart-Healthy Diet Plan</h4>
              <p>Simple, sustainable food swaps that lower long-term risk.</p>
              <div className="pg-article-foot">
                <span>5 min read</span>
                <span>Reviewed by Dietitian Team</span>
              </div>
            </div>
          </div>
          <div className="pg-article">
            <div className="pg-article-cover">
              <Image
                src="/images/patient/PreventingJoint.png"
                alt="Preventing Joint Pain"
                width={280}
                height={110}
                className="size-full object-cover"
              />
            </div>
            <div className="pg-article-body">
              <div className="pg-article-tag">Orthopedics</div>
              <h4>Preventing Joint Pain Before It Starts</h4>
              <p>Everyday habits that protect knees, hips and the spine.</p>
              <div className="pg-article-foot">
                <span>4 min read</span>
                <span>Reviewed by Dr. Patel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pg-section" id="ask">
        <div className="pg-section-head">
          <div className="pg-section-title">
            <div className="pg-section-title-icon">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 1.8-2 3.5" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            Ask a Health Question
          </div>
          <div className="pg-section-sub">
            Get a free, doctor-reviewed answer or request a preventive-care
            consultation
          </div>
        </div>

        <form
          className="pg-form"
          onSubmit={onSubmit}
          style={submitted ? { display: "none" } : undefined}
        >
          <div className="pg-field">
            <label>
              Full Name <span className="pg-required">*</span>
            </label>
            <input type="text" placeholder="Your full name" required />
          </div>
          <div className="pg-field">
            <label>
              Email Address <span className="pg-required">*</span>
            </label>
            <input type="email" placeholder="you@example.com" required />
          </div>
          <div className="pg-field">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 98765 43210" />
          </div>
          <div className="pg-field">
            <label>Topic of Interest</label>
            <CareaiSelect
              defaultValue="Heart Health"
              options={careaiOptionsFromLabels([
                "Heart Health",
                "Cancer Awareness",
                "Diabetes Care",
                "Bone & Joint Health",
                "Mental Wellness",
                "Women's Health",
                "Child Health",
                "Nutrition",
                "Fitness",
                "Senior Care",
              ])}
            />
          </div>
          <div className="pg-field full">
            <label>
              Your Question <span className="pg-required">*</span>
            </label>
            <textarea
              placeholder="What would you like our specialists to answer?"
              required
            />
          </div>
          <div className="pg-field full">
            <label className="pg-checkbox-row">
              <input type="checkbox" defaultChecked />
              Send me weekly preventive-care tips and new health guides
            </label>
          </div>
          <div className="full">
            <button className="pg-btn solid" type="submit">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Send My Question
            </button>
            <div className="pg-form-note">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Answers are reviewed by a licensed physician, usually within 2
              business days.
            </div>
          </div>
        </form>

        <div className={cn("pg-success", submitted && "show")}>
          <div className="pg-success-icon">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3>Question Submitted</h3>
          <p>
            Thank you — one of our reviewing physicians will get back to you by
            email, usually within 2 business days.
          </p>
        </div>
      </div>
    </>
  );
}
