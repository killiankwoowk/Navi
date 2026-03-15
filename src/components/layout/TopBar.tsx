import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, MoreVertical, Search, Settings, User } from "lucide-react";

import { AsciiLogo } from "@/components/common/AsciiLogo";
import { useAuth } from "@/features/auth/useAuth";
import { useViewportMode } from "@/hooks/useViewportMode";
import { useUiStore } from "@/store/uiStore";

export const TopBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const viewportMode = useViewportMode();
  const openSidebar = useUiStore((state) => state.openSidebar);
  const [searchInput, setSearchInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = searchInput.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  if (viewportMode === "mobile") {
    return (
      <header className="terminal-panel mx-2 mt-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              className="terminal-button min-h-11 px-2 py-1"
              onClick={openSidebar}
              type="button"
              aria-label="Open navigation"
            >
              <Menu size={14} />
            </button>
            <div className="text-xs uppercase tracking-[0.16em] text-terminal-accent">
              Kachalar
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="terminal-button min-h-11 px-2 py-1"
              onClick={() => navigate("/search")}
              type="button"
              aria-label="Open search"
            >
              <Search size={14} />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                className="terminal-button min-h-11 px-2 py-1"
                onClick={() => setMenuOpen((value) => !value)}
                type="button"
                aria-label="Open menu"
              >
                <MoreVertical size={14} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 z-30 mt-2 min-w-44 rounded border border-nothing-700 bg-nothing-800 p-1 text-xs shadow-lg">
                  <button
                    className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User size={14} />
                    Profile
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="terminal-panel mx-3 mt-3">
      <div className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="overflow-x-auto border border-terminal-text/20 p-2">
          <AsciiLogo />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {viewportMode === "desktop" ? (
            <form
              className="flex min-w-[240px] items-center gap-2"
              onSubmit={onSubmit}
            >
              <input
                className="terminal-input h-9"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="search artists albums songs"
                aria-label="Global search"
              />
              <button className="terminal-button h-9" type="submit">
                Search
              </button>
            </form>
          ) : (
            <>
              <button
                className="terminal-button min-h-11 px-2 py-1"
                onClick={openSidebar}
                type="button"
                aria-label="Open navigation"
              >
                <Menu size={14} />
                menu
              </button>
              <button
                className="terminal-button min-h-11 px-2 py-1"
                onClick={() => navigate("/search")}
                type="button"
              >
                <Search size={14} />
                search
              </button>
            </>
          )}
          <div className="relative" ref={menuRef}>
            <button
              className="terminal-button min-h-11 px-2 py-1"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              <MoreVertical size={14} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 z-30 mt-2 min-w-44 rounded border border-nothing-700 bg-nothing-800 p-1 text-xs shadow-lg">
                <button
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={14} />
                  Profile
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                >
                  <Settings size={14} />
                  Settings
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
