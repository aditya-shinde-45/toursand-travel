import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function CarRentalThanePage() {
  return (
    <SeoLandingTemplate
      title="Car Rental in Thane"
      seoTitle="Car Rental in Thane | Hire a Cab with Driver - Aditya Tours & Travels"
      seoDescription="Hire a car with driver in Thane for local hourly packages, full-day rental, airport drops & outstation trips. Affordable rates, AC Ertiga, 24/7 service. Book your Thane car rental now!"
      path="/car-rental-thane"
      subtitle="Flexible car rental with driver in Thane — hourly packages, full-day hire, airport transfers, and outstation trips."
      serviceAreasTitle="Car Rental Areas in Thane"
      serviceAreas={['Thane West', 'Thane East', 'Ghodbunder Road', 'Majiwada', 'Naupada', 'Kopri', 'Vartak Nagar', 'Balkum', 'Manpada', 'Pokhran Road', 'Hiranandani Estate']}
      keywords="car rental Thane, car hire Thane, rent a car Thane, cab with driver Thane, hourly car rental Thane, self drive cab Thane, full day cab Thane, outstation car rental Thane, Thane car hire, taxi rental Thane"
      faqs={[
        { question: 'What are the car rental packages in Thane?', answer: 'We offer 2-hour (20 km), 4-hour (40 km), 6-hour (60 km), 8-hour (80 km) and full-day packages starting from ₹1,200.' },
        { question: 'Is the car rental in Thane available for outstation trips?', answer: 'Yes, we offer outstation cab rental from Thane to Pune, Nashik, Lonavala, Shirdi, Goa, Satara and more.' },
        { question: 'Can I hire a cab for office commute in Thane?', answer: 'Yes, we provide daily rental and monthly contract packages for office commute in Thane.' },
        { question: 'What vehicle is available for car rental in Thane?', answer: 'We provide clean, AC 7-seater Maruti Suzuki Ertiga with a professional driver.' },
        { question: 'How do I book a car rental in Thane?', answer: 'Book online via our website, call us, or WhatsApp for instant confirmation.' },
      ]}
      points={[
        'Flexible hourly car rental packages starting at ₹1,200',
        'Full-day and outstation car rental available',
        'Clean, AC 7-seater Ertiga with professional driver',
        'Transparent rates — no hidden charges, no extra toll surprises',
        'Available 24/7 across Thane suburbs',
        'Office commute, events, shopping, hospital visits and more',
      ]}
    />
  );
}

export default CarRentalThanePage;
