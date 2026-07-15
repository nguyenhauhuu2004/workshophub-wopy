import { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Clock, MapPin, ChevronRight, Users } from "lucide-react";
import { WORKSHOPS } from "../data";
import { useApp } from "../contexts/AppContext";

interface BookingState {
  schedule: { date: string; time: string; spotsLeft: number };
  guests: number;
  total: number;
}

export function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const state = location.state as BookingState | null;

  const workshop = WORKSHOPS.find((w) => w.id === Number(id));

  const [form, setForm] = useState({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    notes: "",
  });
  const [guests, setGuests] = useState(state?.guests || 1);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="text-center"><p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-[#0D0D1A] mb-4">Workshop not found</h2>
          <Link to="/workshops"><button className="bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full">Browse Workshops</button></Link>
        </div>
      </div>
    );
  }

  const schedule = state?.schedule || workshop.schedules[selectedIdx];
  const total = workshop.price * guests;
  const serviceFee = Math.round(total * 0.05);
  const grandTotal = total + serviceFee;

  function handleField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleProceed() {
    if (!form.firstName || !form.email) return;
    navigate("/payment", {
      state: {
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        schedule,
        guests,
        total: grandTotal,
        gradient: workshop.gradient,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-16">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to={`/workshop/${workshop.id}`}>
          <motion.button whileHover={{ x: -3 }} className="flex items-center gap-2 text-gray-500 hover:text-[#7C3AED] text-sm font-medium transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Workshop
          </motion.button>
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-[#0D0D1A] mb-10" style={{ fontFamily: "var(--font-display)" }}>
          Complete Your Booking
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT: Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date & guests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-[#0D0D1A] text-lg mb-5">Session Details</h2>

              {!state && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Available Dates</p>
                  <div className="space-y-2">
                    {workshop.schedules.map((s, i) => (
                      <motion.button key={i} onClick={() => setSelectedIdx(i)} whileHover={{ scale: 1.01 }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${selectedIdx === i ? "border-[#7C3AED] bg-violet-50" : "border-gray-100"}`}>
                        <div><p className="font-semibold text-sm text-[#0D0D1A]">{s.date} · {s.time}</p></div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.spotsLeft <= 3 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>{s.spotsLeft} left</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {state && (
                <div className="bg-violet-50 rounded-2xl p-4 mb-5 border border-violet-100">
                  <p className="font-semibold text-[#0D0D1A]">{schedule.date} · {schedule.time}</p>
                  <p className="text-sm text-violet-600 mt-0.5">{schedule.spotsLeft} spots remaining</p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Number of Guests</p>
                <div className="flex items-center gap-4">
                  <motion.button onClick={() => setGuests(Math.max(1, guests - 1))} whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:border-violet-400 hover:text-violet-600 transition-colors">−</motion.button>
                  <span className="text-xl font-bold text-[#0D0D1A] w-8 text-center">{guests}</span>
                  <motion.button onClick={() => setGuests(Math.min(schedule.spotsLeft, guests + 1))} whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:border-violet-400 hover:text-violet-600 transition-colors">+</motion.button>
                  <span className="text-sm text-gray-400">(max {schedule.spotsLeft})</span>
                </div>
              </div>
            </motion.div>

            {/* Attendee info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-[#0D0D1A] text-lg mb-5">Your Information</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { key: "firstName", label: "First Name", type: "text", placeholder: "Alex" },
                  { key: "lastName", label: "Last Name", type: "text", placeholder: "Rivera" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">{f.label}</label>
                    <input type={f.type} value={form[f.key as keyof typeof form]} onChange={(e) => handleField(f.key as keyof typeof form, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                  </div>
                ))}
              </div>
              {[
                { key: "email", label: "Email Address", type: "email", placeholder: "alex@example.com" },
                { key: "phone", label: "Phone Number (optional)", type: "tel", placeholder: "+1 (555) 000-0000" },
              ].map((f) => (
                <div key={f.key} className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]} onChange={(e) => handleField(f.key as keyof typeof form, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Special Requests (optional)</label>
                <textarea value={form.notes} onChange={(e) => handleField("notes", e.target.value)}
                  placeholder="Any dietary restrictions, accessibility needs, or questions for the instructor..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
              </div>
            </motion.div>

            {/* Cancellation policy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
              <h3 className="font-bold text-amber-800 text-sm mb-2">Cancellation Policy</h3>
              <p className="text-amber-700 text-sm leading-relaxed">Free cancellation up to 48 hours before the session. Cancellations within 48 hours receive a 50% credit towards a future booking.</p>
            </motion.div>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
              <h3 className="font-bold text-[#0D0D1A] text-base mb-5">Order Summary</h3>

              {/* Workshop mini card */}
              <div className={`bg-gradient-to-br ${workshop.gradient} rounded-2xl p-4 mb-5 relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-sm" />
                <p className="text-white font-bold text-sm">{workshop.title}</p>
                <p className="text-white/70 text-xs mt-1">{workshop.instructor}</p>
                <div className="flex items-center gap-3 mt-3 text-white/80 text-xs">
                  <span className="flex items-center gap-1"><Star size={10} className="fill-white" />{workshop.rating}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{workshop.duration}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{guests}p</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 text-xs flex items-center justify-center font-bold">📅</span>
                  {schedule.date} · {schedule.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 text-xs flex items-center justify-center">📍</span>
                  {workshop.location.split(",")[0]}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${workshop.price} × {guests}</span><span>${total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service fee (5%)</span><span>${serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-[#0D0D1A] text-base pt-2 border-t border-gray-100">
                  <span>Total</span><span>${grandTotal}</span>
                </div>
              </div>

              <motion.button onClick={handleProceed}
                disabled={!form.firstName || !form.email}
                whileHover={form.firstName && form.email ? { scale: 1.02, boxShadow: "0 12px 40px rgba(124,58,237,0.4)" } : {}}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#7C3AED] text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-violet-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Proceed to Payment <ChevronRight size={18} />
              </motion.button>
              <p className="text-center text-xs text-gray-400 mt-3">Secure checkout · No card charged yet</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
