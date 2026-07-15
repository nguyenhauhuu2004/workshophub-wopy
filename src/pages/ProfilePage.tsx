import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { User, Calendar, Heart, Settings, LogOut, MapPin, Star, Clock, ChevronRight, Edit3, Camera } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { WORKSHOPS } from "../data";

type Tab = "upcoming" | "past" | "saved" | "settings";

export function ProfilePage() {
  const { user, logout, saveWorkshop } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("Creative explorer & workshop enthusiast");

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-[#7C3AED]" />
          </div>
          <h2 className="text-2xl font-black text-[#0D0D1A] mb-2" style={{ fontFamily: "var(--font-display)" }}>Sign in to view your profile</h2>
          <p className="text-gray-400 mb-6">Access your bookings, saved workshops, and more.</p>
          <Link to="/login"><button className="bg-[#7C3AED] text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-violet-200">Sign In</button></Link>
        </div>
      </div>
    );
  }

  const upcoming = user.bookings.filter((b) => b.status === "upcoming");
  const past = user.bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
  const savedWorkshops = WORKSHOPS.filter((w) => user.savedWorkshops.includes(w.id));

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "upcoming", label: "Upcoming", icon: <Calendar size={16} />, count: upcoming.length },
    { id: "past", label: "Past", icon: <Clock size={16} />, count: past.length },
    { id: "saved", label: "Saved", icon: <Heart size={16} />, count: savedWorkshops.length },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  const avatarColors = ["from-violet-500 to-purple-600", "from-rose-500 to-pink-500", "from-amber-500 to-orange-400", "from-cyan-500 to-blue-500"];
  const avatarGrad = avatarColors[user.name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-16">
      {/* Profile header */}
      <div className="bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-900/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-fuchsia-900/20 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-3xl font-black shadow-2xl`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <Camera size={14} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 pb-1">
              {editing ? (
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-black text-white bg-transparent border-b border-white/30 outline-none w-full mb-1"
                  style={{ fontFamily: "var(--font-display)" }} />
              ) : (
                <h1 className="text-2xl md:text-3xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>{user.name}</h1>
              )}
              <p className="text-gray-400 text-sm">{user.email}</p>
              {user.isHost && (
                <span className="inline-flex items-center gap-1.5 bg-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  <Star size={11} className="fill-violet-300" /> Verified Host
                </span>
              )}
            </div>
            <button onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded-xl px-4 py-2">
              <Edit3 size={14} /> {editing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="flex gap-8 mt-8 text-center">
            <div><p className="text-2xl font-black text-white">{user.bookings.length}</p><p className="text-gray-400 text-xs">Workshops</p></div>
            <div><p className="text-2xl font-black text-white">{user.savedWorkshops.length}</p><p className="text-gray-400 text-xs">Saved</p></div>
            <div><p className="text-2xl font-black text-white">4.9</p><p className="text-gray-400 text-xs">Avg Rating</p></div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-t border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${tab === t.id ? "border-[#7C3AED] text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
                {t.icon} {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.id ? "bg-[#7C3AED] text-white" : "bg-white/10 text-gray-400"}`}>{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

            {(tab === "upcoming" || tab === "past") && (
              <div className="space-y-4">
                {(tab === "upcoming" ? upcoming : past).length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">{tab === "upcoming" ? "📅" : "📷"}</p>
                    <h3 className="text-xl font-bold text-[#0D0D1A] mb-2">
                      {tab === "upcoming" ? "No upcoming workshops" : "No past workshops yet"}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {tab === "upcoming" ? "Book a workshop to see it here." : "Your completed workshops will appear here."}
                    </p>
                    <Link to="/workshops"><button className="bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full">Explore Workshops</button></Link>
                  </div>
                ) : (
                  (tab === "upcoming" ? upcoming : past).map((booking) => (
                    <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${booking.gradient} shrink-0 relative overflow-hidden`}>
                        <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full bg-white/10 blur-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#0D0D1A] text-base truncate">{booking.workshopTitle}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={13} />{booking.date}</span>
                          <span className="flex items-center gap-1"><Clock size={13} />{booking.time}</span>
                          <span>{booking.guests} {booking.guests > 1 ? "guests" : "guest"}</span>
                        </div>
                        <p className="font-bold text-[#7C3AED] mt-1">${booking.total}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${booking.status === "upcoming" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"}`}>
                          {booking.status === "upcoming" ? "Confirmed" : "Completed"}
                        </span>
                        <Link to={`/workshop/${booking.workshopId}`}>
                          <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors">
                            <ChevronRight size={16} />
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {tab === "saved" && (
              <div>
                {savedWorkshops.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">💜</p>
                    <h3 className="text-xl font-bold text-[#0D0D1A] mb-2">No saved workshops yet</h3>
                    <p className="text-gray-400 mb-6">Tap the heart on any workshop to save it for later.</p>
                    <Link to="/workshops"><button className="bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full">Explore Workshops</button></Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {savedWorkshops.map((w) => (
                      <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                        <div className={`bg-gradient-to-br ${w.gradient} h-36 relative overflow-hidden`}>
                          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-sm" />
                          <button onClick={() => saveWorkshop(w.id)}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                            <Heart size={14} className="text-white fill-white" />
                          </button>
                          <span className="absolute top-3 left-3 bg-black/25 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">{w.category}</span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-[#0D0D1A] mb-1 line-clamp-2">{w.title}</h3>
                          <p className="text-gray-400 text-xs mb-3">{w.instructor}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{w.rating}</span>
                              <span className="flex items-center gap-1"><MapPin size={11} />{w.location.split(",")[0]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#7C3AED] text-sm">${w.price}</span>
                              <Link to={`/workshop/${w.id}`}>
                                <button className="bg-[#7C3AED] text-white text-xs font-semibold px-3 py-1.5 rounded-xl">Book</button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "settings" && (
              <div className="space-y-6 max-w-lg">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-[#0D0D1A] text-base mb-5">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Display Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Email</label>
                      <input value={user.email} readOnly
                        className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-400 bg-gray-50 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Bio</label>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#7C3AED] text-white font-bold py-3 rounded-2xl shadow-lg shadow-violet-200">
                      Save Changes
                    </motion.button>
                  </div>
                </div>

                {user.isHost && (
                  <Link to="/host">
                    <motion.div whileHover={{ y: -2 }}
                      className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-bold">Host Dashboard</p>
                        <p className="text-violet-200 text-sm">Manage your workshops & earnings</p>
                      </div>
                      <ChevronRight size={20} className="text-white/70" />
                    </motion.div>
                  </Link>
                )}

                <motion.button onClick={() => { logout(); navigate("/"); }}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-500 font-semibold rounded-2xl hover:bg-red-50 transition-colors">
                  <LogOut size={16} /> Sign Out
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
