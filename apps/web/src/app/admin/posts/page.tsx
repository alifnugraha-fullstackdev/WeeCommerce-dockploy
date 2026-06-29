'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminPostsPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Phase 2: Fetch posts from API, implement CRUD
  // Placeholder UI for now

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Blog Posts</h1>
        <Button onClick={() => setEditing('new')} className="rounded-full">+ New Post</Button>
      </div>

      {editing ? (
        <div className="space-y-4 rounded-xl border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">{editing === 'new' ? 'New Post' : 'Edit Post'}</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Content (markdown)</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} placeholder="Write your post here..." />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { /* Phase 2: save */ setEditing(null); }} className="rounded-full">Save</Button>
            <Button variant="secondary" onClick={() => setEditing(null)} className="rounded-full">Cancel</Button>
          </div>
        </div>
      ) : (
        <p className="py-10 text-center text-muted-foreground">No posts yet. Create your first post.</p>
      )}
    </div>
  );
}
