import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";

const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      read: false,
      title: "New Property Alert",
      message: "A new property matching your saved search 'My First Search' is available.",
      time: "2 hours ago",
    },
    {
      id: 2,
      read: true,
      title: "Price Drop",
      message: "The price of a property in your 'Investment Properties' search has dropped by 10%.",
      time: "1 day ago",
    },
    {
      id: 3,
      read: true,
      title: "Market Update",
      message: "The average home price in Austin, TX has increased by 2% in the last month.",
      time: "3 days ago",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "bg-gray-100" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <CardTitle>{notification.title}</CardTitle>
              </div>
              <div className="text-sm text-gray-500">{notification.time}</div>
            </CardHeader>
            <CardContent>
              <p>{notification.message}</p>
              {!notification.read && (
                <Button variant="outline" size="sm" className="mt-4">
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
