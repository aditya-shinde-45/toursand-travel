import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function MumbaiAirportCabPage() {
  return (
    <SeoLandingTemplate
      title="Mumbai Airport Cab Service"
      seoTitle="Mumbai Airport Cab | Airport Taxi Booking Mumbai - Aditya Tours & Travels"
      seoDescription="Book Mumbai airport cab service for T1 & T2 pick-up & drop. Serving Thane, Navi Mumbai & all Mumbai suburbs. On-time guaranteed, 24/7 available, clean AC Ertiga cabs."
      path="/mumbai-airport-cab"
      subtitle="Reliable, on-time airport taxi to and from Mumbai Chhatrapati Shivaji Maharaj International Airport (T1 & T2)."
      serviceAreasTitle="Pickup Areas for Mumbai Airport Cab"
      serviceAreas={['Thane West', 'Thane East', 'Navi Mumbai', 'Vashi', 'Kharghar', 'Andheri', 'Bandra', 'Borivali', 'Mulund', 'Airoli', 'Panvel', 'Belapur', 'Nerul']}
      keywords="Mumbai airport cab, airport taxi Mumbai, Mumbai T1 taxi, Mumbai T2 cab, airport transfer Thane, Navi Mumbai airport cab, Thane to Mumbai airport taxi, Mumbai airport pickup, airport drop Mumbai, cab to Mumbai airport"
      faqs={[
        { question: 'Do you provide Mumbai airport pick-up and drop?', answer: 'Yes, we cover both T1 (Domestic) and T2 (International/Domestic) terminals at CSMIA Mumbai.' },
        { question: 'How early will the driver arrive for airport pick-up?', answer: 'Our driver arrives 10–15 minutes before the scheduled time. We track flights for delays and adjust.' },
        { question: 'What is the fare from Thane to Mumbai Airport?', answer: 'Approx. ₹1,200–₹1,500 one-way depending on exact pickup point and traffic. Contact us for a fixed quote.' },
        { question: 'What is the fare from Navi Mumbai to Mumbai Airport?', answer: 'Approx. ₹1,100–₹1,500 depending on the node in Navi Mumbai. WhatsApp us for a quick quote.' },
        { question: 'Is the service available for midnight flights?', answer: 'Yes, 24/7 including midnight, early morning, and late-night airport transfers.' },
      ]}
      points={[
        'On-time pickup guaranteed — driver tracks your flight',
        '24/7 service including midnight and early morning flights',
        'Clean, AC 7-seater Ertiga cab for comfortable travel',
        'Both T1 and T2 terminals covered at CSMIA Mumbai',
        'Pickup from Thane, Navi Mumbai, and all Mumbai areas',
        'Fixed rates — no surge pricing or hidden charges',
      ]}
    />
  );
}

export default MumbaiAirportCabPage;
