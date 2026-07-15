import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Lock, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type { Booking } from "../data";

interface PayState {
  workshopId: number;
  workshopTitle: string;
  schedule: { date: string; time: string };
  guests: number;
  total: number;
  gradient: string;
}

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking } = useApp();
  const state = location.state as PayState;

  const [method, setMethod] = useState<"card" | "wallet">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <p className="text-6xl mb-4">💳</p>
          <h2 className="text-2xl font-bold text-[#0D0D1A] mb-4">No booking found</h2>
          <Link to="/workshops"><button className="bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full">Browse Workshops</button></Link>
        </div>
      </div>
    );
  }

  const discount = couponApplied ? Math.round(state.total * 0.1) : 0;
  const finalTotal = state.total - discount;

  function formatCard(v: string) {
    return v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "");
    if (d.length >= 2) return d.slice(0, 2) + "/" + d.slice(2, 4);
    return d;
  }

  async function handlePay() {
    if (!card.number || !card.expiry || !card.cvv || !card.name) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    const booking: Booking = {
      id: `b${Date.now()}`,
      workshopId: state.workshopId,
      workshopTitle: state.workshopTitle,
      date: state.schedule.date,
      time: state.schedule.time,
      guests: state.guests,
      total: finalTotal,
      status: "upcoming",
      gradient: state.gradient,
    };
    addBooking(booking);
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center pt-16">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-md w-full mx-6 text-center">
          {/* Confetti-like blobs */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {["from-violet-400 to-purple-500", "from-rose-400 to-pink-400", "from-amber-400 to-orange-400", "from-cyan-400 to-blue-400"].map((g, i) => (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                transition={{ delay: i * 0.1, duration: 0.5, y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 } }}
                className={`absolute w-10 h-10 rounded-full bg-gradient-to-br ${g} blur-sm`}
                style={{ top: `${[0, 20, 50, 70][i]}%`, left: `${[10, 60, 5, 65][i]}%` }} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 260 }}
                className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center">
                <CheckCircle size={36} className="text-emerald-500" />
              </motion.div>
            </div>
          </div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-3xl font-black text-[#0D0D1A] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            You're In! 🎉
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-gray-500 mb-2 text-lg">Booking confirmed for</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="font-bold text-[#7C3AED] text-xl mb-6">{state.workshopTitle}</motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Date</span><span className="font-semibold text-[#0D0D1A]">{state.schedule.date} · {state.schedule.time}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Guests</span><span className="font-semibold text-[#0D0D1A]">{state.guests} {state.guests > 1 ? "people" : "person"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Total paid</span><span className="font-bold text-[#7C3AED]">${finalTotal}</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex gap-3">
            <button onClick={() => navigate("/profile")}
              className="flex-1 bg-[#7C3AED] text-white font-bold py-3 rounded-2xl shadow-lg shadow-violet-200">
              View My Bookings
            </button>
            <button onClick={() => navigate("/workshops")}
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl">
              Explore More
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-16">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)}>
          <motion.span whileHover={{ x: -3 }} className="flex items-center gap-2 text-gray-500 hover:text-[#7C3AED] text-sm font-medium transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Booking
          </motion.span>
        </button>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-[#0D0D1A] mb-10" style={{ fontFamily: "var(--font-display)" }}>
          Secure Payment
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Payment form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment method tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-[#0D0D1A] text-lg mb-5">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([["card", <CreditCard size={18} />, "Credit Card"], ["wallet", <Wallet size={18} />, "Digital Wallet"]] as const).map(([m, icon, label]) => (
                  <motion.button key={m} onClick={() => setMethod(m as "card" | "wallet")} whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === m ? "border-[#7C3AED] bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600"}`}>
                    {icon}<span className="font-semibold text-sm">{label}</span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {method === "card" ? (
                  <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Card Number</label>
                      <div className="relative">
                        <input value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                          placeholder="1234 5678 9012 3456" maxLength={19}
                          className="w-full border border-gray-200 rounded-2xl pl-4 pr-12 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all font-mono" />
                        <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Expiry</label>
                        <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                          placeholder="MM/YY" maxLength={5}
                          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">CVV</label>
                        <input value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                          placeholder="•••" maxLength={4} type="password"
                          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Name on Card</label>
                      <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                        placeholder="Alex Rivera"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                    {[["🍎 Apple Pay", "apple"], ["🇬 Google Pay", "google"], ["🅿️ PayPal", "paypal"]].map(([label, key]) => (
                      <motion.button key={key} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:border-violet-300 hover:bg-violet-50/50 transition-all">
                        {label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Coupon */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-[#0D0D1A] text-base mb-4">Have a Coupon?</h2>
              <div className="flex gap-3">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="CRAFT10"
                  className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all font-mono uppercase" />
                <motion.button
                  onClick={() => { if (coupon === "CRAFT10") setCouponApplied(true); }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="bg-[#7C3AED] text-white font-semibold px-5 py-3 rounded-2xl text-sm">
                  Apply
                </motion.button>
              </div>
              {couponApplied && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3 text-emerald-600 text-sm">
                  <CheckCircle size={15} /> 10% discount applied! (use code CRAFT10)
                </motion.div>
              )}
              {!couponApplied && <p className="text-xs text-gray-400 mt-2">Try code <span className="font-mono font-semibold">CRAFT10</span> for 10% off</p>}
            </motion.div>

            {/* Security note */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="flex items-center gap-3 text-gray-500 text-sm">
              <Lock size={16} className="text-emerald-500 shrink-0" />
              <span>Your payment is secured with 256-bit SSL encryption. We never store your card details.</span>
            </motion.div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
              <h3 className="font-bold text-[#0D0D1A] text-base mb-5">Order Summary</h3>

              <div className={`bg-gradient-to-br ${state.gradient} rounded-2xl p-4 mb-5 relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-sm" />
                <p className="text-white font-bold text-sm leading-snug">{state.workshopTitle}</p>
                <p className="text-white/70 text-xs mt-2">{state.schedule.date} · {state.schedule.time}</p>
                <p className="text-white/70 text-xs">{state.guests} {state.guests > 1 ? "guests" : "guest"}</p>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${state.total}</span></div>
                {couponApplied && <div className="flex justify-between text-sm text-emerald-600"><span>Discount (10%)</span><span>−${discount}</span></div>}
                <div className="flex justify-between font-bold text-[#0D0D1A] text-base pt-2 border-t border-gray-100">
                  <span>Total</span><span>${finalTotal}</span>
                </div>
              </div>

              <motion.button onClick={handlePay}
                disabled={loading || (method === "card" && (!card.number || !card.expiry || !card.cvv || !card.name))}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 12px 40px rgba(124,58,237,0.4)" } : {}}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#7C3AED] text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-violet-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <><Lock size={16} /> Pay ${finalTotal}</>
                )}
              </motion.button>
              <p className="text-center text-xs text-gray-400 mt-3">Secured by Stripe · PCI Compliant</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
