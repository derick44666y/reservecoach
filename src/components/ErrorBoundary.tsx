import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h1 className="mt-4 font-display text-xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-center font-body text-sm text-muted-foreground">
            We’re sorry. Please try refreshing the page. If the problem continues, contact us.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="font-body text-sm"
            >
              Refresh page
            </Button>
            <Link to="/">
              <Button className="font-body text-sm">Back to home</Button>
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
