import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, TrendingUp, Users, Star, DollarSign, Eye, Edit, Trash2,
  Calendar, ArrowUpRight, Search, Download, CheckCircle, XCircle,
  Clock, Phone, Mail, Package, MoreHorizontal, Bell, LogOut,
  Sparkles, AlertCircle, RefreshCw, ChevronRight, MessageSquare, Printer,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { useApp } from "../contexts/AppContext";
import { HOST_WORKSHOPS } from "../data";

// ─── Types & Mock data ────────────────────────────────────────────────────────

type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";
type Tab = "overview" | "bookings" | "workshops" | "analytics";

interface BookingRow {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  avatar: string;
  avatarGrad: string;
  workshop: string;
  workshopId: number;
  sessionDate: string;
  sessionTime: string;
  bookedOn: string;
  guests: number;
  amount: number;
  status: BookingStatus;
  notes?: string;
}

const ALL_BOOKINGS: BookingRow[] = [
  { id: "B-0041", studentName: "Emma Chen",      studentEmail: "emma@example.com",   studentPhone: "+1 415-220-1234", avatar: "EC", avatarGrad: "from-violet-500 to-purple-600", workshop: "Wheel Throwing Masterclass", workshopId: 1, sessionDate: "Sat, Jul 19", sessionTime: "10:00 AM", bookedOn: "Jul 12, 2025", guests: 2, amount: 170, status: "confirmed" },
  { id: "B-0042", studentName: "Lucas Martin",   studentEmail: "lucas@example.com",  studentPhone: "+1 650-334-5678", avatar: "LM", avatarGrad: "from-blue-500 to-cyan-500",    workshop: "Wheel Throwing Masterclass", workshopId: 1, sessionDate: "Sat, Jul 19", sessionTime: "10:00 AM", bookedOn: "Jul 13, 2025", guests: 1, amount: 85,  status: "confirmed" },
  { id: "B-0043", studentName: "Sofia Rodriguez",studentEmail: "sofia@example.com",  studentPhone: "+1 213-789-0000", avatar: "SR", avatarGrad: "from-rose-500 to-pink-500",    workshop: "Wheel Throwing Masterclass", workshopId: 1, sessionDate: "Sun, Jul 20", sessionTime: "2:00 PM",  bookedOn: "Jul 10, 2025", guests: 3, amount: 255, status: "pending",   notes: "Accessibility: wheelchair access needed at studio entrance" },
  { id: "B-0044", studentName: "James Liu",      studentEmail: "james@example.com",  studentPhone: "+1 312-456-7890", avatar: "JL", avatarGrad: "from-amber-500 to-orange-500", workshop: "French Macaron Workshop",    workshopId: 3, sessionDate: "Sat, Jul 26", sessionTime: "10:00 AM", bookedOn: "Jul 14, 2025", guests: 2, amount: 130, status: "confirmed" },
  { id: "B-0045", studentName: "Priya Nair",     studentEmail: "priya@example.com",  studentPhone: "+1 917-555-3322", avatar: "PN", avatarGrad: "from-emerald-500 to-teal-500", workshop: "French Macaron Workshop",    workshopId: 3, sessionDate: "Sat, Jul 26", sessionTime: "10:00 AM", bookedOn: "Jul 15, 2025", guests: 1, amount: 65,  status: "cancelled",  notes: "Cancelled due to travel conflict" },
  { id: "B-0046", studentName: "Tom Fischer",    studentEmail: "tom@example.com",    studentPhone: "+1 512-111-2233", avatar: "TF", avatarGrad: "from-fuchsia-500 to-violet-500",workshop: "Wheel Throwing Masterclass", workshopId: 1, sessionDate: "Sun, Jul 27", sessionTime: "2:00 PM",  bookedOn: "Jul 16, 2025", guests: 1, amount: 85,  status: "confirmed" },
  { id: "B-0047", studentName: "Aisha Okafor",   studentEmail: "aisha@example.com",  studentPhone: "+44 7911 123456", avatar: "AO", avatarGrad: "from-cyan-500 to-blue-500",    workshop: "French Macaron Workshop",    workshopId: 3, sessionDate: "Sat, Aug 2",  sessionTime: "10:00 AM", bookedOn: "Jul 17, 2025", guests: 2, amount: 130, status: "pending" },
  { id: "B-0040", studentName: "Ryan Park",      studentEmail: "ryan@example.com",   studentPhone: "+1 408-900-8877", avatar: "RP", avatarGrad: "from-orange-500 to-red-500",   workshop: "Wheel Throwing Masterclass", workshopId: 1, sessionDate: "Sat, Jul 12", sessionTime: "10:00 AM", bookedOn: "Jul 5, 2025",  guests: 2, amount: 170, status: "completed" },
];

const earningsData = [
  { month: "Jan", earnings: 1200, bookings: 14 },
  { month: "Feb", earnings: 1800, bookings: 21 },
  { month: "Mar", earnings: 2400, bookings: 28 },
  { month: "Apr", earnings: 1900, bookings: 22 },
  { month: "May", earnings: 3200, bookings: 37 },
  { month: "Jun", earnings: 2800, bookings: 32 },
  { month: "Jul", earnings: 4100, bookings: 47 },
];

const STATUS_CFG: Record<BookingStatus, {
  label: string; bg: string; border: string; text: string; dot: string; lightBg: string;
}> = {
  confirmed:  { label: "Confirmed",  bg: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", lightBg: "bg-emerald-50"  },
  pending:    { label: "Pending",    bg: "bg-amber-400",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-400",   lightBg: "bg-amber-50"    },
  cancelled:  { label: "Cancelled",  bg: "bg-red-500",     border: "border-red-200",     text: "text-red-600",     dot: "bg-red-500",     lightBg: "bg-red-50"      },
  completed:  { label: "Completed",  bg: "bg-gray-400",    border: "border-gray-200",    text: "text-gray-600",    dot: "bg-gray-400",    lightBg: "bg-gray-100"    },
};

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: BookingStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${c.lightBg} ${c.text} text-xs font-bold px-3 py-1 rounded-full border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  );
}

function KPICard({ icon, label, value, sub, positive = true }: {
  icon: React.ReactNode; label: string; value: string; sub: string; positive?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
      <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-black text-[#0D0D1A] leading-none">{value}</p>
        <p className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${positive ? "text-emerald-600" : "text-amber-600"}`}>
          <ArrowUpRight size={11} />{sub}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Booking Drawer ───────────────────────────────────────────────────────────

function BookingDrawer({ b, onClose, onConfirm, onDecline }: {
  b: BookingRow; onClose: () => void;
  onConfirm: () => void; onDecline: () => void;
}) {
  const c = STATUS_CFG[b.status];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40" onClick={onClose} />

      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
        className="fixed right-0 top-0 bottom-0 w-[440px] max-w-full bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <p className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Booking {b.id}</p>
            <p className="font-black text-[#0D0D1A] text-lg leading-tight mt-0.5">Reservation Detail</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
              <Printer size={14} />
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors font-bold text-sm">
              ✕
            </button>
          </div>
        </div>

        {/* Status strip */}
        <div className={`${c.lightBg} px-6 py-3 flex items-center gap-3 border-b ${c.border} shrink-0`}>
          <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
          <span className={`font-bold text-sm ${c.text}`}>{c.label}</span>
          <span className="text-gray-400 text-xs">· Booked {b.bookedOn}</span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Guest card */}
          <div className="p-6 border-b border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">Guest</p>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.avatarGrad} flex items-center justify-center text-white font-black text-xl shadow-md`}>
                {b.avatar}
              </div>
              <div className="flex-1">
                <p className="font-black text-[#0D0D1A] text-base">{b.studentName}</p>
                <a href={`mailto:${b.studentEmail}`} className="text-sm text-[#7C3AED] hover:underline">{b.studentEmail}</a>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`mailto:${b.studentEmail}`}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-violet-50 hover:text-[#7C3AED] transition-all text-gray-600 text-sm font-medium">
                <Mail size={14} className="shrink-0" /> Email
              </a>
              <a href={`tel:${b.studentPhone}`}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-violet-50 hover:text-[#7C3AED] transition-all text-gray-600 text-sm font-medium">
                <Phone size={14} className="shrink-0" /> {b.studentPhone}
              </a>
            </div>
          </div>

          {/* Booking info table */}
          <div className="p-6 border-b border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">Reservation</p>
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { label: "Workshop",   value: b.workshop,   icon: <Package  size={13} /> },
                { label: "Date",       value: b.sessionDate, icon: <Calendar size={13} /> },
                { label: "Time",       value: b.sessionTime, icon: <Clock    size={13} /> },
                { label: "Guests",     value: `${b.guests} ${b.guests > 1 ? "people" : "person"}`, icon: <Users size={13} /> },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}>
                  <span className="text-gray-300 shrink-0">{row.icon}</span>
                  <span className="text-xs text-gray-400 w-20 shrink-0">{row.label}</span>
                  <span className="text-sm font-semibold text-[#0D0D1A]">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3.5 bg-[#0D0D1A]">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Charged</span>
                <span className="text-xl font-black text-white">${b.amount}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {b.notes && (
            <div className="px-6 py-5 border-b border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">Guest Notes</p>
              <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">{b.notes}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="px-6 py-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-4">Activity</p>
            <div className="space-y-4">
              {[
                { time: b.bookedOn, label: "Booking submitted", color: "bg-violet-500" },
                ...(b.status !== "pending" ? [{ time: b.bookedOn, label: b.status === "cancelled" ? "Booking cancelled" : "Booking confirmed", color: b.status === "cancelled" ? "bg-red-400" : "bg-emerald-500" }] : []),
              ].map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${ev.color} mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-sm font-semibold text-[#0D0D1A]">{ev.label}</p>
                    <p className="text-xs text-gray-400">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="shrink-0 p-5 border-t border-gray-100 bg-gray-50/50 space-y-2.5">
          {b.status === "pending" && (
            <div className="grid grid-cols-2 gap-3">
              <motion.button onClick={onConfirm} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-emerald-100">
                <CheckCircle size={15} /> Confirm
              </motion.button>
              <motion.button onClick={onDecline} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-500 font-bold py-3 rounded-2xl text-sm hover:bg-red-50 transition-colors">
                <XCircle size={15} /> Decline
              </motion.button>
            </div>
          )}
          {b.status === "confirmed" && (
            <div className="grid grid-cols-2 gap-3">
              <a href={`mailto:${b.studentEmail}`} className="col-span-1">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-violet-200">
                  <MessageSquare size={15} /> Message Guest
                </motion.button>
              </a>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-100 transition-colors">
                <XCircle size={14} /> Cancel
              </motion.button>
            </div>
          )}
          {(b.status === "completed" || b.status === "cancelled") && (
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-colors">
              <Download size={14} /> Download Receipt
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function HostDashboardPage() {
  const { user, logout } = useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [workshopFilter, setWorkshopFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>(ALL_BOOKINGS);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-[#7C3AED]" />
          </div>
          <h2 className="text-2xl font-black text-[#0D0D1A] mb-2">Host Dashboard</h2>
          <p className="text-gray-400 mb-6">Sign in with a host account to continue.</p>
          <Link to="/login?mode=host">
            <button className="bg-[#7C3AED] text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-violet-200">
              Sign In as Host
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Derived stats
  const totalEarnings  = HOST_WORKSHOPS.reduce((a, w) => a + w.earnings, 0);
  const pendingCount   = bookings.filter((b) => b.status === "pending").length;
  const avgRating      = (HOST_WORKSHOPS.reduce((a, w) => a + w.rating, 0) / HOST_WORKSHOPS.length).toFixed(1);

  // Filter bookings
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const ms = !q || [b.studentName, b.id, b.workshop, b.studentEmail].some((s) => s.toLowerCase().includes(q));
    const mst = statusFilter === "all" || b.status === statusFilter;
    const mw  = workshopFilter === "all" || b.workshop === workshopFilter;
    return ms && mst && mw;
  });

  const workshopNames = [...new Set(bookings.map((b) => b.workshop))];

  // Handlers
  function handleConfirm() {
    if (!selectedBooking) return;
    setBookings((prev) => prev.map((b) => b.id === selectedBooking.id ? { ...b, status: "confirmed" as BookingStatus } : b));
    setSelectedBooking((prev) => prev ? { ...prev, status: "confirmed" } : null);
  }
  function handleDecline() {
    if (!selectedBooking) return;
    setBookings((prev) => prev.map((b) => b.id === selectedBooking.id ? { ...b, status: "cancelled" as BookingStatus } : b));
    setSelectedBooking((prev) => prev ? { ...prev, status: "cancelled" } : null);
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "overview",  label: "Overview" },
    { id: "bookings",  label: "Bookings", badge: pendingCount },
    { id: "workshops", label: "Workshops" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] pt-16 flex flex-col">

      {/* ── Top bar ── */}
      <div className="bg-[#0D0D1A] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-violet-900/20 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Brand + user row */}
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-violet-900/50">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">{user.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">Host Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div className="relative">
                <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Bell size={15} />
                </button>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black font-black text-[10px] rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>

              <Link to="/host/create">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 bg-[#7C3AED] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-violet-900/40">
                  <Plus size={14} /> New Workshop
                </motion.button>
              </Link>

              <button onClick={logout}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-900/30 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors">
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                  tab === t.id ? "border-[#7C3AED] text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                }`}>
                {t.label}
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.17 }}>

            {/* ════ OVERVIEW ════ */}
            {tab === "overview" && (
              <div className="space-y-6">

                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard icon={<DollarSign size={20} className="text-emerald-600" />} label="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} sub="+18% this month" />
                  <KPICard icon={<Calendar   size={20} className="text-blue-600"    />} label="Total Bookings" value={bookings.length.toString()} sub="+12% this month" />
                  <KPICard icon={<Star       size={20} className="text-amber-500"   />} label="Avg Rating"     value={avgRating} sub="Top 5% of hosts" />
                  <KPICard icon={<Clock      size={20} className="text-amber-600"   />} label="Pending"        value={pendingCount.toString()} sub={pendingCount > 0 ? "Needs review" : "All clear"} positive={pendingCount === 0} />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                  {/* Revenue chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-[#0D0D1A]">Revenue Overview</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Monthly · 2025</p>
                      </div>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full">
                        <TrendingUp size={12} /> +41% YTD
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={190}>
                      <AreaChart data={earningsData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.13} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={46} />
                        <Tooltip formatter={(value) => [
                            `$${Number(value).toLocaleString()}`,
                            "Earnings",
                          ]}
                          contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontSize: 12 }} />
                        <Area type="monotone" dataKey="earnings" stroke="#7C3AED" strokeWidth={2.5}
                          fill="url(#g1)" dot={false} activeDot={{ r: 5, fill: "#7C3AED", strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pending queue */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <h3 className="font-bold text-[#0D0D1A] text-sm">Pending Approvals</h3>
                      {pendingCount > 0 && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-black px-2.5 py-1 rounded-full">{pendingCount}</span>
                      )}
                    </div>

                    {bookings.filter((b) => b.status === "pending").length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                          <CheckCircle size={22} className="text-emerald-500" />
                        </div>
                        <p className="text-sm font-bold text-[#0D0D1A]">All clear!</p>
                        <p className="text-xs text-gray-400 mt-0.5">No pending bookings</p>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-3 overflow-y-auto">
                        {bookings.filter((b) => b.status === "pending").map((b) => (
                          <div key={b.id}
                            className="p-3 rounded-xl border border-amber-100 bg-amber-50 cursor-pointer hover:border-amber-300 transition-colors"
                            onClick={() => setSelectedBooking(b)}>
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${b.avatarGrad} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{b.avatar}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#0D0D1A] text-sm truncate">{b.studentName}</p>
                                <p className="text-gray-500 text-xs truncate">{b.workshop}</p>
                              </div>
                              <ChevronRight size={14} className="text-gray-400 shrink-0" />
                            </div>
                            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-amber-100">
                              <span className="text-xs text-amber-700 font-semibold">{b.sessionDate} · {b.guests}p</span>
                              <span className="text-xs font-black text-[#0D0D1A]">${b.amount}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button onClick={(e) => { e.stopPropagation(); setBookings((prev) => prev.map((bk) => bk.id === b.id ? { ...bk, status: "confirmed" as BookingStatus } : bk)); }}
                                className="flex-1 bg-emerald-500 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-emerald-600 transition-colors">
                                Confirm
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setBookings((prev) => prev.map((bk) => bk.id === b.id ? { ...bk, status: "cancelled" as BookingStatus } : bk)); }}
                                className="flex-1 bg-white border border-red-200 text-red-500 text-xs font-bold py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent bookings table preview */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h3 className="font-bold text-[#0D0D1A]">Recent Bookings</h3>
                    <button onClick={() => setTab("bookings")} className="text-sm text-[#7C3AED] font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight size={14} />
                    </button>
                  </div>
                  <BookingsTable rows={bookings.slice(0, 5)} onSelect={setSelectedBooking} mini />
                </div>
              </div>
            )}

            {/* ════ BOOKINGS ════ */}
            {tab === "bookings" && (
              <div className="space-y-4">

                {/* Toolbar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, booking ID, workshop..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                    </div>

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-violet-400 bg-white cursor-pointer">
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>

                    <select value={workshopFilter} onChange={(e) => setWorkshopFilter(e.target.value)}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-violet-400 bg-white cursor-pointer max-w-[220px]">
                      <option value="all">All Workshops</option>
                      {workshopNames.map((n) => <option key={n}>{n}</option>)}
                    </select>

                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                      <Download size={13} /> Export CSV
                    </button>
                  </div>

                  {/* Summary row */}
                  <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      <span className="font-bold text-[#0D0D1A]">{filtered.length}</span> of {bookings.length} bookings
                    </span>
                    {(statusFilter !== "all" || workshopFilter !== "all" || search) && (
                      <button onClick={() => { setSearch(""); setStatusFilter("all"); setWorkshopFilter("all"); }}
                        className="text-xs text-red-500 font-semibold flex items-center gap-0.5 hover:underline">
                        <XCircle size={11} /> Clear
                      </button>
                    )}
                    <div className="ml-auto flex gap-1.5 flex-wrap">
                      {(["confirmed","pending","cancelled","completed"] as BookingStatus[]).map((s) => {
                        const cnt = bookings.filter((b) => b.status === s).length;
                        if (!cnt) return null;
                        const c = STATUS_CFG[s];
                        return (
                          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                              statusFilter === s ? `${c.lightBg} ${c.text} ${c.border}` : "border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}>
                            {cnt} {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <BookingsTable rows={filtered} onSelect={setSelectedBooking} />
                </div>
              </div>
            )}

            {/* ════ WORKSHOPS ════ */}
            {tab === "workshops" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-[#0D0D1A]" style={{ fontFamily: "var(--font-display)" }}>My Workshops</h2>
                  <Link to="/host/create">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 bg-[#7C3AED] text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-violet-200">
                      <Plus size={14} /> New Workshop
                    </motion.button>
                  </Link>
                </div>

                {HOST_WORKSHOPS.map((w, i) => {
                  const wb  = bookings.filter((b) => b.workshopId === w.id);
                  const rev = wb.filter((b) => b.status !== "cancelled").reduce((a, b) => a + b.amount, 0);
                  const occ = Math.min(100, Math.round((wb.filter((b) => b.status === "confirmed").length / Math.max(w.seatsTotal, 1)) * 100));

                  return (
                    <motion.div key={w.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="flex">
                        <div className={`bg-gradient-to-br ${w.gradient} w-36 shrink-0 hidden sm:block relative`}>
                          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/10 blur-sm" />
                          <div className="absolute bottom-3 left-3">
                            <StatusPill status={w.status === "published" ? "confirmed" : "pending"} />
                          </div>
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-black text-[#0D0D1A] text-base">{w.title}</h3>
                                <span className="sm:hidden"><StatusPill status={w.status === "published" ? "confirmed" : "pending"} /></span>
                              </div>
                              <p className="text-xs text-gray-400 mb-4">{w.category} · {w.level} · {w.duration} · <span className="font-bold text-[#7C3AED]">${w.price}/person</span></p>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                {[
                                  { label: "Revenue",   value: `$${rev.toLocaleString()}`,              icon: <DollarSign  size={11} className="text-emerald-500" /> },
                                  { label: "Bookings",  value: wb.length.toString(),                     icon: <Calendar    size={11} className="text-blue-500"    /> },
                                  { label: "Confirmed", value: wb.filter((b) => b.status === "confirmed").length.toString(), icon: <CheckCircle size={11} className="text-emerald-500" /> },
                                  { label: "Rating",    value: `★ ${w.rating}`,                         icon: <Star        size={11} className="text-amber-400"   /> },
                                ].map((s) => (
                                  <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                                    <div className="flex items-center gap-1 mb-1">{s.icon}<span className="text-[10px] font-bold text-gray-400 uppercase">{s.label}</span></div>
                                    <p className="font-black text-[#0D0D1A] text-sm">{s.value}</p>
                                  </div>
                                ))}
                              </div>

                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-gray-400">Seat occupancy</span>
                                  <span className="font-bold text-[#0D0D1A]">{occ}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full bg-gradient-to-r ${w.gradient} transition-all`} style={{ width: `${occ}%` }} />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 shrink-0">
                              <Link to={`/workshop/${w.id}`}>
                                <button className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors" title="View">
                                  <Eye size={13} />
                                </button>
                              </Link>
                              <Link to={`/host/edit/${w.id}`}>
                                <button className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors" title="Edit">
                                  <Edit size={13} />
                                </button>
                              </Link>
                              <button onClick={() => setDeletingId(w.id)}
                                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ════ ANALYTICS ════ */}
            {tab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard icon={<Eye        size={18} className="text-blue-500"    />} label="Profile Views"       value="1,247" sub="+23% this month" />
                  <KPICard icon={<TrendingUp size={18} className="text-emerald-500" />} label="Conversion Rate"     value="6.8%"  sub="+1.2% this month" />
                  <KPICard icon={<RefreshCw  size={18} className="text-violet-500"  />} label="Repeat Students"     value="38%"   sub="+4% this month"   />
                  <KPICard icon={<DollarSign size={18} className="text-amber-500"   />} label="Avg Revenue/Booking" value="$112"  sub="+8% this month"   />
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-[#0D0D1A]">Earnings vs Bookings</h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">Jan – Jul 2025</span>
                    </div>
                    <div className="flex items-center gap-5 mb-4">
                      {[["#7C3AED", "Earnings ($)"], ["#c4b5fd", "Bookings"]].map(([color, label]) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                          <span className="text-xs text-gray-400 font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={earningsData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={44} />
                        <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontSize: 12 }} />
                        <Bar yAxisId="l" dataKey="earnings" name="Earnings ($)" fill="#7C3AED" radius={[6,6,0,0]} barSize={18} />
                        <Bar yAxisId="r" dataKey="bookings" name="Bookings"     fill="#c4b5fd" radius={[6,6,0,0]} barSize={18} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-bold text-[#0D0D1A] text-sm mb-4">Bookings by Workshop</h3>
                      {HOST_WORKSHOPS.map((w) => {
                        const cnt = bookings.filter((b) => b.workshopId === w.id).length;
                        const pct = Math.round((cnt / bookings.length) * 100);
                        return (
                          <div key={w.id} className="mb-3 last:mb-0">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-600 font-medium truncate max-w-[170px]">{w.title}</span>
                              <span className="font-black text-[#0D0D1A] shrink-0 ml-2">{cnt} · {pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${w.gradient} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-bold text-[#0D0D1A] text-sm mb-4">Status Breakdown</h3>
                      {(["confirmed","completed","pending","cancelled"] as BookingStatus[]).map((s) => {
                        const cnt = bookings.filter((b) => b.status === s).length;
                        const pct = Math.round((cnt / bookings.length) * 100);
                        const c = STATUS_CFG[s];
                        return (
                          <div key={s} className="flex items-center gap-3 mb-3 last:mb-0">
                            <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
                            <span className={`text-xs font-semibold ${c.text} w-20 shrink-0`}>{c.label}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${c.dot}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-black text-[#0D0D1A] w-5 text-right">{cnt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deletingId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeletingId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-black text-[#0D0D1A] text-lg mb-2">Delete Workshop?</h3>
              <p className="text-gray-400 text-sm mb-6">This will cancel all pending bookings and cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-2xl text-sm">Cancel</button>
                <button onClick={() => setDeletingId(null)} className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-2xl text-sm">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking drawer */}
      <AnimatePresence>
        {selectedBooking && (
          <BookingDrawer
            b={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onConfirm={handleConfirm}
            onDecline={handleDecline}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Bookings Table ───────────────────────────────────────────────────────────

function BookingsTable({ rows, onSelect, mini = false }: {
  rows: BookingRow[]; onSelect: (b: BookingRow) => void; mini?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center">
        <Package size={30} className="text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-gray-400">No bookings match your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {(!mini ? ["Booking ID", "Guest", "Workshop", "Session", "Booked On", "Guests", "Total", "Status", ""] :
                       ["Guest",     "Workshop", "Session",  "Guests",  "Total",    "Status"]).map((h) => (
              <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((b, i) => (
            <motion.tr key={b.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              onClick={() => onSelect(b)}
              className="border-b border-gray-50 last:border-0 hover:bg-violet-50/40 cursor-pointer transition-colors group">

              {!mini && (
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-[#7C3AED] transition-colors">{b.id}</span>
                </td>
              )}

              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${b.avatarGrad} flex items-center justify-center text-white font-bold text-[11px] shrink-0`}>{b.avatar}</div>
                  <div>
                    <p className="font-semibold text-[#0D0D1A] text-sm whitespace-nowrap">{b.studentName}</p>
                    {!mini && <p className="text-xs text-gray-400">{b.studentEmail}</p>}
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="text-sm text-gray-700 font-medium max-w-[180px] truncate">{b.workshop}</p>
              </td>

              <td className="px-5 py-4 whitespace-nowrap">
                <p className="text-sm font-semibold text-[#0D0D1A]">{b.sessionDate}</p>
                <p className="text-xs text-gray-400">{b.sessionTime}</p>
              </td>

              {!mini && (
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-xs text-gray-400">{b.bookedOn}</p>
                </td>
              )}

              <td className="px-5 py-4 text-sm text-gray-600 font-medium">{b.guests}p</td>

              <td className="px-5 py-4 whitespace-nowrap">
                <span className="font-black text-[#0D0D1A]">${b.amount}</span>
              </td>

              <td className="px-5 py-4"><StatusPill status={b.status} /></td>

              {!mini && (
                <td className="px-5 py-4">
                  <button className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-violet-100 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-all">
                    <MoreHorizontal size={13} />
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
