import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-gray-500">johndoe@example.com</p>
      </div>
      <div className="mt-8 space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" defaultValue="John" />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" defaultValue="Doe" />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" defaultValue="I am a software engineer." />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" defaultValue="https://example.com" />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" defaultValue="https://linkedin.com/in/johndoe" />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter</Label>
          <Input id="twitter" defaultValue="https://twitter.com/johndoe" />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
