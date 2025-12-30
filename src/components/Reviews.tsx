import coffeeVideo from "@/assets/coffee.mp4";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Sparkles, Star } from "lucide-react";
import { useState } from "react";
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=f5e9a5de68bdd767&sxsrf=AE3TifP0ICnOyprpxGboLkgpZ3b08aPpkg:1767093853452&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E2iXcZhHhvniQYcvMAbBmie7KNSqOma4Z3Wa3NJWIhSXJMTdnTPHpHEkBp_yNgpVyRUVIsov-YZsN-S4nJ9bluKERP0wWrJDt9aaPB0CrMF4onE-MvnofHV7OuhDOlsuE4tJwKA%3D&q=Cafe+Deccan+Brews+Best+Cafe+In+PCMC+Reviews";

export default function Reviews() {
  const reduceMotion = useReducedMotion();
  const [clicked, setClicked] = useState(false);

  const onClick = () => {
    if (reduceMotion) return;
    setClicked(true);
    window.setTimeout(() => setClicked(false), 1200);
  };

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Deccan-inspired abstract motif (pure CSS): dots + diagonals */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(62,39,35,0.9) 1px, transparent 0), linear-gradient(135deg, rgba(136,107,71,0.10) 0%, transparent 45%, rgba(107,142,120,0.10) 100%)",
            backgroundSize: "20px 20px, auto",
          }}
        />
      </div>

      {/* Warm blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-coffee-medium/10 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sage/10 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 12, 0], x: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative mx-auto px-6 py-20">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-coffee-rich/10 bg-coffee-medium/10 px-3 py-1 text-coffee-rich">
            <Star className="h-4 w-4" />
            <span className="text-xs font-medium">Before you go…</span>
          </div>

          <h2 className="mt-5 text-4xl md:text-5xl font-display font-bold text-coffee-rich">
            One small review, big local support.
          </h2>
          <p className="mt-3 text-lg text-coffee-medium/90">
            If you enjoyed the coffee, drop a quick Google review. It helps people nearby discover Deccan
            Brews.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.06 }}
        >
          <Card className="relative overflow-hidden border border-coffee-rich/15 bg-white/70 backdrop-blur-xl shadow-[0_22px_54px_rgba(136,107,71,0.14)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coffee-rich/60 via-sage to-coffee-medium" />

            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-coffee-rich">Cafe Deccan Brews</CardTitle>
                <div className="inline-flex items-center gap-2 rounded-full bg-coffee-rich/5 px-3 py-1 text-xs text-coffee-medium">
                  <Sparkles className="h-4 w-4 text-sage" />
                  <span>“Bas ek line bhi chalega.”</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative">
                <motion.div
                  className="mx-auto w-full max-w-sm"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-coffee-rich/15 bg-white/60 shadow-[0_18px_40px_rgba(136,107,71,0.12)]">
                    <video
                      className="h-72 w-full object-cover"
                      src={coffeeVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label="Coffee pour video"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coffee-rich/30 via-transparent to-transparent" />
                  </div>

                  <p className="mt-4 text-center text-sm text-coffee-medium/90">
                    Mention the coffee, the vibe, or the staff whatever felt best.
                  </p>
                </motion.div>
              </div>

              {/* Copy + CTA */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-coffee-rich/10 bg-coffee-rich/5 p-4">
                  <p className="text-sm font-medium text-coffee-rich">A quick outline:</p>
                  <ul className="mt-2 text-sm text-coffee-medium/90 space-y-1">
                    <li>• What you ordered (and why you liked it)</li>
                    <li>• The ambience (calm / lively / work-friendly)</li>
                    <li>• Service & overall experience</li>
                  </ul>
                </div>

                <div className="relative">
                  {clicked && !reduceMotion && (
                    <motion.div
                      className="pointer-events-none absolute -top-12 left-0 right-0 mx-auto w-fit rounded-full border border-coffee-rich/10 bg-white/80 px-4 py-2 text-xs text-coffee-rich shadow-[0_12px_28px_rgba(136,107,71,0.14)]"
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      Shukriya 🤎
                    </motion.div>
                  )}

                  <a
                    href={GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    aria-label="Open Google Reviews for Cafe Deccan Brews"
                    onClick={onClick}
                  >
                    <motion.div
                      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button className="relative w-full overflow-hidden bg-coffee-rich hover:bg-coffee-medium text-cream font-semibold py-6">
                        {!reduceMotion && (
                          <motion.span
                            className="pointer-events-none absolute inset-y-0 left-[-40%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ["0%", "260%"] }}
                            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Open Google Reviews
                      </Button>
                    </motion.div>
                  </a>

                  <p className="mt-3 text-xs text-coffee-medium/80">
                    Opens in a new tab. Google may ask you to sign in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-coffee-medium/90">
            Next time you’re around, drop in we’ll brew something special.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
