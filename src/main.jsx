import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./styles.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const plans = [
  {
    name: "GOAT STARTER",
    price: 99,
    features: [
      "Member access",
      "Educational content",
      "Responsible gambling resources",
      "Community updates",
    ],
  },
  {
    name: "GOAT PRO",
    price: 199,
    featured: true,
    features: [
      "Everything in Starter",
      "Premium educational content",
      "Member dashboard",
      "Exclusive community content",
    ],
  },
  {
    name: "GOAT ELITE",
    price: 399,
    features: [
      "Everything in Pro",
      "Elite member content",
      "Premium resources",
      "Priority member updates",
    ],
  },
];

function App() {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleAuth(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (!data.session) {
          setMessage(
            "Account created. Check your email to confirm your account."
          );
        } else {
          setMessage("Account created successfully.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Login successful.");
        setShowAuth(false);
      }
    } catch (error) {
      setMessage(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setShowDashboard(false);
  }

  function choosePlan(plan) {
    if (!session) {
      setAuthMode("signup");
      setShowAuth(true);
      setMessage("Create an account before selecting a membership.");
      return;
    }

    setSelectedPlan(plan);
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          GGS <span>GAMBLING GOAT SA</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#membership">Membership</a>
          <a href="#about">About</a>

          {session && (
            <button onClick={() => setShowDashboard(true)}>
              Dashboard
            </button>
          )}

          {!session ? (
            <button onClick={() => setShowAuth(true)}>
              Login
            </button>
          ) : (
            <button onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <h1>
          WELCOME TO
          <br />
          <span>GGS GAMBLING GOAT SA</span>
        </h1>

        <p>
          More than just a brand — it's a lifestyle.
          Join the GGS community for educational content,
          member resources and responsible gambling information.
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

      {/* MEMBERSHIP */}
      <section className="section" id="membership">
        <div className="section-title">
          <h2>CHOOSE YOUR MEMBERSHIP</h2>
          <p>Select your GGS membership level.</p>
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
                    marginBottom: "10px",
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <h3>{plan.name}</h3>

              <div className="price">
                R{plan.price}
                <span style={{ fontSize: "14px" }}>
                  /month
                </span>
              </div>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <button
                className="primary-btn full"
                onClick={() => choosePlan(plan)}
              >
                SELECT PLAN
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="section-title">
          <h2>THE GGS MINDSET</h2>
          <p>
            Knowledge. Discipline. Community. Responsible decision-making.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <small>MISSION</small>
            <strong>EDUCATE</strong>
          </div>

          <div className="stat-card">
            <small>PRINCIPLE</small>
            <strong>DISCIPLINE</strong>
          </div>

          <div className="stat-card">
            <small>COMMUNITY</small>
            <strong>GGS SA</strong>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE GAMBLING */}
      <section className="section">
        <div className="section-title">
          <h2>PLAY RESPONSIBLY</h2>
          <p>
            Gambling involves financial risk. No strategy, pattern or
            signal can guarantee winnings.
          </p>
        </div>

        <div className="plan-card">
          <h3>GGS RESPONSIBLE GAMBLING PRINCIPLES</h3>

          <ul>
            <li>Only gamble with money you can afford to lose.</li>
            <li>Never chase losses.</li>
            <li>Set spending and time limits.</li>
            <li>Never borrow money to gamble.</li>
            <li>Take regular breaks.</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <strong>GGS GAMBLING GOAT SA</strong>
        <p>More than just a brand — it's a lifestyle.</p>
        <p>
          © {new Date().getFullYear()} GGS Gambling Goat SA
        </p>
      </footer>

      {/* AUTH MODAL */}
      {showAuth && (
        <div
          className="modal-overlay"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>
              {authMode === "login"
                ? "GGS MEMBER LOGIN"
                : "CREATE GGS ACCOUNT"}
            </h2>

            <p style={{ margin: "12px 0" }}>
              {authMode === "login"
                ? "Log in to your GGS account."
                : "Create your GGS member account."}
            </p>

            <form onSubmit={handleAuth}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />

              <button
                className="primary-btn full"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "PLEASE WAIT..."
                  : authMode === "login"
                  ? "LOGIN"
                  : "CREATE ACCOUNT"}
              </button>
            </form>

            {message && (
              <div className="modal-note">
                {message}
              </div>
            )}

            <button
              style={{
                border: 0,
                background: "transparent",
                marginTop: "15px",
                cursor: "pointer",
                fontWeight: "700",
              }}
              onClick={() => {
                setAuthMode(
                  authMode === "login" ? "signup" : "login"
                );
                setMessage("");
              }}
            >
              {authMode === "login"
                ? "Create a new account"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      )}

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

            <div className="price">
              R{selectedPlan.price}
              <span>/month</span>
            </div>

            <p>
              Your account is ready. Payment integration will be
              connected separately.
            </p>

            <div className="modal-note">
              Membership payment is not active yet. Do not accept
              real payments until the payment provider and subscription
              verification are connected.
            </div>

            <button
              className="primary-btn full"
              onClick={() => setSelectedPlan(null)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
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
                <small>ACCOUNT</small>
                <strong>ACTIVE</strong>
              </div>

              <div className="stat-card">
                <small>MEMBER ACCESS</small>
                <strong>GGS</strong>
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
