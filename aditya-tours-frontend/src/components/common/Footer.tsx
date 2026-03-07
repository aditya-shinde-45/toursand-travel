import { Link } from 'react-router-dom';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../../utils/constants';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Aditya Tours & Travels</h3>
          <p className="mt-2 text-sm text-slate-600">Reliable Ertiga taxi booking from Thane for city, airport, and outstation trips.</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Quick Links</h3>
          <div className="mt-2 grid gap-1 text-sm text-slate-600">
            <Link to="/">Home</Link>
            <Link to="/book">Book Taxi</Link>
            <Link to="/track">Track Booking</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Contact</h3>
          <div className="mt-2 grid gap-1 text-sm text-slate-600">
            <a href={`tel:${SUPPORT_PHONE}`}>{SUPPORT_PHONE}</a>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <p>Business Hours: 24/7 (Pre-confirmed rides)</p>
            <p>Response Time: Within 2 hours</p>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
