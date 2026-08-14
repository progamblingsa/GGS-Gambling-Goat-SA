import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const plans = [
  {
    name: "GOAT STARTER",
    price: 99,
    description: "A structured introduction to the GGS community.",
    features: [
      "Member access",
      "Educational content",
      "Responsible gambling resources",
      "Community updates"
    ]
  },
  {
    name: "GOAT PRO",
    price: 199,
    description: "The full GGS membership experience.",
    features: [
      "Everything in Starter",
      "Premium educational content",
      "Member dashboard",
      "Exclusive community content"
    ],
    featured: true
  },
  {
    name: "GOAT ELITE",
    price: 399,
    description: "Premium access for serious members.",
    features: [
      "Everything in Pro",
      "Elite member content",
      "Priority community access",
      "Premium resources"
    ]
  }
];

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setLoggedIn(true);
    setShowLogin(false);
    setShowDashboard(true);
  };

  return (
    <div className="app">

      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="logo">
          GGS <span>GAMBLING GOAT SA</span>
        </div>

        <div className="nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </button>

          <button
            onClick={() =>
              document
                .getElementById("membership")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Membership
          </button>

          {loggedIn && (
            <button onClick={() => setShowDashboard(true)}>
              Dashboard
            </button>
          )}

          <button onClick={() => setShowLogin(true)}>
            {loggedIn ? "Account" : "Login"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>
          WELCOME TO
          <br />
          <span>GGS GAMBLING GOAT SA</span>
        </h1>

        <p>
          More than just a brand — it's a lifestyle.
          Join the GGS community for educational content,
          member resources and a responsible approach to gambling.
        </p>

        <button
          className="primary-btn"
          onClick={() =>
            document
              .getElementById("membership")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          VIEW MEMBERSHIP
        </button>
      </section>

      {/* ABOUT */}
      <section className="section">
        <div className="section-title">
          <h2>THE GGS MOVEMENT</h2>
          <p>
            Built around discipline, knowledge, community and responsible
            decision-making.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <small>COMMUNITY</small>
            <strong>GGS SA</strong>
          </div>

          <div className="stat-card">
            <small>MISSION</small>
            <strong>EDUCATE</strong>
          </div>

          <div className="stat-card">
            <small>PRINCIPLE</small>
            <strong>DISCIPLINE</strong>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section className="section" id="membership">
        <div className="section-title">
          <h2>CHOOSE YOUR MEMBERSHIP</h2>
          <p>
            Select the membership that fits you.
          </p>
        </div>

        <div className="plans">
          {plans.map((plan) => (
            <div
              className={`plan-card ${
                plan.featured ? "featured" : ""
              }`}
              key={plan.name}
            >
              {plan.featured && (
                <div
                  style={{
                    color: "#f5c400",
                    fontWeight: "900",
                    marginBottom: "10px"
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <h3>{plan.name}</h3>

              <div className="price">
                R{plan.price}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  /month
                </span>
              </div>

              <p>{plan.description}</p>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <button
                className="primary-btn full"
                onClick={() => setSelectedPlan(plan)}
              >
                SELECT PLAN
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* RESPONSIBLE GAMBLING */}
      <section className="section">
        <div className="section-title">
          <h2>PLAY RESPONSIBLY</h2>

          <p>
            Gambling should be entertainment, not a way to recover losses
            or solve financial problems.
          </p>
        </div>

        <div className="plan-card">
          <h3>GGS RESPONSIBLE GAMBLING PRINCIPLES</h3>

          <ul>
            <li>Only gamble with money you can afford to lose.</li>
            <li>Never chase losses.</li>
            <li>Set spending and time limits.</li>
            <li>Take regular breaks.</li>
            <li>Never borrow money to gamble.</li>
            <li>Seek professional help if gambling becomes difficult to control.</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <strong>GGS GAMBLING GOAT SA</strong>

        <p style={{ marginTop: "10px" }}>
          More than just a brand — it's a lifestyle.
        </p>

        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          © {new Date().getFullYear()} GGS Gambling GOAT SA. All rights reserved.
        </p>
      </footer>

      {/* PLAN MODAL */}
      {selectedPlan && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{selectedPlan.name}</h2>

            <p>
              You selected the{" "}
              <strong>{selectedPlan.name}</strong> membership.
            </p>

            <div className="modal-note">
              Membership payment processing is not connected yet.
              Connect a verified payment provider before accepting
              real payments.
            </div>

            <button
              className="primary-btn full"
              onClick={() => setSelectedPlan(null)}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>GGS MEMBER LOGIN</h2>

            <p style={{ marginBottom: "15px" }}>
              Sign in to access your member dashboard.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                required
              />

              <input
                type="password"
                placeholder="Password"
                required
              />

              <button
                className="primary-btn full"
                type="submit"
                style={{ marginTop: "10px" }}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD MODAL */}
      {showDashboard && (
        <div
          className="modal-overlay"
          onClick={() => setShowDashboard(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>GGS MEMBER DASHBOARD</h2>

            <p style={{ margin: "15px 0" }}>
              Welcome to the GGS member area.
            </p>

            <div className="dashboard-grid">
              <div className="stat-card">
                <small>STATUS</small>
                <strong>ACTIVE</strong>
              </div>

              <div className="stat-card">
                <small>MEMBER</small>
                <strong>GGS</strong>
              </div>

              <div className="stat-card">
                <small>CONTENT</small>
                <strong>ACCESS</strong>
              </div>
            </div>

            <button
              className="primary-btn full"
              style={{ marginTop: "20px" }}
              onClick={() => setShowDashboard(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
