import { ReactNode } from 'react';
import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

interface CategoryCubeProps {
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
  to: string;
}

export function CategoryCube({ title, description, icon, index, to }: CategoryCubeProps) {
  // The <a> is the grid item: it must carry the sizing classes, otherwise it
  // shrink-wraps to its content and tiles with shorter titles render smaller.
  return (
    <Link
      to={to}
      className="group block aspect-square w-full max-w-[180px] md:max-w-[200px]"
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.6,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -6 }}
        className="flex h-full w-full flex-col items-center justify-center gap-3 border border-ink/10 bg-paper p-4 text-center transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="flex h-14 w-14 items-center justify-center text-ink/90 transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>

        <div className="space-y-1">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-ink">
            {title}
          </h3>
          <p className="font-sans text-[10px] font-light uppercase tracking-wider text-ink/50">
            {description}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
