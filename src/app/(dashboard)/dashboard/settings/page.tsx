import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site.config';
import { features } from '@/config/features.config';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Settings</h1>
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Site Configuration</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Nama Situs</span><span className="font-medium text-slate-900">{siteConfig.name}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Email</span><span className="text-slate-700">{siteConfig.contact.email}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-500">WhatsApp</span><span className="text-slate-700">{siteConfig.contact.whatsapp}</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Feature Flags</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(features)
                .filter(([, v]) => typeof v === 'boolean')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-slate-100 last:border-b-0">
                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Badge variant={value ? 'success' : 'secondary'}>{value ? 'ON' : 'OFF'}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
