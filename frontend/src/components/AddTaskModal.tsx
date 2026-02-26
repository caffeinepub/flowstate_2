import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Priority } from '../backend';
import { useCreateTask } from '../hooks/useQueries';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskModal({ open, onOpenChange }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.medium);
  const [dueDate, setDueDate] = useState('');

  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let dueDateBigInt: bigint | null = null;
    if (dueDate) {
      // Convert date string to nanoseconds (ICP time format)
      const dateMs = new Date(dueDate).getTime();
      dueDateBigInt = BigInt(dateMs) * BigInt(1_000_000);
    }

    await createTask.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDateBigInt,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(Priority.medium);
    setDueDate('');
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle('');
      setDescription('');
      setPriority(Priority.medium);
      setDueDate('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Add New Task</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Create a new task and add it to your board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-surface-300 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500/50 focus:ring-amber-500/20"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="bg-surface-300 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500/50 focus:ring-amber-500/20 resize-none"
            />
          </div>

          {/* Priority & Due Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as Priority)}
              >
                <SelectTrigger className="bg-surface-300 border-border text-foreground focus:border-amber-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={Priority.high} className="text-foreground focus:bg-surface-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value={Priority.medium} className="text-foreground focus:bg-surface-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value={Priority.low} className="text-foreground focus:bg-surface-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Low
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-surface-300 border-border text-foreground focus:border-amber-500/50 focus:ring-amber-500/20 [color-scheme:dark]"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-surface-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || createTask.isPending}
              className="bg-amber-500 hover:bg-amber-600 text-surface-500 font-semibold"
            >
              {createTask.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
