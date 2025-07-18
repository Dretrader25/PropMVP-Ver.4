import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const SavedSearchesPage: React.FC = () => {
  const savedSearches = [
    {
      id: 1,
      name: "My First Search",
      criteria: "New York, NY | 2-4 Beds | $500k - $1M",
    },
    {
      id: 2,
      name: "Investment Properties",
      criteria: "Austin, TX | Single Family | > 2000 sqft",
    },
    {
      id: 3,
      name: "Vacation Homes",
      criteria: "Miami, FL | Condo | < $750k",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Saved Searches</h1>
      <div className="space-y-4">
        {savedSearches.map((search) => (
          <Card key={search.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{search.name}</CardTitle>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">{search.criteria}</p>
              <div className="mt-4 flex space-x-2">
                <Button>View Results</Button>
                <Button variant="outline">Edit Search</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedSearchesPage;
