import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const initialRegister = {
  fullName: '',
  email: '',
  password: '',
  pin: ''
};

const initialLogin = {
  email: '',
  password: ''
};

export function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('register');
  const [form, setForm] = useState(initialRegister);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'register') {
        await register({
          ...form,
          pin: form.pin || undefined
        });
      } else {
        await login(form);
      }
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setForm(nextMode === 'register' ? initialRegister : initialLogin);
  }

  return (
    <div className="auth-card">
      <div className="auth-card__tabs">
        <button className={mode === 'register' ? 'is-active' : ''} type="button" onClick={() => switchMode('register')}>
          Create account
        </button>
        <button className={mode === 'login' ? 'is-active' : ''} type="button" onClick={() => switchMode('login')}>
          Sign in
        </button>
      </div>

      <form className="auth-card__form" onSubmit={onSubmit}>
        {mode === 'register' && (
          <label>
            Full name
            <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input
            type="password"
            minLength={8}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {mode === 'register' && (
          <label>
            4-digit lock PIN
            <input value={form.pin} onChange={(event) => setForm({ ...form, pin: event.target.value })} pattern="\d{4}" />
          </label>
        )}
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit">{mode === 'register' ? 'Start journaling' : 'Continue'}</button>
      </form>
    </div>
  );
}
