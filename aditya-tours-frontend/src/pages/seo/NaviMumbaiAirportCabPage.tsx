import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function NaviMumbaiAirportCabPage() {
  return (
    <SeoLandingTemplate
      title="Navi Mumbai Airport Cab Service"
      seoTitle="Navi Mumbai Airport Cab | Airport Taxi Navi Mumbai - Aditya Tours & Travels"
      seoDescription="Book airport cab from Navi Mumbai to Mumbai Airport T1 & T2. Pick-up from Vashi, Kharghar, Nerul, Belapur, Panvel & all Navi Mumbai nodes. 24/7 on-time service."
      path="/navi-mumbai-airport-cab"
      subtitle="Reliable airport taxi from Navi Mumbai to Mumbai Chhatrapati Shivaji Maharaj International Airport — T1 and T2."
      serviceAreasTitle="Pickup Areas in Navi Mumbai"
      serviceAreas={['Vashi', 'Sanpada', 'Nerul', 'Seawoods', 'Belapur', 'CBD Belapur', 'Kharghar', 'Kalamboli', 'Panvel', 'Ulwe', 'Airoli', 'Ghansoli', 'Kopar Khairane']}
      keywords="Navi Mumbai airport cab, airport taxi Navi Mumbai, Navi Mumbai to Mumbai airport, Vashi airport taxi, Kharghar airport cab, Nerul airport taxi, Panvel airport cab, Belapur airport taxi, airport transfer Navi Mumbai, cab to airport Navi Mumbai"
      faqs={[
        { question: 'Do you pick up from all Navi Mumbai nodes for Mumbai Airport?', answer: 'Yes, we pick up from Vashi, Sanpada, Nerul, Belapur, Kharghar, Panvel, Airoli, Ghansoli and all nearby areas.' },
        { question: 'How long does it take from Navi Mumbai to Mumbai Airport?', answer: 'Typically 45–90 minutes depending on traffic and your specific node in Navi Mumbai.' },
        { question: 'What is the fare from Kharghar to Mumbai Airport?', answer: 'Approximately ₹1,200–₹1,500. Contact us for a fixed quote.' },
        { question: 'What is the fare from Vashi to Mumbai Airport?', answer: 'Approximately ₹900–₹1,200. Contact us for a fixed quote.' },
        { question: 'Is early morning and late night airport cab available?', answer: 'Yes, 24/7 service for all flight timings including very early and very late departures/arrivals.' },
      ]}
      points={[
        'Pickup from all Navi Mumbai nodes — Vashi to Panvel and beyond',
        '24/7 availability for all flight timings',
        'Clean, spacious 7-seater AC Ertiga cab',
        'Driver arrives 10–15 minutes early',
        'Fixed rates with no surge pricing',
        'Both T1 (Domestic) and T2 (International) terminals served',
      ]}
    />
  );
}

export default NaviMumbaiAirportCabPage;
