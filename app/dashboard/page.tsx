export default function DashboardPlaceholderPage() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-panel">
        <div className="dashboard-panel__title">
          <h1>Dashboard du site</h1>
          <span>
            Le dashboard complet est disponible dans l’application locale Vite.
          </span>
        </div>
        <a className="dashboard-add" href="/dashboard">
          Ouvrir le dashboard
        </a>
      </section>
    </main>
  );
}
