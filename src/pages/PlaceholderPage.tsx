import { PageHeader, Card } from '@/components/ui';
import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={description} />
      <Card className="py-16">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
            <Construction className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-navy-900">Module in development</h3>
          <p className="text-sm text-navy-400 mt-1.5 max-w-md mx-auto">
            This module will be available in an upcoming phase. The navigation,
            role permissions, and routing for this page are already wired up.
          </p>
        </div>
      </Card>
    </div>
  );
}
