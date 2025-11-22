import { motion } from "framer-motion";
import { Coffee, Heart, Users, Award } from "lucide-react";
import cafeInteriorImage from "@/assets/Interior.jpg";

const stats = [
  {
    icon: Coffee,
    value: "10k+",
    label: "Cups Served Daily",
    color: "text-coffee-medium",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Customer Satisfaction",
    color: "text-red-500",
  },
  { icon: Users, value: "50+", label: "Team Members", color: "text-sage" },
  { icon: Award, value: "15+", label: "Awards Won", color: "text-yellow-500" },
];

const values = [
  {
    title: "Artisan Quality",
    description:
      "Every cup is crafted with precision using premium beans from sustainable farms worldwide.",
    icon: Coffee,
  },
  {
    title: "Community First",
    description:
      "We believe in building connections and creating a welcoming space for everyone.",
    icon: Heart,
  },
  {
    title: "Sustainability",
    description:
      "Committed to eco-friendly practices from bean to cup, supporting local and organic suppliers.",
    icon: Users,
  },
];

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-20 bg-cream text-coffee-rich relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Ccircle cx='28' cy='28' r='1.25' fill='%23886B47'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cream/80 backdrop-blur-xl border border-coffee-rich/15 rounded-full px-3 py-1.5 mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-coffee-rich" />
            <span className="text-xs font-medium">Since 2025 • Pune</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Our Story
          </h2>
          <p className="text-lg md:text-xl text-coffee-rich/70 max-w-2xl mx-auto">
            Born from a passion for exceptional coffee and genuine hospitality
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Frame */}
            <div className="relative overflow-hidden rounded-2xl shadow-warm border border-coffee-rich/15">
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-coffee-rich/25 to-transparent pointer-events-none" />
              <img
                src={cafeInteriorImage}
                alt="Cozy cafe interior with warm lighting and plants"
                className="w-full h-[460px] md:h-[520px] object-cover"
                loading="lazy"
                decoding="async"
              />

              {/* Corner accents */}
              <div className="pointer-events-none absolute -top-8 -left-8 w-32 h-32 rounded-full bg-coffee-medium/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-sage/10 blur-2xl" />
            </div>

            {/* Floating Founded card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-6 -right-3 md:-right-6 bg-cream/90 backdrop-blur-xl rounded-xl px-6 py-5 shadow-xl border border-coffee-rich/15"
            >
              <div className="text-center">
                <div className="text-3xl font-bold">2025</div>
                <div className="text-sm text-coffee-rich/70">Founded</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Copy + Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display font-semibold">
              Crafting Exceptional Experiences Since 2025
            </h3>

            <p className="text-lg leading-relaxed text-coffee-rich/80">
              What started as a dream to create the perfect coffee experience
              has grown into a beloved community gathering place. We source our
              beans directly from farmers who share our commitment to quality
              and sustainability.
            </p>

            <p className="text-lg leading-relaxed text-coffee-rich/80">
              Our cozy space combines modern design with warm, natural
              elements—from reclaimed wood tables to living walls filled with
              plants. Every detail is thoughtfully curated to create an
              atmosphere where conversations flow as smoothly as our coffee.
            </p>

            {/* Values list */}
            <div className="grid gap-4 mt-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.06 * index }}
                  className="flex gap-4 p-4 rounded-xl bg-cream/70 border border-coffee-rich/10 hover:bg-cream/90 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-coffee-medium/10 border border-coffee-rich/10 grid place-items-center">
                      <value.icon className="h-6 w-6 text-coffee-medium" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{value.title}</h4>
                    <p className="text-sm text-coffee-rich/75">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl bg-cream/70 border border-coffee-rich/10 p-6 md:p-8 shadow-soft"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 w-16 h-16 rounded-full border border-coffee-rich/15 bg-cream grid place-items-center shadow-sm">
                  <stat.icon
                    className={`h-8 w-8 ${stat.color}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-coffee-rich/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission / Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="border-t border-coffee-rich/15 pt-8">
              <blockquote className="text-2xl md:text-3xl font-display font-medium leading-relaxed italic">
                “We believe that great coffee has the power to bring people
                together, spark conversations, and create moments of joy in
                everyday life.”
              </blockquote>
              <footer className="mt-6 text-coffee-rich/70">
                — Maria Rodriguez, Founder &amp; Head Roaster
              </footer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
