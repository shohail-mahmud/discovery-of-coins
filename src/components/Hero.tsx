import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="about" className="relative flex min-h-[46vh] py-10 md:min-h-[62vh] md:py-14 items-center justify-center overflow-hidden bg-brand px-6">
      <div className="mx-auto max-w-6xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-tight text-ink"
        >
          Discovery
          <br />
          of Coins
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-xl font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg"
        >
          Discover and collect authentic banknotes, coins, and stamps from
          Bangladesh and around the world.
        </motion.p>
      </div>
    </section>
  );
}
