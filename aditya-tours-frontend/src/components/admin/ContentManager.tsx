import { useState, useEffect } from 'react';
import Input from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import type { FooterSectionContent, HeroSectionContent, PricingSectionContent } from '../../types/content';
import RouteManager from './RouteManager.tsx';
import {
  DEFAULT_FOOTER_SECTION_CONTENT,
  DEFAULT_HERO_SECTION_CONTENT,
  DEFAULT_POPULAR_ROUTES_SECTION_CONTENT,
  DEFAULT_PRICING_SECTION_CONTENT,
  getFooterSectionContentFromDB,
  getHeroSectionContentFromDB,
  getPopularRoutesSectionContentFromDB,
  getPricingSectionContent,
  resetFooterSectionContent,
  resetHeroSectionContent,
  resetPopularRoutesSectionContent,
  resetPricingSectionContent,
  saveFooterSectionContent,
  saveHeroSectionContent,
  savePopularRoutesSectionContent,
  savePricingSectionContent,
} from '../../services/contentSettingsService';

function ContentManager() {
  const { showToast } = useToast();
  // Initialize with defaults only - fetch from database via useEffect
  const [pricingContent, setPricingContent] = useState<PricingSectionContent>(DEFAULT_PRICING_SECTION_CONTENT);
  const [heroContent, setHeroContent] = useState(DEFAULT_HERO_SECTION_CONTENT);
  const [footerContent, setFooterContent] = useState(DEFAULT_FOOTER_SECTION_CONTENT);
  const [popularRoutesContent, setPopularRoutesContent] = useState(DEFAULT_POPULAR_ROUTES_SECTION_CONTENT);
  const [loadingPricing, setLoadingPricing] = useState(true);

  // Load all content from database (API) on component mount
  useEffect(() => {
    async function loadAllContent() {
      try {
        setLoadingPricing(true);
        const [pricingData, heroData, footerData, popularRoutesData] = await Promise.all([
          getPricingSectionContent(),
          getHeroSectionContentFromDB(),
          getFooterSectionContentFromDB(),
          getPopularRoutesSectionContentFromDB(),
        ]);

        setPricingContent(pricingData);
        setHeroContent(heroData);
        setFooterContent(footerData);
        setPopularRoutesContent(popularRoutesData);
        console.log('Loaded all content from database');
      } catch (error) {
        console.error('Failed to load content from database:', error);
        showToast('error', 'Failed to load content. Using defaults.');
      } finally {
        setLoadingPricing(false);
      }
    }
    loadAllContent();
  }, [showToast]);

  const hasEmptyValues = <T extends object>(content: T) =>
    Object.values(content).some((value) => typeof value === 'string' && !value.trim());

  const updateHeroField = (field: keyof HeroSectionContent, value: string) => {
    setHeroContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFooterField = (field: keyof FooterSectionContent, value: string) => {
    setFooterContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Content Manager</h2>
        <p className="text-sm text-slate-600">Update home page content blocks from admin panel.</p>
      </div>

      <RouteManager />

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Popular Routes Section</h3>
        <p className="mt-1 text-sm text-slate-600">Edit heading and subheading shown above route cards.</p>

        <div className="mt-4 grid gap-3">
          <Input
            label="Section Title"
            value={popularRoutesContent.title}
            onChange={(event) => {
              setPopularRoutesContent((prev) => ({
                ...prev,
                title: event.target.value,
              }));
            }}
            placeholder="Popular Routes from Thane"
          />

          <Input
            label="Section Subtitle"
            value={popularRoutesContent.subtitle}
            onChange={(event) => {
              setPopularRoutesContent((prev) => ({
                ...prev,
                subtitle: event.target.value,
              }));
            }}
            placeholder="Book your most common destinations at fixed rates"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={async () => {
                if (!popularRoutesContent.title.trim() || !popularRoutesContent.subtitle.trim()) {
                  showToast('error', 'Title and subtitle are required');
                  return;
                }

                try {
                  await savePopularRoutesSectionContent({
                    title: popularRoutesContent.title.trim(),
                    subtitle: popularRoutesContent.subtitle.trim(),
                  });
                  showToast('success', 'Popular routes heading updated');
                } catch {
                  showToast('error', 'Failed to update popular routes heading');
                }
              }}
            >
              Save Changes
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  const resetData = await resetPopularRoutesSectionContent();
                  setPopularRoutesContent(resetData);
                  showToast('info', 'Popular routes heading reset to default');
                } catch {
                  showToast('error', 'Failed to reset popular routes heading');
                }
              }}
            >
              Reset Default
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Pricing Section</h3>
        <p className="mt-1 text-sm text-slate-600">Edit all pricing packages, rates, and labels displayed on the home page.</p>

        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Section Title"
              value={pricingContent.title}
              onChange={(event) => {
                setPricingContent((prev) => ({
                  ...prev,
                  title: event.target.value,
                }));
              }}
              placeholder="Our Pricing Packages"
            />

            <Input
              label="Section Subtitle"
              value={pricingContent.subtitle}
              onChange={(event) => {
                setPricingContent((prev) => ({
                  ...prev,
                  subtitle: event.target.value,
                }));
              }}
              placeholder="Choose the perfect package for your journey"
            />
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Pricing Packages</h4>
            <p className="mb-3 text-xs text-slate-500">Edit the 6 pricing packages shown in the table</p>
            <div className="grid gap-4">
              {pricingContent.packages && Array.isArray(pricingContent.packages) && pricingContent.packages.length > 0 ? (
                pricingContent.packages.map((pkg, index) => {
                  // Ensure pkg is a valid object with required properties
                  if (!pkg || typeof pkg !== 'object') return null;
                  
                  return (
                    <div key={pkg.id || `pkg-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <h5 className="mb-2 text-xs font-semibold text-slate-600">Package {index + 1}</h5>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <Input
                          label="Package Name"
                          value={pkg.packageName ? String(pkg.packageName) : ''}
                          onChange={(event) => {
                            setPricingContent((prev) => ({
                              ...prev,
                              packages: prev.packages.map((p, i) =>
                                i === index ? { ...p, packageName: event.target.value } : p
                              ),
                            }));
                          }}
                          placeholder="2 Hours"
                        />
                        <Input
                          label="Duration (hours)"
                          type="number"
                          value={String(pkg.durationHours != null ? pkg.durationHours : 0)}
                          onChange={(event) => {
                            setPricingContent((prev) => ({
                              ...prev,
                              packages: prev.packages.map((p, i) =>
                                i === index ? { ...p, durationHours: parseInt(event.target.value) || 0 } : p
                              ),
                            }));
                          }}
                          placeholder="2"
                        />
                        <Input
                          label="Km Limit"
                          type="number"
                          value={String(pkg.includedKm != null ? pkg.includedKm : 0)}
                          onChange={(event) => {
                            setPricingContent((prev) => ({
                              ...prev,
                              packages: prev.packages.map((p, i) =>
                                i === index ? { ...p, includedKm: parseInt(event.target.value) || 0 } : p
                              ),
                            }));
                          }}
                          placeholder="20"
                        />
                        <Input
                          label="Price (₹)"
                          type="number"
                          value={String(pkg.packagePrice != null ? pkg.packagePrice : 0)}
                          onChange={(event) => {
                            setPricingContent((prev) => ({
                              ...prev,
                              packages: prev.packages.map((p, i) =>
                                i === index ? { ...p, packagePrice: parseInt(event.target.value) || 0 } : p
                              ),
                            }));
                          }}
                          placeholder="1200"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-sm text-slate-600">
                  No pricing packages available. Please check your API connection.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Additional Charges Section</h4>
            <div className="grid gap-3">
              <Input
                label="Additional Charges Title"
                value={pricingContent.additionalChargesTitle}
                onChange={(event) => {
                  setPricingContent((prev) => ({
                    ...prev,
                    additionalChargesTitle: event.target.value,
                  }));
                }}
                placeholder="Additional Charges"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Extra Kilometer Label"
                  value={pricingContent.extraKmLabel}
                  onChange={(event) => {
                    setPricingContent((prev) => ({
                      ...prev,
                      extraKmLabel: event.target.value,
                    }));
                  }}
                  placeholder="Extra Kilometer"
                />

                <Input
                  label="Extra Kilometer Rate"
                  value={pricingContent.extraKmRate}
                  onChange={(event) => {
                    setPricingContent((prev) => ({
                      ...prev,
                      extraKmRate: event.target.value,
                    }));
                  }}
                  placeholder="₹15 per km"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Extra Hour Label"
                  value={pricingContent.extraHourLabel}
                  onChange={(event) => {
                    setPricingContent((prev) => ({
                      ...prev,
                      extraHourLabel: event.target.value,
                    }));
                  }}
                  placeholder="Extra Hour"
                />

                <Input
                  label="Extra Hour Rate"
                  value={pricingContent.extraHourRate}
                  onChange={(event) => {
                    setPricingContent((prev) => ({
                      ...prev,
                      extraHourRate: event.target.value,
                    }));
                  }}
                  placeholder="₹150 per hour"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={loadingPricing}
              onClick={async () => {
                // Validate all fields including packages
                const hasEmptyStrings = Object.entries(pricingContent).some(([key, value]) => {
                  if (key === 'packages') return false;
                  return typeof value === 'string' && !value.trim();
                });

                const hasInvalidPackages = pricingContent.packages.some(
                  (pkg) => !pkg.packageName.trim() || pkg.durationHours <= 0 || pkg.includedKm <= 0 || pkg.packagePrice <= 0
                );

                if (hasEmptyStrings || hasInvalidPackages) {
                  showToast('error', 'All pricing fields are required and must be valid');
                  return;
                }

                try {
                  setLoadingPricing(true);
                  await savePricingSectionContent({
                    title: pricingContent.title.trim(),
                    subtitle: pricingContent.subtitle.trim(),
                    additionalChargesTitle: pricingContent.additionalChargesTitle.trim(),
                    extraKmLabel: pricingContent.extraKmLabel.trim(),
                    extraKmRate: pricingContent.extraKmRate.trim(),
                    extraHourLabel: pricingContent.extraHourLabel.trim(),
                    extraHourRate: pricingContent.extraHourRate.trim(),
                    packages: pricingContent.packages.map((pkg) => ({
                      ...pkg,
                      packageName: pkg.packageName.trim(),
                    })),
                  });
                  showToast('success', 'Pricing section updated via API');
                  
                  // Re-fetch from API to ensure table displays latest data
                  const refreshedData = await getPricingSectionContent();
                  setPricingContent(refreshedData);
                } catch (error) {
                  showToast('error', 'Pricing saved locally, API update failed');
                } finally {
                  setLoadingPricing(false);
                }
              }}
            >
              {loadingPricing ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={loadingPricing}
              onClick={async () => {
                try {
                  setLoadingPricing(true);
                  const resetData = await resetPricingSectionContent();
                  setPricingContent(resetData);
                  showToast('info', 'Pricing section reset to default via API');
                } catch (error) {
                  setPricingContent(DEFAULT_PRICING_SECTION_CONTENT);
                  showToast('error', 'Pricing reset locally, API reset failed');
                } finally {
                  setLoadingPricing(false);
                }
              }}
            >
              {loadingPricing ? 'Resetting...' : 'Reset Default'}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Hero Section</h3>
        <p className="mt-1 text-sm text-slate-600">Edit all text and contact values shown in hero banner.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Badge Text" value={heroContent.badgeText} onChange={(event) => updateHeroField('badgeText', event.target.value)} />
          <Input label="Title Line 1" value={heroContent.titleLine1} onChange={(event) => updateHeroField('titleLine1', event.target.value)} />
          <Input label="Title Line 2" value={heroContent.titleLine2} onChange={(event) => updateHeroField('titleLine2', event.target.value)} />
          <Input label="Chip: Rating" value={heroContent.chipRating} onChange={(event) => updateHeroField('chipRating', event.target.value)} />
          <Input label="Chip: Service" value={heroContent.chipService} onChange={(event) => updateHeroField('chipService', event.target.value)} />
          <Input label="Chip: Routes" value={heroContent.chipRoutes} onChange={(event) => updateHeroField('chipRoutes', event.target.value)} />
          <Input label="Primary Button Text" value={heroContent.primaryButtonText} onChange={(event) => updateHeroField('primaryButtonText', event.target.value)} />
          <Input label="Secondary Button Text" value={heroContent.secondaryButtonText} onChange={(event) => updateHeroField('secondaryButtonText', event.target.value)} />
          <Input label="Call Phone" value={heroContent.callPhone} onChange={(event) => updateHeroField('callPhone', event.target.value)} />
          <Input label="Stat 1 Value" value={heroContent.stat1Value} onChange={(event) => updateHeroField('stat1Value', event.target.value)} />
          <Input label="Stat 1 Label" value={heroContent.stat1Label} onChange={(event) => updateHeroField('stat1Label', event.target.value)} />
          <Input label="Stat 1 Sub Label" value={heroContent.stat1SubLabel} onChange={(event) => updateHeroField('stat1SubLabel', event.target.value)} />
          <Input label="Stat 2 Value" value={heroContent.stat2Value} onChange={(event) => updateHeroField('stat2Value', event.target.value)} />
          <Input label="Stat 2 Label" value={heroContent.stat2Label} onChange={(event) => updateHeroField('stat2Label', event.target.value)} />
          <Input label="Stat 3 Value" value={heroContent.stat3Value} onChange={(event) => updateHeroField('stat3Value', event.target.value)} />
          <Input label="Stat 3 Label" value={heroContent.stat3Label} onChange={(event) => updateHeroField('stat3Label', event.target.value)} />
          <Input label="Image URL" value={heroContent.imageUrl} onChange={(event) => updateHeroField('imageUrl', event.target.value)} />
          <Input label="Image Alt Text" value={heroContent.imageAlt} onChange={(event) => updateHeroField('imageAlt', event.target.value)} />
          <Input label="Floating Card Label" value={heroContent.floatingCardTopLabel} onChange={(event) => updateHeroField('floatingCardTopLabel', event.target.value)} />
          <Input label="Floating Card Value" value={heroContent.floatingCardTopValue} onChange={(event) => updateHeroField('floatingCardTopValue', event.target.value)} />
          <Input label="Floating Badge" value={heroContent.floatingBadge} onChange={(event) => updateHeroField('floatingBadge', event.target.value)} />
          <Input label="Floating Tag" value={heroContent.floatingTag} onChange={(event) => updateHeroField('floatingTag', event.target.value)} />
        </div>

        <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">
          <span>Description</span>
          <textarea
            value={heroContent.description}
            onChange={(event) => updateHeroField('description', event.target.value)}
            rows={3}
            className="rounded-lg border border-slate-300 p-3 outline-none ring-blue-500 transition focus:ring"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={async () => {
              if (hasEmptyValues(heroContent)) {
                showToast('error', 'All hero fields are required');
                return;
              }

              const trimmed = Object.fromEntries(
                Object.entries(heroContent).map(([key, value]) => [key, value.trim()]),
              ) as HeroSectionContent;
              try {
                await saveHeroSectionContent(trimmed);
                setHeroContent(trimmed);
                showToast('success', 'Hero section updated');
              } catch {
                showToast('error', 'Failed to update hero section');
              }
            }}
          >
            Save Hero Section
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                const resetData = await resetHeroSectionContent();
                setHeroContent(resetData);
                showToast('info', 'Hero section reset to default');
              } catch {
                showToast('error', 'Failed to reset hero section');
              }
            }}
          >
            Reset Hero Default
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Footer Section</h3>
        <p className="mt-1 text-sm text-slate-600">Edit all footer headings, links text, and contact details.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Brand Title" value={footerContent.brandTitle} onChange={(event) => updateFooterField('brandTitle', event.target.value)} />
          <Input label="Quick Links Title" value={footerContent.quickLinksTitle} onChange={(event) => updateFooterField('quickLinksTitle', event.target.value)} />
          <Input label="Contact Title" value={footerContent.contactTitle} onChange={(event) => updateFooterField('contactTitle', event.target.value)} />
          <Input label="Home Link Label" value={footerContent.linkHomeLabel} onChange={(event) => updateFooterField('linkHomeLabel', event.target.value)} />
          <Input label="Book Link Label" value={footerContent.linkBookLabel} onChange={(event) => updateFooterField('linkBookLabel', event.target.value)} />
          <Input label="Privacy Link Label" value={footerContent.linkPrivacyLabel} onChange={(event) => updateFooterField('linkPrivacyLabel', event.target.value)} />
          <Input label="Terms Link Label" value={footerContent.linkTermsLabel} onChange={(event) => updateFooterField('linkTermsLabel', event.target.value)} />
          <Input label="Contact Phone" value={footerContent.contactPhone} onChange={(event) => updateFooterField('contactPhone', event.target.value)} />
          <Input label="Contact Email" value={footerContent.contactEmail} onChange={(event) => updateFooterField('contactEmail', event.target.value)} />
          <Input label="Business Hours" value={footerContent.businessHours} onChange={(event) => updateFooterField('businessHours', event.target.value)} />
          <Input label="Response Time" value={footerContent.responseTime} onChange={(event) => updateFooterField('responseTime', event.target.value)} />
        </div>

        <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">
          <span>Brand Description</span>
          <textarea
            value={footerContent.brandDescription}
            onChange={(event) => updateFooterField('brandDescription', event.target.value)}
            rows={3}
            className="rounded-lg border border-slate-300 p-3 outline-none ring-blue-500 transition focus:ring"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={async () => {
              if (hasEmptyValues(footerContent)) {
                showToast('error', 'All footer fields are required');
                return;
              }

              const trimmed = Object.fromEntries(
                Object.entries(footerContent).map(([key, value]) => [key, value.trim()]),
              ) as FooterSectionContent;
              try {
                await saveFooterSectionContent(trimmed);
                setFooterContent(trimmed);
                showToast('success', 'Footer section updated');
              } catch {
                showToast('error', 'Failed to update footer section');
              }
            }}
          >
            Save Footer Section
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                const resetData = await resetFooterSectionContent();
                setFooterContent(resetData);
                showToast('info', 'Footer section reset to default');
              } catch {
                showToast('error', 'Failed to reset footer section');
              }
            }}
          >
            Reset Footer Default
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ContentManager;
