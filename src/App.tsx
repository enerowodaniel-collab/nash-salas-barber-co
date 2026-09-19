import { useState, useEffect } from "react";
import { Scissors, Calendar, User, Mail, Phone, Clock, MessageSquare, CheckCircle2, Loader2, ArrowRight, Star, MapPin, Sparkles, Quote } from "lucide-react";
import { SERVICES, TIME_SLOTS } from "@/lib/services";
import { supabase } from "@/lib/supabase";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  service: string | null;
  created_at: string;
};

const BARBER_IMAGE = "https://images.pexels.com/photos/9992819/pexels-photo-9992819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";
const SHOP_IMAGE = "https://images.pexels.com/photos/37764947/pexels-photo-37764947.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";
const SHOP_IMAGE_2 = "https://images.pexels.com/photos/20785318/pexels-photo-20785318.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  time: "",
  notes: "",
};

export default function App() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, rating, comment, service, created_at")
        .order("created_at", { ascending: false });

      if (error || !data) return;

      setReviews(data);
      if (data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating(Math.round((total / data.length) * 10) / 10);
        setReviewCount(data.length);
      }
    })();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceSelect = (serviceId: string, serviceName: string) => {
    setSelectedServiceId(serviceId);
    handleChange("service", serviceName);
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const appointment = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        appointment_date: form.date,
        appointment_time: form.time,
        notes: form.notes || null,
      };

      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert(appointment);

      if (appointmentError) {
        throw new Error("Booking could not be saved. Please try again.");
      }

      const response = await fetch("https://formsubmit.co/ajax/geraldnashsalas5@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointment,
          _subject: `New Booking - ${form.name}`,
          _captcha: "false",
          _template: "table",
        }),
      });

      if (!response.ok) {
        throw new Error("Booking was saved, but the email could not be sent.");
      }

      setSuccess(true);
      setForm(initialForm);
      setSelectedServiceId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetSuccess = () => {
    setSuccess(false);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0f0d0b] text-white overflow-x-hidden">
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0f0d0b]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-lg tracking-tight">Nash Salas</p>
              <p className="text-[10px] text-amber-400/80 tracking-[3px] uppercase">Barber Co.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <a href="#services" className="hidden sm:block text-white/70 hover:text-amber-400 transition-colors">Services</a>
            <a href="#about" className="hidden sm:block text-white/70 hover:text-amber-400 transition-colors">About</a>
            <a href="#reviews" className="hidden sm:block text-white/70 hover:text-amber-400 transition-colors">Reviews</a>
            <a href="#booking-form" className="bg-amber-400 text-black font-semibold px-5 py-2 rounded-full hover:bg-amber-300 transition-colors flex items-center gap-1.5">
              Book Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={BARBER_IMAGE} alt="Barber at work" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0d0b] via-[#0f0d0b]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 py-20 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 text-xs font-medium tracking-wide">Now accepting new clients</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              Sharp cuts.<br />
              <span className="text-amber-400 italic font-serif">Bold</span> style.
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-md leading-relaxed">
              Book your next appointment with Nash Salas — where every cut tells a story and every chair feels like home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#services" className="bg-amber-400 text-black font-semibold px-7 py-3.5 rounded-full hover:bg-amber-300 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Book Appointment <Calendar className="w-4 h-4" />
              </a>
              <a href="#about" className="border border-white/20 text-white font-medium px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center">
                Meet Nash
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold text-amber-400">2+</p>
                <p className="text-sm text-white/50">Years experience</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-3xl font-bold text-amber-400">150+</p>
                <p className="text-sm text-white/50">Happy clients</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-bold text-amber-400">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</p>
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-sm text-white/50">{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Services */}
      <section id="services" className="py-24 max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm tracking-[3px] uppercase font-medium mb-3">What we offer</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Pick your <span className="font-serif italic text-amber-400">service</span></h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">From classic cuts to full grooming packages — there's something for every gentleman.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id, service.name)}
              className={`group text-left bg-white/[0.03] border rounded-2xl p-6 transition-all hover:bg-white/[0.06] hover:border-amber-400/40 hover:scale-[1.02] cursor-pointer ${
                selectedServiceId === service.id ? "border-amber-400/60 bg-amber-400/5" : "border-white/5"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                  <Scissors className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-400">${service.price}</p>
                  <p className="text-xs text-white/40 flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3 h-3" /> {service.duration}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1.5 group-hover:text-amber-400 transition-colors">{service.name}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{service.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Select this <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={SHOP_IMAGE} alt="Barber shop interior" className="rounded-2xl w-full object-cover aspect-[4/3] shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 hidden sm:block">
              {reviews.length > 0 && (
                <div className="bg-amber-400 text-black rounded-2xl p-5 max-w-[220px] shadow-xl">
                  <Quote className="w-5 h-5 fill-black mb-2" />
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(reviews[0].rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-black" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold leading-snug">"{reviews[0].comment}"</p>
                  <p className="text-xs mt-1.5 opacity-70">— {reviews[0].author_name}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-amber-400 text-sm tracking-[3px] uppercase font-medium mb-3">Meet your barber</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Nash Salas</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              With over 2 years behind the chair, Nash has turned a craft into an art form. He's not just cutting hair — he's building confidence, one client at a time.
            </p>
            <p className="text-white/70 leading-relaxed mb-8">
              Specializing in skin fades, classic cuts, and beard sculpting, Nash blends old-school technique with modern style. Walk in a stranger, walk out feeling like the best version of yourself.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Walk-ins welcome</p>
                  <p className="text-xs text-white/40">Or book ahead</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Mon–Sat</p>
                  <p className="text-xs text-white/40">9 AM – 7 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-16 overflow-hidden">
        <div className="flex gap-4 px-5 max-w-6xl mx-auto">
          <img src={SHOP_IMAGE_2} alt="Shop" className="rounded-xl w-1/3 aspect-square object-cover hidden md:block" />
          <img src={BARBER_IMAGE} alt="Cutting hair" className="rounded-xl flex-1 aspect-square object-cover" />
          <img src={SHOP_IMAGE} alt="Shop interior" className="rounded-xl w-1/3 aspect-square object-cover hidden md:block" />
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-sm tracking-[3px] uppercase font-medium mb-3">What clients say</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Real <span className="font-serif italic text-amber-400">reviews</span></h2>
            {reviewCount > 0 && (
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-white/15"}`}
                    />
                  ))}
                </div>
                <p className="text-white/60 text-sm">
                  <span className="font-bold text-amber-400">{avgRating.toFixed(1)}</span> from {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </p>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-center text-white/40 text-sm">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400/15 flex items-center justify-center font-bold text-amber-400 text-sm">
                      {review.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.author_name}</p>
                      {review.service && <p className="text-xs text-white/40">{review.service}</p>}
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-white/15"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-24 max-w-3xl mx-auto px-5">
        {success ? (
          <div className="text-center bg-white/[0.03] border border-amber-400/20 rounded-3xl p-12">
            <div className="w-20 h-20 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3">You're booked!</h2>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              Your appointment request has been received. Nash will reach out to confirm your spot. We've also sent a notification to the shop — sit tight!
            </p>
            <button onClick={resetSuccess} className="bg-amber-400 text-black font-semibold px-7 py-3 rounded-full hover:bg-amber-300 transition-colors">
              Book Another Appointment
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="text-amber-400 text-sm tracking-[3px] uppercase font-medium mb-3">Reserve your chair</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Book your <span className="font-serif italic text-amber-400">spot</span></h2>
              <p className="text-white/50 mt-4">Fill out the form below and we'll take care of the rest.</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-10 space-y-6">
              {/* Selected service display */}
              {form.service && (
                <div className="flex items-center justify-between bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-xs text-amber-400/70 uppercase tracking-wide">Selected service</p>
                      <p className="font-semibold">{form.service}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { handleChange("service", ""); setSelectedServiceId(null); }}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" /> Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-400" /> Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400" /> Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>

              {/* Service dropdown */}
              <div>
                <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-amber-400" /> Service
                </label>
                <select
                  required
                  value={form.service}
                  onChange={(e) => handleChange("service", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                >
                  <option value="" className="bg-[#1a1815]">Choose a service...</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.name} className="bg-[#1a1815]">
                      {s.name} — ${s.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 transition-colors [color-scheme:dark]"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> Time
                  </label>
                  <select
                    required
                    value={form.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                  >
                    <option value="" className="bg-[#1a1815]">Pick a time...</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#1a1815]">{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" /> Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Tell Nash what you're looking for..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                />
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-4 mb-3 text-xs text-white/45">
                  <span>Ready to reserve your chair?</span>
                  <span className="text-amber-400/80">No payment needed now</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full bg-amber-400 text-black font-bold text-base py-4 rounded-xl shadow-[0_12px_30px_rgba(251,191,36,0.16)] hover:bg-amber-300 hover:shadow-[0_16px_36px_rgba(251,191,36,0.24)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Booking...
                  </>
                ) : (
                  <>
                    Confirm Booking <ArrowRight className="w-5 h-5" />
                  </>
                )}
                </button>
              </div>

              <p className="text-center text-xs text-white/40">
                No payment needed now — pay at the chair.
              </p>
            </form>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div className="leading-none text-left">
              <p className="font-bold text-lg tracking-tight">Nash Salas</p>
              <p className="text-[10px] text-amber-400/80 tracking-[3px] uppercase">Barber Co.</p>
            </div>
          </div>
          <p className="text-white/40 text-sm mb-2">Sharp cuts. Bold style. Every time.</p>
          <p className="text-white/30 text-xs">Mon–Sat · 9 AM – 7 PM · Closed Sundays</p>
          <p className="text-white/20 text-xs mt-6">© {new Date().getFullYear()} Nash Salas Barber Co. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
