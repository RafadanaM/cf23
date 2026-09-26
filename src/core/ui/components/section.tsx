import { HTMLMotionProps, motion } from 'motion/react';
import { PropsWithChildren } from 'react';
import { useMediaQuery } from '@/core/hooks/useMediaQuery';
import { cn } from '../utils';

interface SectionProps extends HTMLMotionProps<'section'> {
  title: string;
  className?: string;
}

function Section({
  title,
  className,
  children,
  ...rest
}: PropsWithChildren<SectionProps>) {
  const matches = useMediaQuery('(min-width: 48rem)');
  return (
    <motion.section
      {...rest}
      initial={{
        y: matches ? '0%' : '100%',
        x: matches ? '-100%' : '0%',
        opacity: 0
      }}
      animate={{
        y: '0%',
        x: '0%',
        opacity: 1
      }}
      exit={{
        y: matches ? '0%' : '100%',
        x: matches ? '-100%' : '0%',
        opacity: 0
      }}
      transition={{
        type: 'tween',
        duration: 0.15
      }}
      className="fixed flex flex-col top-0 left-0 right-0 bottom-0 bg-secondary md:right-auto md:w-96 md:shadow-2xl"
    >
      <h2 className="text-xl text-primary font-bold p-4">{title}</h2>
      <div className={cn('flex flex-col gap-2 px-2 overflow-auto', className)}>
        {children}
      </div>
    </motion.section>
  );
}

export default Section;
