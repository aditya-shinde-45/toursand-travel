import PricingManager from '../../components/admin/PricingManager';
import VehicleManager from '../../components/admin/VehicleManager';

function SettingsPage() {
  return (
    <div className="grid gap-6">
      <PricingManager />
      <VehicleManager />
    </div>
  );
}

export default SettingsPage;
