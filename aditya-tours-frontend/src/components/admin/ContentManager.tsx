import { useState } from 'react';
import Input from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import {
  DEFAULT_POPULAR_ROUTES_SECTION_CONTENT,
  getPopularRoutesSectionContent,
  resetPopularRoutesSectionContent,
  savePopularRoutesSectionContent,
} from '../../services/contentSettingsService';

function ContentManager() {
  const { showToast } = useToast();
  const [popularRoutesContent, setPopularRoutesContent] = useState(getPopularRoutesSectionContent());

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Content Manager</h2>
        <p className="text-sm text-slate-600">Update home page content blocks from admin panel.</p>
      </div>

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
              onClick={() => {
                if (!popularRoutesContent.title.trim() || !popularRoutesContent.subtitle.trim()) {
                  showToast('error', 'Title and subtitle are required');
                  return;
                }

                savePopularRoutesSectionContent({
                  title: popularRoutesContent.title.trim(),
                  subtitle: popularRoutesContent.subtitle.trim(),
                });
                showToast('success', 'Popular routes heading updated');
              }}
            >
              Save Changes
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetPopularRoutesSectionContent();
                setPopularRoutesContent(DEFAULT_POPULAR_ROUTES_SECTION_CONTENT);
                showToast('info', 'Popular routes heading reset to default');
              }}
            >
              Reset Default
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContentManager;
