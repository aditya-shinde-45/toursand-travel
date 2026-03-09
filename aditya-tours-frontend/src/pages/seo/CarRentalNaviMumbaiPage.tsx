import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function CarRentalNaviMumbaiPage() {
  return (
    <SeoLandingTemplate
      title="Car Rental in Navi Mumbai"
      seoTitle="Car Rental in Navi Mumbai | Hire a Cab with Driver - Aditya Tours & Travels"
      seoDescription="Hire a car with driver in Navi Mumbai for hourly packages, full-day rental, airport drops & outstation trips. Serving Vashi, Kharghar, Nerul, Panvel & all Navi Mumbai nodes. Book now!"
      path="/car-rental-navi-mumbai"
      subtitle="Flexible car rental with driver in Navi Mumbai — hourly packages, full-day hire, airport transfers, and outstation journeys."
      serviceAreasTitle="Car Rental Areas in Navi Mumbai"
      serviceAreas={['Vashi', 'Sanpada', 'Nerul', 'Seawoods', 'Belapur', 'Kharghar', 'Kamothe', 'Panvel', 'Ulwe', 'Airoli', 'Ghansoli', 'Kopar Khairane', 'Kalamboli']}
      keywords="car rental Navi Mumbai, car hire Navi Mumbai, rent a car Navi Mumbai, cab with driver Navi Mumbai, hourly car rental Navi Mumbai, full day cab Navi Mumbai, outstation car hire Navi Mumbai, Vashi car rental, Kharghar cab hire, Panvel car rental"
      faqs={[
        { question: 'What car rental packages are available in Navi Mumbai?', answer: 'We offer hourly packages (2–12 hrs) and full-day options starting from ₹1,200 including a professional driver.' },
        { question: 'Do you offer outstation trips from Navi Mumbai?', answer: 'Yes — Pune, Lonavala, Nashik, Shirdi, Mahabaleshwar, Goa and more, with round-trip and one-way options.' },
        { question: 'Can I hire a car for airport transfer from Navi Mumbai?', answer: 'Yes, we offer fixed-fare airport transfers to Mumbai T1 and T2 from all Navi Mumbai nodes.' },
        { question: 'What vehicle is available for rent in Navi Mumbai?', answer: 'Clean, well-maintained AC 7-seater Maruti Suzuki Ertiga with a verified professional driver.' },
        { question: 'Is monthly car rental available in Navi Mumbai?', answer: 'Yes, we offer monthly packages for office commute, school runs, and regular travel in Navi Mumbai.' },
      ]}
      points={[
        'Hourly car rental packages starting at ₹1,200',
        'Full-day, weekly, and monthly rental options',
        'AC 7-seater Ertiga with professional, verified driver',
        'Pickup from any node in Navi Mumbai',
        'Airport transfers, office commute, events, hospital visits',
        'Outstation trips to Pune, Nashik, Shirdi, Goa, Lonavala and more',
      ]}
    />
  );
}

export default CarRentalNaviMumbaiPage;
