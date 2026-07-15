import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Star, Clock, Users, MapPin, ArrowLeft, Heart, Share2, CheckCircle, ChevronRight } from "lucide-react";
import { WORKSHOPS } from "../data";
import { useApp } from "../contexts/AppContext";
import { TiltCard } from "../components/TiltCard";

export function WorkshopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, saveWorkshop } = useApp();
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [guests, setGuests] = useState(1);

  const workshop = WORKSHOPS.find((w) => w.id === Number(id));

  if (!workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-[#0D0D1A] mb-4">Workshop not found</h2>
          <Link to="/workshops"><button className="bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full">Browse Workshops</button></Link>
        </div>
      </div>
    );
  }

  const isSaved = user?.savedWorkshops.includes(workshop.id);
  const total = workshop.price * guests;
  const selected = workshop.schedules[selectedSchedule];

  function handleBook() {
    if (!user) { navigate("/login"); return; }
    navigate(`/book/${workshop.id}`, { state: { schedule: selected, guests, total } });
  }

  const related = WORKSHOPS.filter((w) => w.category === workshop.category && w.id !== workshop.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 pt-8 mb-6">
        <Link to="/workshops">
          <motion.button whileHover={{ x: -3 }} className="flex items-center gap-2 text-gray-500 hover:text-[#7C3AED] text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Workshops
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT: Details */}
          <div className="lg:col-span-2">
            {/* Hero artwork */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className={`bg-gradient-to-br ${workshop.gradient} rounded-3xl relative overflow-hidden mb-8`}
              style={{ height: 360 }}>
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-sm" />
              <div className="absolute -left-8 bottom-12 w-40 h-40 rounded-full bg-black/10" />
              <div className="absolute right-8 bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="bg-black/30 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full">{workshop.category}</span>
                <span className="bg-black/30 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full">{workshop.level}</span>
              </div>

              <div className="absolute top-6 right-6 flex items-center gap-2">
                <motion.button onClick={() => user && saveWorkshop(workshop.id)}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Heart size={16} className={isSaved ? "text-red-400 fill-red-400" : "text-white"} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Share2 size={16} className="text-white" />
                </motion.button>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl md:text-3xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {workshop.title}
                </h1>
                <p className="text-white/80 text-sm">with {workshop.instructor}</p>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { icon: <Star size={18} className="text-amber-400" />, label: "Rating", value: `${workshop.rating} (${workshop.reviewCount})` },
                { icon: <Clock size={18} className="text-violet-500" />, label: "Duration", value: workshop.duration },
                { icon: <Users size={18} className="text-cyan-500" />, label: "Group size", value: `Max ${workshop.seatsTotal}` },
                { icon: <MapPin size={18} className="text-rose-500" />, label: "Location", value: workshop.location.split(",")[0] },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</span></div>
                  <p className="font-bold text-[#0D0D1A] text-sm">{s.value}</p>
                </div>
              ))}
            </motion.div>

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
              <h2 className="text-xl font-bold text-[#0D0D1A] mb-4">About This Workshop</h2>
              <p className="text-gray-600 leading-relaxed">{workshop.description}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
              <h2 className="text-xl font-bold text-[#0D0D1A] mb-4">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workshop.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What you'll learn */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-10">
              <h2 className="text-xl font-bold text-[#0D0D1A] mb-4">What You'll Learn</h2>
              <div className="space-y-3">
                {workshop.whatYouLearn.map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Includes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
              <h2 className="text-xl font-bold text-[#0D0D1A] mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-3">
                {workshop.includes.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Instructor */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-10">
              <h2 className="text-xl font-bold text-[#0D0D1A] mb-5">About the Instructor</h2>
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${workshop.instructorAvatar} flex items-center justify-center text-white font-black text-2xl shrink-0`}
                  style={{ fontFamily: "var(--font-display)" }}>
                  {workshop.instructor[0]}
                </div>
                <div>
                  <h3 className="font-bold text-[#0D0D1A] text-base mb-1">{workshop.instructor}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm text-gray-500">{workshop.rating} · {workshop.reviewCount} reviews</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{workshop.instructorBio}</p>
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0D0D1A]">Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-[#0D0D1A]">{workshop.rating}</span>
                  <span className="text-gray-400 text-sm">({workshop.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="space-y-4">
                {workshop.reviews.map((r, i) => (
                  <TiltCard key={i}>
                    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.avatar} flex items-center justify-center text-white font-bold shrink-0`}>{r.name[0]}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-[#0D0D1A] text-sm">{r.name}</h4>
                            <span className="text-xs text-gray-400">{r.date}</span>
                          </div>
                          <div className="flex gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, si) => <Star key={si} size={12} className="text-amber-400 fill-amber-400" />)}</div>
                          <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  </TiltCard>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Booking panel */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-3xl font-black text-[#0D0D1A]" style={{ fontFamily: "var(--font-display)" }}>${workshop.price}</span>
                  <span className="text-gray-400 text-sm ml-2">per person</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-sm text-[#0D0D1A]">{workshop.rating}</span>
                </div>
              </div>

              {/* Schedule picker */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Choose a Date</p>
                <div className="space-y-2">
                  {workshop.schedules.map((s, i) => (
                    <motion.button key={i} onClick={() => setSelectedSchedule(i)}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${selectedSchedule === i ? "border-[#7C3AED] bg-violet-50" : "border-gray-100 hover:border-gray-200"}`}>
                      <div>
                        <p className="font-semibold text-sm text-[#0D0D1A]">{s.date}</p>
                        <p className="text-xs text-gray-400">{s.time}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.spotsLeft <= 3 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {s.spotsLeft} left
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Guests</p>
                <div className="flex items-center gap-4">
                  <motion.button onClick={() => setGuests(Math.max(1, guests - 1))} whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:border-violet-400 hover:text-violet-600 transition-colors">
                    −
                  </motion.button>
                  <span className="text-xl font-bold text-[#0D0D1A] w-8 text-center">{guests}</span>
                  <motion.button onClick={() => setGuests(Math.min(selected?.spotsLeft || 4, guests + 1))} whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:border-violet-400 hover:text-violet-600 transition-colors">
                    +
                  </motion.button>
                  <span className="text-sm text-gray-400 ml-2">person{guests > 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${workshop.price} × {guests} {guests > 1 ? "guests" : "guest"}</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service fee</span>
                  <span>$0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-[#0D0D1A]">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <motion.button onClick={handleBook}
                whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(124,58,237,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#7C3AED] text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-violet-200 flex items-center justify-center gap-2">
                Book Now <ChevronRight size={18} />
              </motion.button>

              <p className="text-center text-xs text-gray-400 mt-3">Free cancellation up to 48 hours before</p>

              {/* Location */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#7C3AED] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm text-gray-700">{workshop.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related workshops */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-[#0D0D1A] mb-8" style={{ fontFamily: "var(--font-display)" }}>
              More {workshop.category} Workshops
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((w) => (
                <Link key={w.id} to={`/workshop/${w.id}`}>
                  <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer">
                    <div className={`bg-gradient-to-br ${w.gradient} h-40 relative`}>
                      <span className="absolute top-3 left-3 bg-black/25 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">{w.category}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#0D0D1A] text-sm mb-1">{w.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="text-xs text-gray-400">{w.rating}</span></div>
                        <span className="text-[#7C3AED] font-bold text-sm">${w.price}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
