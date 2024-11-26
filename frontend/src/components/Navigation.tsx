import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileTextIcon, FormInputIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();

  const buttonClasses = (isActive: boolean) => cn(
    "w-32 text-white",
    isActive
      ? "bg-primary hover:bg-primary/90"
      : "hover:bg-primary/80"
  );

  return (
    <nav className="max-w-7xl w-full mx-auto p-4 flex justify-center gap-4">
      <Link to="/">
        <Button
          variant={location.pathname === "/" ? "default" : "ghost"}
          className={buttonClasses(location.pathname === "/")}
        >
          <FileTextIcon className="h-4 w-4 mr-2" />
          JSON Input
        </Button>
      </Link>
      <Link to="/forms">
        <Button
          variant={location.pathname === "/forms" ? "default" : "ghost"}
          className={buttonClasses(location.pathname === "/forms")}
        >
          <FormInputIcon className="h-4 w-4 mr-2" />
          Form Input
        </Button>
      </Link>
    </nav>
  );
}
