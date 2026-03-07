const features = ['7 Seater Comfort', 'Air Conditioning', 'Large Luggage Space', 'Clean Interior', 'Professional Driver'];

function VehicleDetails() {
  return (
    <section className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold">Maruti Suzuki Ertiga</h2>
        <p className="mt-2 w-full break-words text-sm text-slate-600">Single dedicated vehicle for quality-controlled service and reliable booking management.</p>
        
        <div className="mt-4">
          <img 
            src="https://images.unsplash.com/photo-1758223725156-ee49cc327a46?auto=format&fit=crop&w=600&q=80" 
            alt="Maruti Suzuki Ertiga" 
            className="h-auto w-full rounded-lg object-cover shadow-md"
          />
        </div>
      </div>
      
      <ul className="grid gap-2 text-sm text-slate-700">
        {features.map((feature) => (
          <li key={feature} className="rounded-md bg-slate-50 px-3 py-2">
            ✓ {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default VehicleDetails;
