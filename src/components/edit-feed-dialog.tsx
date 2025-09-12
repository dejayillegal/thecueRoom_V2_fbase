
'use client';

import { useState, useEffect } from 'react';
import type { RssFeed } from '@/lib/rss-feeds';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface EditFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (updatedFeed: RssFeed) => void;
  feed: RssFeed;
  isPending: boolean;
}

export default function EditFeedDialog({ open, onOpenChange, onConfirm, feed, isPending }: EditFeedDialogProps) {
  const [editedFeed, setEditedFeed] = useState<RssFeed>(feed);

  useEffect(() => {
    setEditedFeed(feed);
  }, [feed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFeed(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    onConfirm(editedFeed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Edit Feed</DialogTitle>
          <DialogDescription>
            Update the details for the feed. The URL cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedFeed.name}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={editedFeed.category}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Region
            </Label>
            <Input
              id="region"
              name="region"
              value={editedFeed.region}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              name="url"
              value={editedFeed.url}
              className="col-span-3"
              readOnly
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            <X /> Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            <Save /> {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
