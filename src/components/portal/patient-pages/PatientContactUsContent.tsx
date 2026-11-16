import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import { PgForm } from "@/components/portal/patient-pages/pg-form";

export function PatientContactUsContent() {
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
              <path d="M4 4h16v12H7l-3 3z" />
            </svg>
            Our Services
          </div>
          <h1>Contact Us</h1>
          <p>
            Questions about a case, a request, or getting started? Our support
            team responds within one business day — or reach out instantly on
            chat.
          </p>
          <a href="#form" className="pg-btn">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v12H7l-3 3z" />
            </svg>
            Send a Message
          </a>
        </div>
        <div className="pg-hero-icon">
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h16v12H7l-3 3z" />
            <path d="M8 9h8M8 12h5" />
          </svg>
        </div>
      </div>

      <div className="pg-grid-3" style={{ marginBottom: 22 }}>
        <div className="pg-contact-card">
          <div className="pg-contact-icon t-purple">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <h4>Call Us</h4>
            <p>Mon–Friday, 9am–7pm </p>
            <a href="tel:+971585840733"> +971 58 584 0733</a>
          </div>
        </div>
        <div className="pg-contact-card">
          <div className="pg-contact-icon t-pink">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M4 6l8 7 8-7" />
            </svg>
          </div>
          <div>
            <h4>Email Us</h4>
            <p>We reply within 24 hours</p>
            <a href="mailto:support@careai.tech">info@careaitech.com</a>
          </div>
        </div>
      </div>

      <div className="pg-panels pg-panels--contact">
        <div className="pg-section" id="form" style={{ marginBottom: "0" }}>
          <div className="pg-section-head">
            <div className="pg-section-title">
              <div className="pg-section-title-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v12H7l-3 3z" />
                </svg>
              </div>
              Send Us a Message
            </div>
          </div>
          <PgForm
            successTitle="Message Sent"
            successMessage="Thank you — our support team will get back to you within one business day."
          >
            <div className="pg-field">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="pg-field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="pg-field">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" />
            </div>
            <div className="pg-field">
              <label>Reason for Contact</label>
              <CareaiSelect
                defaultValue="General Inquiry"
                options={careaiOptionsFromLabels([
                  "General Inquiry",
                  "Overseas Treatment",
                  "Consult an Expert",
                  "Second Opinion",
                  "Billing",
                ])}
              />
            </div>
            <div className="pg-field full">
              <label>Message</label>
              <textarea placeholder="How can we help?" />
            </div>
            <div className="full">
              <button className="pg-btn solid" type="submit">
                Submit Message
              </button>
            </div>
          </PgForm>
        </div>

        <div className="pg-section" style={{ marginBottom: "0" }}>
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
                  <path d="M12 8v4l3 2" />
                </svg>
              </div>
              Response Times
            </div>
          </div>
          <div className="pg-steps">
            <div className="pg-step">
              <div className="pg-step-num">1</div>
              <div className="pg-step-body">
                <h4>Live Chat</h4>
                <p>Instant response during business hours.</p>
              </div>
            </div>
            <div className="pg-step">
              <div className="pg-step-num">2</div>
              <div className="pg-step-body">
                <h4>Phone Support</h4>
                <p>Answered immediately, Mon–Sat 9am–7pm IST.</p>
              </div>
            </div>
            <div className="pg-step">
              <div className="pg-step-num">3</div>
              <div className="pg-step-body">
                <h4>Email & Contact Form</h4>
                <p>Replies within 24 hours on business days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
