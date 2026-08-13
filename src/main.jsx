import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {createClient} from "@supabase/supabase-js";
import "./styles.css";

const supabase=createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
);

const plans=[
 {id:"starter",name:"GOAT STARTER",price:99,desc:"A structured introduction to the GGS community.",items:["Member community","Weekly strategy drops","Pattern journal","Basic live-room access"]},
 {id:"pro",name:"GOAT PRO",price:199,desc:"The full GGS member experience.",items:["Everything in Starter","Live interaction rooms","Educational alerts","Advanced session reviews","Exclusive videos"]},
 {id:"elite",name:"GOAT ELITE",price:399,desc:"Premium access for the most engaged members.",items:["Everything in Pro","Priority Q&A","Private group sessions","Founder content","Premium strategy library"]}
];

function App(){
 const [session,setSession]=useState(null),[profile,setProfile]=useState(null),[view,setView]=useState("home"),[auth,setAuth]=useState("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[name,setName]=useState(""),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");

 useEffect(()=>{
   supabase.auth.getSession().then(({data})=>setSession(data.session));
   const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s)});
   return()=>subscription.unsubscribe()
 },[]);

 useEffect(()=>{if(session?.user) loadProfile(session.user.id)},[session]);

 async function loadProfile(id){
   const {data}=await supabase.from("profiles").select("*").eq("id",id).single();
   setProfile(data)
 }

 async function submitAuth(e){
   e.preventDefault();
   setBusy(true);
   setNotice("");

   try{
    if(auth==="signup"){
      const {error}=await supabase.auth.signUp({
        email,
        password,
        options:{
          data:{display_name:name},
          emailRedirectTo:location.origin
        }
      });

      if(error) throw error;

      setNotice("Account created. Check your email to confirm your account.");
    }else{
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error) throw error;
    }
   }catch(err){
     setNotice(err.message)
   }finally{
     setBusy(false)
   }
 }

 async function logout(){
   await supabase.auth.signOut();
   setView("home");
   setProfile(null)
 }

 function choosePlan(plan){
   if(!session){
     setView("auth");
     setAuth("signup");
     setNotice("Create your GGS account first, then choose your membership.");
     return
   }

   setView("checkout");
   setNotice(plan.name+" selected.");
 }

 const paid=profile?.subscription_status==="active";

 return <div className="app">

  <header>
   <div className="nav wrap">
    <button className="brand" onClick={()=>setView("home")}>
      GGS <span>GAMBLING GOAT SA</span>
    </button>

    <nav>
      <button onClick={()=>setView("home")}>Home</button>
      <button onClick={()=>setView("pricing")}>Membership</button>

      {session&&
        <button onClick={()=>setView(paid?"dashboard":"pricing")}>
          Members
        </button>
      }
    </nav>

    <div>
      {session?
        <button className="outline" onClick={logout}>Log out</button>
        :
        <button className="solid" onClick={()=>{
          setView("auth");
          setAuth("login")
        }}>
          Log in
        </button>
      }
    </div>
   </div>
  </header>

  {view==="home"&&
   <>
    <main className="wrap hero">
     <div>
      <div className="pill">18+ MEMBERSHIP PLATFORM</div>

      <h1>
        GGS.<br/>
        THE GOAT<br/>
        COMMUNITY.
      </h1>

      <p>
        Live interaction, educational game analysis, pattern journaling,
        strategy content and member-only rooms — all behind one secure membership.
      </p>

      <div className="actions">
       <button className="solid big" onClick={()=>setView("pricing")}>
         View Memberships
       </button>

       <button className="outline big" onClick={()=>setView("auth")}>
         Join GGS
       </button>
      </div>
     </div>

     <div className="heroCard">
      <div className="live">
       <i/> LIVE GGS ROOM
      </div>

      <h2>Members only.</h2>

      <div className="metric">
       <b>184</b>
       <span>members online</span>
      </div>

      <div className="metric">
       <b>24/7</b>
       <span>member dashboard</span>
      </div>

      <div className="metric">
       <b>3</b>
       <span>membership levels</span>
      </div>

      <small>
       Signals and patterns are educational observations,
       never guaranteed predictions or promises of profit.
      </small>
     </div>
    </main>

    <section className="wrap section">
     <h2>Inside GGS</h2>

     <div className="features">
      {[
       "🔴 Live interaction rooms",
       "📊 Pattern journal & reviews",
       "📡 Educational alerts",
       "🧠 Strategy library",
       "🎥 Exclusive videos",
       "👤 Private member dashboard"
      ].map(x=>
       <div className="feature" key={x}>
        <h3>{x}</h3>
        <p>
         Members-only content designed around structured analysis,
         discipline and community.
        </p>
       </div>
      )}
     </div>
    </section>
   </>
  }

  {view==="pricing"&&
   <section className="wrap section">
    <div className="center">
     <div className="pill">MEMBERSHIP</div>
     <h2>Choose your level.</h2>
     <p>Subscribe monthly to unlock the private GGS platform.</p>
    </div>

    <div className="pricing">
     {plans.map(p=>
      <div className={"plan "+(p.id==="pro"?"featured":"")} key={p.id}>

       {p.id==="pro"&&
        <span className="popular">MOST POPULAR</span>
       }

       <h3>{p.name}</h3>

       <div className="price">
        R{p.price}<small>/month</small>
       </div>

       <p>{p.desc}</p>

       <ul>
        {p.items.map(i=>
         <li key={i}>✓ {i}</li>
        )}
       </ul>

       <button className="solid full" onClick={()=>choosePlan(p)}>
        Subscribe
       </button>
      </div>
     )}
    </div>
   </section>
  }

  {view==="auth"&&
   <section className="wrap auth">
    <div className="authCard">

     <div className="pill">
      {auth==="login"?"MEMBER LOGIN":"CREATE ACCOUNT"}
     </div>

     <h2>
      {auth==="login"?"Welcome back.":"Join GGS."}
     </h2>

     <form onSubmit={submitAuth}>

      {auth==="signup"&&
       <input
        placeholder="Full name"
        value={name}
        onChange={e=>setName(e.target.value)}
        required
       />
      }

      <input
       type="email"
       placeholder="Email address"
       value={email}
       onChange={e=>setEmail(e.target.value)}
       required
      />

      <input
       type="password"
       placeholder="Password"
       minLength="8"
       value={password}
       onChange={e=>setPassword(e.target.value)}
       required
      />

      <button className="solid full" disabled={busy}>
       {busy?
        "Please wait…":
        auth==="login"?
        "Log in":
        "Create account"
       }
      </button>
     </form>

     {notice&&
      <div className="notice">{notice}</div>
     }

     <button
      className="textBtn"
      onClick={()=>{
       setAuth(auth==="login"?"signup":"login");
       setNotice("")
      }}
     >
      {auth==="login"?
       "Need an account? Sign up":
       "Already have an account? Log in"
      }
     </button>

    </div>
   </section>
  }

  {view==="checkout"&&
   <section className="wrap auth">
    <div className="authCard wide">

     <div className="pill">SECURE CHECKOUT</div>

     <h2>Membership payment</h2>

     <p>
      Your account is ready. The payment button below is the
      integration point for your Payfast subscription checkout.
     </p>

     <div className="notice">
      To activate real recurring payments, add your Payfast merchant
      credentials and notification endpoint from the setup guide
      included with this project.
     </div>

     <div className="checkoutRow">
      <button
       className="solid"
       onClick={()=>
        alert(
         "Payfast checkout is not connected yet. Add your merchant credentials and backend notify URL first."
        )
       }
      >
       Continue to Payfast
      </button>

      <button className="outline" onClick={()=>setView("pricing")}>
       Change plan
      </button>
     </div>

    </div>
   </section>
  }

  {view==="dashboard"&&
   <section className="wrap section">

    <div className="dashHead">
     <div>
      <div className="pill">MEMBERS ONLY</div>

      <h2>
       Welcome to GGS
       {profile?.display_name?
        `, ${profile.display_name}`:
        ""
       }.
      </h2>
     </div>

     <span className="status">● ACTIVE</span>
    </div>

    <div className="dashGrid">

     <div className="panel">
      <h3>🔴 Live Interaction</h3>
      <p>
       Private live-room access. Connect your real-time chat provider here.
      </p>
      <button className="solid">Enter live room</button>
     </div>

     <div className="panel">
      <h3>📡 Signals & Alerts</h3>
      <p>
       Educational watch conditions and session notes.
      </p>
      <button className="outline">Open alerts</button>
     </div>

     <div className="panel">
      <h3>📊 Pattern Journal</h3>
      <p>
       Historical observations and member session reviews.
      </p>
      <button className="outline">Open journal</button>
     </div>

     <div className="panel">
      <h3>🧠 Strategy Library</h3>
      <p>
       Bankroll discipline, session planning and educational lessons.
      </p>
      <button className="outline">Browse library</button>
     </div>

    </div>

    <div className="warning">
     GGS content is educational. Gambling outcomes are uncertain.
     No pattern, signal, strategy or multiplier claim guarantees a
     win or profit. Never chase losses.
    </div>

   </section>
  }

  <footer>
   <div className="wrap">
    <b>GGS — Gambling GOAT SA</b>
    <span>More than just a brand. It's a lifestyle.</span>

    <p>
     18+ only where legally permitted. Gambling involves financial risk.
     GGS does not guarantee wins or future gambling outcomes.
    </p>
   </div>
  </footer>

 </div>
}

createRoot(document.getElementById("root")).render(<App/>);import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./styles.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
);

const plans = [
  {
    name: "GOAT STARTER",
    price: 99,
    description: "A structured introduction to the GGS community.",
    features: [
      "GGS community access",
      "Educational content",
      "Responsible gambling resources",
      "Member updates"
    ]
  },
  {
    name: "GOAT PRO",
    price: 199,
    description: "The full GGS membership experience.",
    features: [
      "Everything in Starter",
      "Premium educational content",
      "Exclusive community",
      "Strategy discussions",
      "Monthly member content"
    ]
  },
  {
    name: "GOAT ELITE",
    price: 399,
    description: "Premium access for serious members.",
    features: [
      "Everything in Pro",
      "Elite community",
      "Exclusive content",
      "Advanced bankroll education",
      "Priority member updates"
    ]
  }
];

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          if (session?.user) loadProfile(session.user.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!error) setProfile(data);
  }

  async function handleAuth(e) {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setMessage("Welcome back to GGS.");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        setMessage(
          "Account created. Check your email if email confirmation is enabled."
        );
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    setMessage("You have been logged out.");
  }

  function choosePlan(plan) {
    if (!session) {
      setAuthMode("signup");
      document
        .getElementById("membership")
        ?.scrollIntoView({ behavior: "smooth" });

      setMessage("Create an account first to continue.");
      return;
    }

    setSelectedPlan(plan);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="logo-mark">GGS</div>
        <p>Loading Gambling Goat SA...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">G</span>
          <span>
            <strong>GGS</strong>
            <small>Gambling Goat SA</small>
          </span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#membership">Membership</a>
          <a href="#responsible">Responsible Gambling</a>
        </nav>

        <div className="nav-actions">
          {session ? (
            <button className="outline-btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <a href="#membership" className="outline-btn">
              Login / Join
            </a>
          )}
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="badge">🇿🇦 BUILT IN SOUTH AFRICA</div>

            <h1>
              GAMBLING
              <br />
              <span>GOAT SA</span>
            </h1>

            <p className="hero-subtitle">
              More than just a brand.
              <br />
              <strong>It's a lifestyle.</strong>
            </p>

            <p className="hero-text">
              GGS is a community focused on gambling education, discipline,
              bankroll awareness and personal growth.
            </p>

            <div className="hero-buttons">
              <a href="#membership" className="primary-btn">
                JOIN GGS
              </a>

              <a href="#about" className="secondary-btn">
                LEARN MORE
              </a>
            </div>

            <p className="warning">
              18+ only. Gambling involves financial risk. No strategy can
              guarantee winnings.
            </p>
          </div>

          <div className="hero-card">
            <div className="goat-symbol">🐐</div>
            <div className="card-label">GGS</div>
            <div className="card-title">GAMBLING GOAT</div>
            <div className="card-country">SOUTH AFRICA</div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-heading">
            <span>01</span>
            <h2>THE GGS MINDSET</h2>
          </div>

          <div className="feature-grid">
            <article className="feature">
              <div className="feature-icon">🧠</div>
              <h3>KNOWLEDGE</h3>
              <p>
                Learn about probability, bankroll management, risk and the
                psychology behind gambling.
              </p>
            </article>

            <article className="feature">
              <div className="feature-icon">📊</div>
              <h3>DISCIPLINE</h3>
              <p>
                Build a structured approach instead of chasing losses or
                believing that wins are guaranteed.
              </p>
            </article>

            <article className="feature">
              <div className="feature-icon">💰</div>
              <h3>BANKROLL</h3>
              <p>
                Understand the difference between entertainment money and
                money needed for everyday life.
              </p>
            </article>

            <article className="feature">
              <div className="feature-icon">🤝</div>
              <h3>COMMUNITY</h3>
              <p>
                Connect with members who are interested in responsible
                gambling education and personal development.
              </p>
            </article>
          </div>
        </section>

        <section id="membership" className="section membership-section">
          <div className="section-heading">
            <span>02</span>
            <h2>CHOOSE YOUR MEMBERSHIP</h2>
          </div>

          {message && <div className="message">{message}</div>}

          {!session && (
            <div className="auth-box">
              <div className="auth-tabs">
                <button
                  className={authMode === "login" ? "active" : ""}
                  onClick={() => setAuthMode("login")}
                >
                  LOGIN
                </button>

                <button
                  className={authMode === "signup" ? "active" : ""}
                  onClick={() => setAuthMode("signup")}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <form onSubmit={handleAuth}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="primary-btn full">
                  {authMode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
                </button>
              </form>
            </div>
          )}

          {session && (
            <div className="welcome-box">
              <span className="online-dot"></span>
              <div>
                <strong>Welcome to GGS</strong>
                <p>
                  {profile?.username ||
                    session.user.email ||
                    "GGS Member"}
                </p>
              </div>
            </div>
          )}

          <div className="plans">
            {plans.map((plan, index) => (
              <article
                className={`plan ${index === 1 ? "featured" : ""}`}
                key={plan.name}
              >
                {index === 1 && <div className="popular">MOST POPULAR</div>}

                <h3>{plan.name}</h3>

                <div className="price">
                  <small>R</small>
                  {plan.price}
                  <span>/month</span>
                </div>

                <p>{plan.description}</p>

                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <button
                  className={
                    index === 1 ? "primary-btn full" : "secondary-btn full"
                  }
                  onClick={() => choosePlan(plan)}
                >
                  SELECT PLAN
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="responsible" className="responsible">
          <div className="responsible-inner">
            <div className="responsible-icon">⚠️</div>

            <div>
              <span className="eyebrow">PLAY RESPONSIBLY</span>
              <h2>GAMBLING IS NOT A GUARANTEED INCOME.</h2>

              <p>
                GGS does not promise winnings, guaranteed signals or
                guaranteed profits. Never gamble with money you need for
                rent, food, transport, debt or your family.
              </p>

              <p>
                Set limits, take breaks and never chase losses. If gambling
                is becoming difficult to control, seek professional help.
              </p>
            </div>
          </div>
        </section>

        <section className="story section">
          <div className="section-heading">
            <span>03</span>
            <h2>THE GGS STORY</h2>
          </div>

          <div className="story-card">
            <div className="story-number">GGS</div>

            <div>
              <h2>GREED VS PROFIT</h2>

              <p>
                Every gambler learns the same lesson eventually: winning is
                not the same as keeping money. GGS was created around the
                mindset of learning from both sides — the wins and the
                losses.
              </p>

              <p>
                The goal is not to sell dreams. The goal is to build
                knowledge, discipline and a stronger relationship with risk.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <strong>GGS — Gambling Goat SA</strong>
          <span>More than just a brand. It's a lifestyle.</span>
        </div>

        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#membership">Membership</a>
          <a href="#responsible">Responsible Gambling</a>
        </div>

        <p>© {new Date().getFullYear()} GGS Gambling Goat SA</p>
      </footer>

      {selectedPlan && (
        <div className="modal-backdrop">
          <div className="modal">
            <button
              className="close"
              onClick={() => setSelectedPlan(null)}
            >
              ×
            </button>

            <div className="modal-goat">🐐</div>

            <h2>{selectedPlan.name}</h2>

            <div className="modal-price">
              R{selectedPlan.price}
              <span>/month</span>
            </div>

            <p>
              You selected the {selectedPlan.name} membership.
            </p>

            <p className="modal-note">
              Payment processing is not connected yet. Add your approved
              payment provider before accepting real payments.
            </p>

            <button
              className="primary-btn full"
              onClick={() => setSelectedPlan(null)}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
