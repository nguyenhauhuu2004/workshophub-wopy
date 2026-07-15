import { Outlet, ScrollRestoration } from "react-router";
import { NavBar } from "./NavBar";

export function Root() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-body)" }}>
      <ScrollRestoration />
      <NavBar />
      <Outlet />
    </div>
  );
}
