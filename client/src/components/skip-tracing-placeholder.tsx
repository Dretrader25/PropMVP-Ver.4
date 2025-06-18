import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Lock, Phone, Mail, MapPin, Unlock } from "lucide-react";

export default function SkipTracingPlaceholder() {
  return (
    <Card className="card-bg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-100">
          Owner Information
          <UserCircle className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-slate-400 h-6 w-6" />
          </div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2">Skip Tracing Available</h4>
          <p className="text-slate-400 text-sm mb-4">Upgrade to access owner contact information</p>
          
          <div className="space-y-2 text-left mb-6">
            <div className="flex items-center text-slate-400 text-sm">
              <Phone className="mr-2 h-4 w-4" />
              <span>Phone Numbers</span>
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <Mail className="mr-2 h-4 w-4" />
              <span>Email Addresses</span>
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              <span>Mailing Address</span>
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 hover:scale-105 transition-transform">
            <Unlock className="mr-2 h-4 w-4" />
            Unlock Contact Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
