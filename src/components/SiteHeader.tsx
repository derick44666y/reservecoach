import { Link } from "react-router-dom";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-center px-4">
        <Link to="/" className="font-display text-xl font-bold tracking-wide text-foreground md:text-2xl">
          RESERVE COACH
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
