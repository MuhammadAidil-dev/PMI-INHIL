import { LoginForm } from '../form/LoginForm';
import { LoginBranding } from '../ui/LoginBranding';

export default function LoginView() {
  return (
    <div className="w-full max-w-250 grid md:grid-cols-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <LoginBranding />
      <LoginForm />
    </div>
  );
}
