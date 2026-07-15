import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Heart } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const { scrollYProgress } = useScroll();
  const navBgHome = useTransform(scrollYProgress, [0, 0.04], ["rgba(250,250,247,0)", "rgba(250,250,247,0.94)"]);
  const navBorderHome = useTransform(scrollYProgress, [0, 0.04], ["rgba(0,0,0,0)", "rgba(0,0,0,0.06)"]);

  const navStyle = isHome
    ? { backgroundColor: navBgHome, borderBottomColor: navBorderHome }
    : { backgroundColor: "rgba(250,250,247,0.96)", borderBottomColor: "rgba(0,0,0,0.06)" };

  const links = [
    { label: "Explore", href: "/workshops" },
    { label: "Categories", href: "/#categories" },
    { label: "Hosts", href: "/#hosts" },
    { label: "About", href: "/#about" },
  ];

  function handleLogout() {
    logout();
    setDropOpen(false);
    navigate("/");
  }

  return (
    <motion.nav
      style={navStyle}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <motion.span whileHover={{ scale: 1.03 }}
            className="text-4xl font-black text-[#0D0D1A] tracking-tight cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}>
            Wo<span className="text-[#7C3AED]">Py</span>
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.label} to={l.href}>
              <motion.span whileHover={{ color: "#7C3AED" }}
                className="text-sm font-medium text-gray-500 transition-colors cursor-pointer">
                {l.label}
              </motion.span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setDropOpen(!dropOpen)}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-3 py-1 shadow-sm">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${user.avatar} flex items-center justify-center text-white text-xs font-bold`}>
                  {user.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </motion.button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden p-2">
                    <Link to="/profile" onClick={() => setDropOpen(false)}>
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
                        <User size={15} className="text-gray-400" /> My Profile
                      </button>
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)}>
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
                        <Heart size={15} className="text-gray-400" /> Saved Workshops
                      </button>
                    </Link>
                    {user.isHost && (
                      <Link to="/host" onClick={() => setDropOpen(false)}>
                        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
                          <LayoutDashboard size={15} className="text-gray-400" /> Host Dashboard
                        </button>
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-red-500">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.03 }}
                  className="text-sm font-medium text-gray-600 px-4 py-2">
                  Sign In
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(124,58,237,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#7C3AED] text-white text-sm font-semibold px-5 py-2.5 rounded-full">
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>

        <motion.button whileTap={{ scale: 0.92 }} onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700">
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 overflow-hidden">
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <Link key={l.label} to={l.href} onClick={() => setOpen(false)}>
                  <span className="text-sm font-medium text-gray-700">{l.label}</span>
                </Link>
              ))}
              {user ? (
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="text-sm font-medium text-red-500 text-left">
                  Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="bg-[#7C3AED] text-white text-sm font-semibold px-5 py-2.5 rounded-full w-full">
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
