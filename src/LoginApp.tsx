import { AuthScreen } from './components/auth/AuthScreen';

export default function LoginApp({ onComplete }: { onComplete: () => void }) {
  return <AuthScreen onComplete={onComplete} />;
}
