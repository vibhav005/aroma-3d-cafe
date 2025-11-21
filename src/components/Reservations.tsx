import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ExternalLink,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Reservation } from "@/types";
import { businessInfo } from "@/data/mockData";
import CafeMapGL from "./CafeMapGl";
import CafeMap3D from "./CafeMapGl";
import CafeMapPro from "./CafeMapGl";

const GAS_URL = import.meta.env.VITE_GAS_RESERVATIONS_URL as string | undefined;

/* -------------------------------- Data -------------------------------- */

const timeSlots = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
];

const guestMin = 1;
const guestMax = 10;

/** simple visual state for demo purposes */
function getSlotState(slot: string): "calm" | "popular" | "busy" {
  // fake heuristics for vibe only
  if (/12:|1:|6:|7:/.test(slot)) return "popular"; // lunch/evening
  if (/:30/.test(slot)) return "busy";
  return "calm";
}

/* ------------------------------- Component ------------------------------ */

const Reservations = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Reservation>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Partial<Reservation>>({});

  const updateField = (field: keyof Reservation, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Reservation> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = "Please select a future date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Some fields need your attention.",
        variant: "destructive",
      });
      return;
    }

    if (!GAS_URL) {
      toast({
        title: "Missing configuration",
        description:
          "Set VITE_GAS_RESERVATIONS_URL in your .env to the Apps Script Web App URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Build URL-encoded body (avoids preflight/CORS)
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      guests: String(formData.guests),
      specialRequests: formData.specialRequests ?? "",
    });

    // Optional: request timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to save (status ${res.status})`);
      }

      toast({
        title: "Reservation confirmed!",
        description: `Table for ${formData.guests} on ${formData.date} at ${formData.time}. We'll send you a confirmation email shortly.`,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        specialRequests: "",
      });
    } catch (err: any) {
      const message =
        err?.name === "AbortError"
          ? "Request timed out. Please try again."
          : err?.message ||
            "Something went wrong. Please try again or call us directly.";

      toast({
        title: "Reservation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      clearTimeout(timer);
      setIsSubmitting(false);
    }
  };

  const todayISO = new Date().toISOString().split("T")[0];
  const tomorrowISO = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const decGuests = () =>
    updateField("guests", Math.max(guestMin, formData.guests - 1));
  const incGuests = () =>
    updateField("guests", Math.min(guestMax, formData.guests + 1));

  return (
    <section id="reservations" className="relative bg-cream">
      {/* Subtle ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-coffee-medium/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sage/10 blur-3xl" />

      <div className="container mx-auto px-6 py-20 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-coffee-medium/10 text-coffee-rich px-3 py-1 rounded-full border border-coffee-rich/10 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">Book in advance</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich">
            Reserve Your Table
          </h2>
          <p className="text-lg md:text-xl text-coffee-medium/90 max-w-2xl mx-auto mt-3">
            Secure your spot for an exceptional coffee experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="border border-coffee-rich/15 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(136,107,71,0.12)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-coffee-rich">
                  Make a Reservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-coffee-rich">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={cn(
                          "bg-white/80 border-coffee-rich/20 focus-visible:ring-cream focus-visible:border-cream",
                          errors.name &&
                            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        )}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-coffee-rich">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={cn(
                          "bg-white/80 border-coffee-rich/20 focus-visible:ring-cream focus-visible:border-cream",
                          errors.phone &&
                            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        )}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-coffee-rich">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={cn(
                        "bg-white/80 border-coffee-rich/20 focus-visible:ring-cream focus-visible:border-cream",
                        errors.email &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Reservation Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date + quick-pick */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="date"
                        className="text-coffee-rich flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" /> Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        min={todayISO}
                        value={formData.date}
                        onChange={(e) => updateField("date", e.target.value)}
                        className={cn(
                          "bg-white/80 border-coffee-rich/20 focus-visible:ring-cream focus-visible:border-cream",
                          errors.date &&
                            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateField("date", todayISO)}
                          className="text-xs px-2 py-1 rounded-full bg-coffee-medium/10 text-coffee-rich hover:bg-coffee-medium/15"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField("date", tomorrowISO)}
                          className="text-xs px-2 py-1 rounded-full bg-coffee-medium/10 text-coffee-rich hover:bg-coffee-medium/15"
                        >
                          Tomorrow
                        </button>
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                      )}
                    </div>

                    {/* Guests stepper */}
                    <div className="space-y-2">
                      <Label className="text-coffee-rich flex items-center gap-2">
                        <Users className="w-4 h-4" /> Guests
                      </Label>
                      <div className="flex items-center justify-between rounded-lg border border-coffee-rich/20 bg-white/80">
                        <button
                          type="button"
                          onClick={decGuests}
                          className="p-2 hover:bg-coffee-rich/5 text-coffee-rich focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream rounded-l-lg"
                          aria-label="Decrease guests"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="text-coffee-rich font-semibold select-none">
                          {formData.guests}{" "}
                          {formData.guests === 1 ? "Guest" : "Guests"}
                        </div>
                        <button
                          type="button"
                          onClick={incGuests}
                          className="p-2 hover:bg-coffee-rich/5 text-coffee-rich focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream rounded-r-lg"
                          aria-label="Increase guests"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* “Best times” hint */}
                    <div className="space-y-2">
                      <Label className="text-coffee-rich flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Pro tip
                      </Label>
                      <div className="text-sm text-coffee-medium/90 bg-coffee-medium/10 rounded-lg p-3">
                        Lunchtime & evenings are popular. Try earlier slots for
                        a calmer vibe.
                      </div>
                    </div>
                  </div>

                  {/* Time chips (glassy) */}
                  <div className="space-y-2">
                    <Label className="text-coffee-rich">Select Time *</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((t) => {
                        const state = getSlotState(t);
                        const selected = formData.time === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => updateField("time", t)}
                            className={cn(
                              "px-3 py-2 rounded-full text-sm border backdrop-blur-md transition-all",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream",
                              selected
                                ? "bg-coffee-medium text-cream border-coffee-medium shadow-warm"
                                : "bg-white/70 text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"
                            )}
                            aria-pressed={selected}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "inline-block w-2 h-2 rounded-full",
                                  state === "busy" && "bg-red-500",
                                  state === "popular" && "bg-coffee-medium",
                                  state === "calm" && "bg-sage"
                                )}
                              />
                              {t}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-sm">{errors.time}</p>
                    )}
                  </div>

                  {/* Special requests */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="requests"
                      className="text-coffee-rich flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="requests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        updateField("specialRequests", e.target.value)
                      }
                      className="bg-white/80 border-coffee-rich/20 focus-visible:ring-cream focus-visible:border-cream resize-none"
                      placeholder="Any dietary restrictions, accessibility needs, or special occasions..."
                      rows={3}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-coffee-rich hover:bg-coffee-medium text-cream font-semibold py-3 focus-visible:ring-2 focus-visible:ring-cream"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="inline-flex items-center gap-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Clock className="w-5 h-5" />
                        Booking...
                      </motion.div>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Confirm Reservation
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Info & Map */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border border-coffee-rich/15 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(136,107,71,0.12)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-coffee-rich">
                  Contact & Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sage mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-coffee-rich">Address</p>
                      <p className="text-coffee-medium text-sm">
                        {businessInfo.address.street}
                        <br />
                        {businessInfo.address.city},{" "}
                        {businessInfo.address.state} {businessInfo.address.zip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-sage mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-coffee-rich">Phone</p>
                      <a
                        href={`tel:${businessInfo.phone}`}
                        className="text-coffee-medium text-sm hover:text-sage transition-colors"
                      >
                        {businessInfo.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-sage mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-coffee-rich">Email</p>
                      <a
                        href={`mailto:${businessInfo.email}`}
                        className="text-coffee-medium text-sm hover:text-sage transition-colors"
                      >
                        {businessInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-coffee-rich/10 pt-4">
                  <h4 className="font-medium text-coffee-rich mb-3">Hours</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(businessInfo.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-coffee-medium capitalize">
                          {day}
                        </span>
                        <span className="text-coffee-rich">
                          {(hours as any).closed
                            ? "Closed"
                            : `${(hours as any).open} - ${
                                (hours as any).close
                              }`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-coffee-rich/15 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(136,107,71,0.12)]">
  <CardContent className="p-0">
    <CafeMapPro
      coords={{ lat: businessInfo.coordinates.lat, lng: businessInfo.coordinates.lng }}
      cafeName="Deccan Brews"
      addressLine={`${businessInfo.address.street}, ${businessInfo.address.city}, ${businessInfo.address.state} ${businessInfo.address.zip}`}
      phone="+91 7387833732"
      mapsUrl="https://share.google/fx4jsIy3qc0Advkl3"
      deliveryRadiusMeters={4000}
      className="h-64 md:h-72 rounded-xl overflow-hidden"
    />
  </CardContent>
</Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Reservations;
