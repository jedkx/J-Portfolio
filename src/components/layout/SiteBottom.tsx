import { ArrowUp } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks';
export const SiteBottom = () => {
  const reduced = usePrefersReducedMotion();
  return (
    <footer className="site-bottom">
      <div className="contact-dock-bottom">
        <span>© {new Date().getFullYear()} CANER COŞKUN</span>
        <button
          type="button"
          className="hoverable"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })}
        >
          <span>BACK TO TOP</span>
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
};
