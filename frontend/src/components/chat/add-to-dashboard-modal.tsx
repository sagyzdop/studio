'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import * as api from '../../lib/api';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input'; // Make sure Input is imported

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  sqlQuery: z.string().min(1, { message: 'SQL Query is required.' }),
});

export function AddToDashboardModal({ // Renamed from AddToDashboardForm
  sqlQuery: initialSqlQuery,
  open,
  setOpen
}: {
  sqlQuery: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      sqlQuery: initialSqlQuery,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.addChartToDashboard({
        title: values.title,
        sqlQuery: values.sqlQuery,
      });
      toast({
        title: 'Chart Added',
        description: 'The chart has been successfully added to your dashboard.',
      });
      setOpen(false); // Close modal on success
      form.reset({
        title: '',
        sqlQuery: initialSqlQuery, // Reset sqlQuery to initial value
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add chart',
        description: 'Could not save the chart to the dashboard.',
      });
      console.error('Failed to add chart:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
            Add to Dashboard
          </DialogTitle>
          <DialogDescription>
            Give your new visualization a title and save it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quarterly Sales Growth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sqlQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SQL Query</FormLabel>
                  <FormControl>
                    <Textarea placeholder="SELECT * FROM table;" {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save to Dashboard
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}