import { AuthForm } from '../components/AuthForm.jsx';

export function AuthPage() {
  return (
    <div className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Secure personal diary SaaS</p>
        <h1>Write with clarity. Review your habits. Keep it private.</h1>
        <p>
          Daily notes, emotional check-ins, tag-based organization, reminders, and analytics in a production-ready journaling stack.
        </p>
      </section>
      <AuthForm />
    </div>
  );
}
