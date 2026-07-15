import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Star, MapPin, Clock, Users, Zap, Shield, Heart, Sparkles,
  ArrowRight, Instagram, Twitter, Youtube, Mail,
  Palette, Camera, ChefHat, Music2, Coffee, Flower2, Hammer,
  Globe, BookOpen, Scissors, TrendingUp, CheckCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { TiltCard } from "../components/TiltCard";
import { WORKSHOPS, CATEGORIES } from "../data";

// ─── WORKSHOP CARD ────────────────────────────────────────────────────────────

function WorkshopCard({ w }: { w: (typeof WORKSHOPS)[0] }) {
  return (
    <div className="mb-6">
      <TiltCard>
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-white shadow-md shadow-black/6 group cursor-pointer"
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <Link to={`/workshop/${w.id}`}>
            <div className={`bg-gradient-to-br ${w.gradient} relative overflow-hidden`}
              style={{ height: w.tall ? 300 : 200 }}>
              <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 blur-sm" />
              <div className="absolute -left-6 bottom-8 w-28 h-28 rounded-full bg-black/10" />
              <div className="absolute right-6 bottom-6 w-16 h-16 rounded-full bg-white/15 blur-md" />
              <span className="absolute top-4 left-4 bg-black/25 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                {w.category}
              </span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                <span className="bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full text-sm shadow-lg">
                  View Details →
                </span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-[#0D0D1A] text-sm leading-snug pr-2">{w.title}</h3>
                <span className="text-[#7C3AED] font-bold text-sm shrink-0">${w.price}</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">{w.instructor}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{w.rating}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{w.duration}</span>
                <span className="flex items-center gap-1"><Users size={11} />{w.seats} left</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </TiltCard>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

const CAT_ICONS: Record<string, React.ReactNode> = {
  Pottery: <Palette size={20} />, Photography: <Camera size={20} />,
  Cooking: <ChefHat size={20} />, Baking: <Coffee size={20} />,
  Music: <Music2 size={20} />, Floral: <Flower2 size={20} />,
  Woodwork: <Hammer size={20} />, Art: <Palette size={20} />,
  DIY: <Scissors size={20} />, Handmade: <Heart size={20} />,
  "Book Arts": <BookOpen size={20} />,
};

const CAT_POSITIONS = [
  { top: "8%", left: "8%", size: 122 }, { top: "2%", left: "30%", size: 102 },
  { top: "4%", left: "52%", size: 142 }, { top: "0%", left: "75%", size: 112 },
  { top: "44%", left: "0%", size: 132 }, { top: "40%", left: "24%", size: 108 },
  { top: "44%", left: "47%", size: 122 }, { top: "40%", left: "70%", size: 104 },
  { top: "73%", left: "8%", size: 112 }, { top: "72%", left: "32%", size: 132 },
  { top: "73%", left: "60%", size: 102 },
];

const FEATURES = [
  { title: "Discover Nearby", desc: "Find creative workshops right in your neighborhood.", icon: <MapPin size={22} />, accent: "#8B5CF6" },
  { title: "Instant Booking", desc: "Reserve your spot in seconds with one-click checkout.", icon: <Zap size={22} />, accent: "#F97316" },
  { title: "Secure Payments", desc: "Industry-grade encryption protects every transaction.", icon: <Shield size={22} />, accent: "#10B981" },
  { title: "Ratings & Reviews", desc: "Real feedback from real participants guides your choice.", icon: <Star size={22} />, accent: "#F59E0B" },
  { title: "Workshop Tools", desc: "A powerful host dashboard to manage all your classes.", icon: <BookOpen size={22} />, accent: "#06B6D4" },
  { title: "AI Search", desc: "Personalized suggestions tuned to your creative taste.", icon: <Sparkles size={22} />, accent: "#EC4899" },
  { title: "Community Events", desc: "Join meetups and seasonal creative festivals.", icon: <Users size={22} />, accent: "#22D3EE" },
  { title: "Global Reach", desc: "Explore workshops from cities across the globe.", icon: <Globe size={22} />, accent: "#A78BFA" },
];

const TESTIMONIALS = [
  { name: "Sarah M.", role: "Pottery Enthusiast", quote: "I found my favorite hobby here. The instructors are world-class and the experience felt like discovering a new part of myself.", rating: 5, grad: "from-violet-400 to-purple-500", rotation: "-2deg" },
  { name: "James K.", role: "Photography Student", quote: "Booked three workshops in a month. The quality is consistently exceptional and the booking process is seamless.", rating: 5, grad: "from-cyan-400 to-blue-500", rotation: "1.5deg" },
  { name: "Priya R.", role: "Home Chef", quote: "The cooking classes transformed how I think about food. Worth every penny — and I've met lifelong friends.", rating: 5, grad: "from-amber-400 to-orange-500", rotation: "-1deg" },
  { name: "Lucas B.", role: "Woodworking Hobbyist", quote: "As someone who had never touched a saw before, the instructors made me feel capable and inspired from day one.", rating: 5, grad: "from-emerald-400 to-teal-500", rotation: "3deg" },
];

const JOURNEY = [
  { step: "01", title: "Discover", desc: "Browse hundreds of creative workshops near you or across the world.", color: "#8B5CF6" },
  { step: "02", title: "Explore", desc: "Meet instructors, view galleries, and read community reviews.", color: "#F97316" },
  { step: "03", title: "Book", desc: "Reserve your spot instantly with frictionless one-click booking.", color: "#10B981" },
  { step: "04", title: "Attend", desc: "Show up, create, and connect with fellow makers and artists.", color: "#06B6D4" },
  { step: "05", title: "Share", desc: "Post your creations and inspire the next wave of makers.", color: "#EC4899" },
];

const EARNINGS_DATA = [
  { month: "Jan", amount: 1200 }, { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 2600 }, { month: "Apr", amount: 2200 },
  { month: "May", amount: 3400 }, { month: "Jun", amount: 4100 },
];

const MARQUEE_ITEMS = [
  "Pottery", "Photography", "Cooking", "Baking", "Floral Design",
  "Woodworking", "Painting", "Music", "Handmade", "DIY", "Coffee Art", "Calligraphy",
];

function HeroSection() {
  const today = [
    { title: "Wheel Throwing", time: "2:00 PM", spots: 3 },
    { title: "French Cooking", time: "4:00 PM", spots: 6 },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FAFAF7] flex items-center">
      {/* Static gradient blobs — no animation loop */}
      <div className="absolute -top-32 right-0 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-violet-300 to-purple-500 opacity-[0.18] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-rose-300 to-orange-300 opacity-[0.16] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full grid lg:grid-cols-5 gap-16 items-center">
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-violet-100 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-[#7C3AED]">2,400+ workshops live this week</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="leading-none mb-6" style={{ fontFamily: "var(--font-display)" }}>
            <span className="block text-[clamp(3.5rem,9vw,7.5rem)] font-black text-[#0D0D1A]">Where</span>
            <span className="block text-[clamp(3.5rem,9vw,7.5rem)] font-black bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Creativity
            </span>
            <span className="block text-[clamp(3.5rem,9vw,7.5rem)] font-black text-[#0D0D1A]">Lives.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed">
            Discover and book handcrafted workshops — from pottery to pastry, photography to floral design. Every class is an experience.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-4">
            <Link to="/workshops">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(124,58,237,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full text-base flex items-center gap-2 shadow-lg shadow-violet-200">
                Explore Workshops <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/login?mode=host">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "#F4F0FF" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white border border-gray-200 text-[#0D0D1A] font-semibold px-8 py-4 rounded-full text-base shadow-sm">
                Become a Host
              </motion.button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex items-center gap-6 mt-12">
            <div className="flex -space-x-3">
              {["from-violet-400 to-purple-500", "from-rose-400 to-pink-500", "from-amber-400 to-orange-500", "from-cyan-400 to-blue-500"].map((g, i) => (
                <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} border-2 border-white`} />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-bold text-[#0D0D1A]">48,000+</span> happy makers
              <span className="mx-2">·</span>
              <span className="font-bold text-[#0D0D1A]">4.9★</span> avg rating
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 relative h-[520px] hidden lg:block">
          {/* Panels — entrance only, no infinite loops */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="absolute top-0 right-0 w-72 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/80 p-5 shadow-xl shadow-black/5"
            style={{ transform: "rotate(3deg)" }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Today's Workshops</p>
            {today.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#0D0D1A]">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.time}</p>
                </div>
                <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">{t.spots} spots</span>
              </div>
            ))}
            <Link to="/workshops">
              <motion.button whileHover={{ scale: 1.02 }}
                className="mt-4 w-full bg-[#7C3AED] text-white text-sm font-semibold py-2.5 rounded-2xl">
                View All Today
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute top-52 left-0 w-60 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/80 p-5 shadow-xl shadow-black/5"
            style={{ transform: "rotate(-4deg)" }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Popular</p>
            <div className="flex flex-wrap gap-2">
              {["Pottery", "Cooking", "Photography", "Floral"].map((c) => (
                <Link key={c} to={`/workshops?category=${c}`}>
                  <span className="bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-800 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity">{c}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="absolute bottom-0 right-8 w-56 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/80 p-4 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0D0D1A]">23 Nearby</p>
                <p className="text-xs text-gray-400">Within 5 miles</p>
              </div>
            </div>
          </motion.div>

          {/* Decorative blobs — CSS animation only, no JS loop */}
          <div className="absolute top-40 right-28 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 opacity-40 blur-xl pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute bottom-32 left-16 w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 opacity-40 blur-lg pointer-events-none animate-[pulse_5s_ease-in-out_infinite_1s]" />
        </div>
      </div>
    </section>
  );
}

function MarqueeSection() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden bg-[#0D0D1A] py-4">
      <motion.div animate={{ x: [0, "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-white/40 text-sm font-medium tracking-widest uppercase flex items-center gap-12">
            {item}<span className="text-[#7C3AED] leading-none text-lg">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-32 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="text-xs font-bold tracking-widest uppercase text-[#7C3AED] mb-3">Platform</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-[#0D0D1A] leading-none" style={{ fontFamily: "var(--font-display)" }}>Everything You Need</h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">A complete ecosystem built for curious makers and passionate hosts.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>
              <TiltCard>
                <motion.div whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }} transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm h-full cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white" style={{ backgroundColor: f.accent }}>{f.icon}</div>
                  <h3 className="font-bold text-[#0D0D1A] mb-2 text-base">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section id="categories" className="py-32 bg-[#F5F0EA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-[#7C3AED] mb-3">Categories</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-[#0D0D1A] leading-none" style={{ fontFamily: "var(--font-display)" }}>Browse by Passion</h2>
        </motion.div>
        <div className="relative w-full" style={{ height: 580 }}>
          {CATEGORIES.map((cat, i) => {
            const pos = CAT_POSITIONS[i] || { top: "50%", left: "50%", size: 110 };
            return (
              <div key={cat.name} style={{ position: "absolute", top: pos.top, left: pos.left }}>
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, type: "spring", stiffness: 220 }}>
                  <Link to={`/workshops?category=${cat.name}`}>
                    <motion.div whileHover={{ scale: 1.14, y: -6 }} whileTap={{ scale: 0.93 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className={`bg-gradient-to-br ${cat.grad} rounded-full flex flex-col items-center justify-center gap-2 text-white cursor-pointer shadow-xl ${cat.glow} shadow-lg`}
                      style={{ width: pos.size, height: pos.size }}>
                      {CAT_ICONS[cat.name] || <Palette size={20} />}
                      <span className="text-xs font-bold">{cat.name}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section className="py-32 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#7C3AED] mb-3">Workshops</p>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-[#0D0D1A] leading-none" style={{ fontFamily: "var(--font-display)" }}>Featured Today</h2>
          </div>
          <Link to="/workshops">
            <motion.button whileHover={{ scale: 1.04, x: 4 }} className="flex items-center gap-2 text-[#7C3AED] font-semibold text-sm">
              View All <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 640: 2, 1024: 3 }}>
          {/* @ts-ignore */}
          <Masonry gutter="24px">
            {WORKSHOPS.map((w) => <WorkshopCard key={w.id} w={w} />)}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="py-32 bg-[#0D0D1A] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-900/25 blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-3">Journey</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-white leading-none" style={{ fontFamily: "var(--font-display)" }}>Your Creative Path</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 2 600" preserveAspectRatio="none">
              <motion.line x1="1" y1="0" x2="1" y2="600" stroke="url(#jg)" strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeInOut" }} />
              <defs><linearGradient id="jg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" /><stop offset="50%" stopColor="#EC4899" /><stop offset="100%" stopColor="#F97316" />
              </linearGradient></defs>
            </svg>
          </div>
          {JOURNEY.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-center mb-16 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <TiltCard className="flex-1 md:max-w-xs">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:bg-white/8 transition-colors">
                  <span className="text-5xl font-black opacity-20 block mb-3" style={{ fontFamily: "var(--font-display)", color: step.color }}>{step.step}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </TiltCard>
              <div className="hidden md:flex mx-8 relative z-10">
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                  className="w-5 h-5 rounded-full border-2 border-white/20 flex items-center justify-center" style={{ backgroundColor: step.color }}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
              </div>
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#FAFAF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <p className="text-xs font-bold tracking-widest uppercase text-[#7C3AED] mb-3">Community</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-[#0D0D1A] leading-none" style={{ fontFamily: "var(--font-display)" }}>Makers Love Us</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <TiltCard>
                <motion.div whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-white rounded-3xl p-6 border border-black/5 shadow-md cursor-pointer"
                  style={{ transform: `rotate(${t.rotation})` }}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.grad} mb-5 flex items-center justify-center text-white font-bold text-lg`}>{t.name[0]}</div>
                  <div className="flex gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, si) => <Star key={si} size={13} className="text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                  <div><p className="font-bold text-[#0D0D1A] text-sm">{t.name}</p><p className="text-gray-400 text-xs">{t.role}</p></div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HostSection() {
  return (
    <section id="hosts" className="py-32 bg-gradient-to-br from-[#F4F0FF] via-[#FAF8FF] to-[#FAFAF7] relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-200/50 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-bold tracking-widest uppercase text-[#7C3AED] mb-3">For Hosts</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#0D0D1A] leading-none mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Turn Your Passion<br /><span className="text-[#7C3AED]">Into Income</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-gray-500 text-lg leading-relaxed mb-8">List your workshop in minutes, set your own schedule, and reach thousands of eager students.</motion.p>
            <motion.ul initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-3 mb-10">
              {["Zero upfront costs — list for free", "Powerful booking & payment tools", "Analytics dashboard with earnings insights", "Community of 48,000+ active learners"].map((b) => (
                <li key={b} className="flex items-center gap-3 text-gray-600 text-sm"><CheckCircle size={16} className="text-emerald-500 shrink-0" />{b}</li>
              ))}
            </motion.ul>
            <Link to="/login?mode=host">
              <motion.button initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(124,58,237,0.35)" }} whileTap={{ scale: 0.97 }}
                className="bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full text-base flex items-center gap-2 shadow-lg shadow-violet-200">
                Start Hosting Today <ArrowRight size={18} />
              </motion.button>
            </Link>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "Total Paid Out", display: "$4.2M+" }, { label: "Workshops Hosted", display: "12K+" }, { label: "Satisfaction Rate", display: "98%" }, { label: "Cities Covered", display: "240+" }].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                  <p className="text-2xl font-black text-[#0D0D1A]" style={{ fontFamily: "var(--font-display)" }}>{s.display}</p>
                  <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div><p className="font-bold text-[#0D0D1A] text-base">Monthly Earnings</p><p className="text-gray-400 text-xs">Sample host dashboard</p></div>
                <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-semibold"><TrendingUp size={15} /> +41%</div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={EARNINGS_DATA} barSize={28}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Earnings"]} />
                  <Bar dataKey="amount" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = {
    Platform: ["Explore Workshops", "Become a Host", "Gift Cards", "Pricing"],
    Company: ["About Us", "Careers", "Blog", "Press"],
    Support: ["Help Center", "Safety", "Contact", "Accessibility"],
  };
  return (
    <footer className="relative bg-[#0D0D1A] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path d="M0,0 C360,80 1080,0 1440,60 L1440,0 Z" fill="#F5F0EA" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet-900/25 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Wo<span className="text-[#7C3AED]">Py</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">The world's most creative marketplace for handcrafted workshops and artistic experiences.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 bg-white/8 border border-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500 transition-colors" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="bg-[#7C3AED] text-white text-sm font-semibold px-5 py-2.5 rounded-full">Join</motion.button>
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-600 mb-4">{group}</p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l}><motion.a href="#" whileHover={{ color: "#7C3AED", x: 3 }} className="text-gray-500 text-sm inline-block">{l}</motion.a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">© 2025 WoPy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ scale: 1.2, color: "#7C3AED" }} whileTap={{ scale: 0.9 }} className="text-gray-600"><Icon size={18} /></motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <CategoriesSection />
      <ShowcaseSection />
      <JourneySection />
      <TestimonialsSection />
      <HostSection />
      <Footer />
    </>
  );
}
