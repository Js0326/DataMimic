import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import noDataImage from "@assets/generated_images/No_data_empty_state_142f2d4e.png";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-8 text-center">
          <img src={noDataImage} alt="404" className="w-32 h-32 mx-auto mb-6 opacity-40" />
          <div className="flex items-center justify-center mb-4 gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
