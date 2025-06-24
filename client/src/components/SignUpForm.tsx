import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; // Assuming a toast hook exists

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Or your preferred notification system

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // This case might indicate that the user already exists but is unconfirmed (if email confirmations are on and user signs up again)
      // Supabase might return a user object but also an error or specific message for this.
      // For now, treating it as a need for confirmation.
      toast({ title: "Confirmation Required", description: "Please check your email to confirm your sign up." });
    } else if (data.session) {
      toast({ title: "Signed Up Successfully", description: "You are now logged in." });
      // Handle successful sign up, e.g. redirect or update app state
      // This might be handled by onAuthStateChange listener in a higher-order component
    } else if (data.user) {
        toast({ title: "Confirmation Required", description: "Please check your email to confirm your sign up." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6 p-8 glass-card rounded-2xl shadow-xl">
      <div>
        <h2 className="text-3xl font-bold text-gradient text-center">Create Account</h2>
        <p className="text-slate-400 text-center mt-2">Enter your details to sign up.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-signup" className="text-slate-300">Email</Label>
        <Input
          id="email-signup"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="modern-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup" className="text-slate-300">Password</Label>
        <Input
          id="password-signup"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6} // Supabase default minimum
          className="modern-input"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full btn-primary-gradient">
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
}
