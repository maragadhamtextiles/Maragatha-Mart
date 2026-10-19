import { useAppSettings } from "../context/AppSettingsContext";
import { businessFromSettings } from "../lib/businessDetails";
import { BRAND } from "../config/brand";

/**
 * The sign-off under a printed report. Contact details come from Admin
 * Settings, so a line that has not been filled in is left off rather than
 * printed with a made-up number.
 */
export function PrintFooter() {
  const { settings } = useAppSettings();
  const business = businessFromSettings(settings);
  const reach = [
    business.website && `Website: ${business.website}`,
    business.email && `Email: ${business.email}`,
  ].filter(Boolean);

  return (
    <div className="print-footer mt-8 pt-4 border-t border-card-border/10 text-center text-sm text-text/60">
      <p>
        {business.name} - {BRAND.silkName} and everyday essentials under one roof
      </p>
      {reach.length > 0 && <p>{reach.join(" | ")}</p>}
      {business.phone && <p>Phone: {business.phone}</p>}
    </div>
  );
}
