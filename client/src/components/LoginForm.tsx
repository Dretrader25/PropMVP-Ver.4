import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; // Assuming a toast hook exists

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Or your preferred notification system

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({ title: "Login Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logged In Successfully", description: "Welcome back!" });
      // Handle successful login, e.g. redirect or update app state
      // This is typically handled by an onAuthStateChange listener in a higher-order component
      // For example, router might redirect to dashboard.
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 p-8 glass-card rounded-2xl shadow-xl">
      <div>
        <h2 className="text-3xl font-bold text-gradient text-center">Welcome Back</h2>
        <p className="text-slate-400 text-center mt-2">Sign in to access your dashboard.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-login" className="text-slate-300">Email</Label>
        <Input
          id="email-login"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="modern-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-login" className="text-slate-300">Password</Label>
        <Input
          id="password-login"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="modern-input"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full btn-primary-gradient">
        {loading ? 'Logging In...' : 'Login'}
      </Button>
    </form>
  );
}
