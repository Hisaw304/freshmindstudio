import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import stat1 from "../assets/stat-1.jpg";
import stat2 from "../assets/stat-2.jpg";
import stat3 from "../assets/stat-3.jpg";
import stat4 from "../assets/stat-4.jpg";

const STATS = [
  {
    number: 12000,
    suffix: "+",
    label: "Files Processed",
    bg: "fm-st-stat-card-yellow",
  },
  {
    number: 98,
    suffix: "%",
    label: "User Satisfaction",
    bg: "fm-st-stat-card-dark",
  },
  {
    number: 35,
    suffix: "+",
    label: "Creative Tools Planned",
    bg: "fm-st-stat-card-light",
  },
  {
    number: 24,
    suffix: "/7",
    label: "Cloud Availability",
    bg: "fm-st-stat-card-gray",
  },
];

const IMAGES = [stat1, stat2, stat3, stat4];

export default function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="fm-st-stats" ref={ref}>
      <div className="fm-st-stats-container">
        {/* LEFT */}
        <div className="fm-st-stats-left">
          <div className="fm-st-section-tag">
            <span>Platform Growth</span>
          </div>

          <h2>
            Powering thousands of{" "}
            <span className="fm-st-highlight">creative tasks</span> every single
            day
          </h2>

          <p>
            Focus Studio is expanding into a complete creative utility platform
            designed to simplify productivity, optimize media, and help users
            work faster online.
          </p>

          <div className="fm-st-stats-grid">
            {STATS.map((item, index) => (
              <motion.div
                key={index}
                className={`fm-st-stat-card ${item.bg}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
              >
                <h3>
                  {inView && (
                    <CountUp end={item.number} duration={2.4} separator="," />
                  )}
                  {item.suffix}
                </h3>

                <p>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          className="fm-st-stats-right"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="fm-st-stats-swiper"
          >
            {IMAGES.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="fm-st-stats-image">
                  <img src={img} alt="Focus Studio preview" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
