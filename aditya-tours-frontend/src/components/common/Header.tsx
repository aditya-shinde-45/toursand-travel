import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About Us', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Contact', id: 'contact' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const action = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(action, 80);
    } else {
      action();
    }

    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-base font-bold text-[#1B3A5F] sm:text-lg">
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-[#1B3A5F] transition-colors hover:text-[#FF9933]"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/book"
            className="rounded-lg bg-[#FF9933] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e68a2e]"
          >
            Book Now
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-[#1B3A5F] md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-[#1B3A5F] hover:bg-[#FF9933]/10"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/book"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-[#FF9933] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Book Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
