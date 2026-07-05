export default function HomePage({ onStart }) {
  return (
    <div className="container">
      <div className="home-hero">
        <div className="home-signal-anim" aria-hidden="true">
          <div className="home-signal-track">
            <div className="home-signal-dot" />
          </div>
        </div>

        <div className="home-text">
          <h1 className="home-title">
            <span className="text-accent">Link</span>Budget
            <span className="text-muted"> Pro</span>
          </h1>
          <p className="home-desc">
            Outil de dimensionnement pour bilan de liaison hertzienne point-à-point.
            Calculez le FSPL, la puissance reçue, la marge de liaison et obtenez
            une classification instantanée de votre liaison.
          </p>
        </div>

        <button className="btn btn-primary btn-hero" onClick={onStart}>
          Démarrer une simulation
        </button>

        <div className="home-features">
          <FeatureCard title="Saisie des paramètres" desc="Fréquence, distance, puissance, gains d'antennes" />
          <FeatureCard title="Calcul instantané" desc="FSPL, Pr, marge et classification automatique" />
          <FeatureCard title="Graphiques interactifs" desc="Courbes Pr(d) et FSPL(f) avec Recharts" />
          <FeatureCard title="Export PDF" desc="Rapport complet généré côté client" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="card feature-card">
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-desc">{desc}</p>
    </div>
  );
}
