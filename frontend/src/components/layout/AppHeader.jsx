import { LogOut, Settings } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

export default function AppHeader({ title, subtitle, actions, compact = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = useMemo(() => user?.nama?.charAt(0)?.toUpperCase() || "U", [user]);

  return (
    <header className={`bg-hero-grid px-4 text-white sm:px-5 md:px-8 ${compact ? "pt-5 pb-5 sm:pt-6 sm:pb-6" : "pt-10 pb-6 sm:pt-12 sm:pb-7 md:pt-14 md:pb-8"}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-bold text-black sm:h-12 sm:w-12 sm:text-lg">
            {initials}
          </div>
          <div>
            <p className="text-base font-bold leading-tight sm:text-xl">{user?.nama || "Student Attendance Tracker"}</p>
            <p className="text-xs text-zinc-400 sm:text-sm">{user?.email || "Attendance Management"}</p>
          </div>
        </div>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
              <Settings className="h-5 w-5" />
            </button>
            <button
              className="hidden h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium md:inline-flex"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">{title}</h1>
          {subtitle ? <p className="max-w-2xl text-xs text-zinc-300 sm:text-sm md:text-base">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
