import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function NaviMumbaiTaxiServicePage() {
  return (
    <SeoLandingTemplate
      title="Navi Mumbai Taxi Service"
      seoTitle="Taxi Service in Navi Mumbai | Book Reliable Cab - Aditya Tours & Travels"
      seoDescription="Book affordable taxi service in Navi Mumbai for airport transfers, city rides & outstation travel. Serving Vashi, Kharghar, Nerul, Belapur, Panvel & all Navi Mumbai nodes. 24/7 available."
      path="/navi-mumbai-taxi-service"
      subtitle="Affordable and reliable taxi service across all Navi Mumbai nodes — airport drops, city rides, and outstation journeys."
      serviceAreasTitle="Service Areas in Navi Mumbai"
      serviceAreas={['Vashi', 'Kharghar', 'Nerul', 'Belapur', 'CBD Belapur', 'Airoli', 'Ghansoli', 'Kopar Khairane', 'Panvel', 'Seawoods', 'Sanpada', 'Kalamboli', 'Ulwe']}
      keywords="taxi service Navi Mumbai, cab service Navi Mumbai, car rental Navi Mumbai, Navi Mumbai airport taxi, Vashi cab, Kharghar taxi, Nerul cab, Panvel taxi, outstation cab Navi Mumbai, taxi near me Navi Mumbai"
      faqs={[
        { question: 'How do I book a taxi in Navi Mumbai?', answer: 'Book via our online form, call us, or WhatsApp us. We confirm your cab in minutes.' },
        { question: 'Do you cover all areas of Navi Mumbai?', answer: 'Yes — Vashi, Kharghar, Nerul, Belapur, Airoli, Ghansoli, Panvel, Seawoods and more.' },
        { question: 'What is the fare for Navi Mumbai cab service?', answer: 'Local fares start from ₹1,200. Airport drops and outstation fares vary by distance. No hidden charges.' },
        { question: 'Is 24/7 cab service available in Navi Mumbai?', answer: 'Yes, we are available 24/7 including early morning and late-night airport pickups.' },
      ]}
      points={[
        '24/7 taxi service across all Navi Mumbai nodes',
        'Clean, spacious 7-seater Ertiga with AC and professional driver',
        'Transparent pricing — no hidden charges',
        'Airport transfers to Mumbai T1, T2 and Navi Mumbai helipad',
        'Easy online and WhatsApp booking',
        'Outstation trips to Pune, Nashik, Lonavala, Goa, Shirdi and more',
      ]}
    />
  );
}

export default NaviMumbaiTaxiServicePage;
