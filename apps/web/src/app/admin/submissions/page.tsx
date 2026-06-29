'use client';
import { useState } from 'react';

export default function AdminSubmissionsPage() {
  const [filter, setFilter] = useState<string>('new');

  // Phase 2: Fetch submissions from API
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold">Form Submissions</h1>
      
      <div className="mb-6 flex gap-2">
        {['new', 'contacted', 'qualified', 'converted', 'spam', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === s ? 'bg-foreground text-background' : 'bg-card text-muted-foreground'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border">
        <div className="p-10 text-center text-sm text-muted-foreground">
          No submissions to display. Connect the database to view inquiries.
        </div>
      </div>
    </div>
  );
}
