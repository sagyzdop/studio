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
import { Input } from '../ui/input';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import * as api from '../../lib/api';
import { Textarea } from '../ui/textarea'; // Import Textarea component

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  sqlQuery: z.string().min(1, { message: 'SQL Query is required.' }), // Add sqlQuery to schema
});

export function AddToDashboardModal({
  sqlQuery: initialSqlQuery, // Rename prop to avoid conflict with form field
}: {
  sqlQuery: string;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      sqlQuery: initialSqlQuery, // Set initial value for sqlQuery
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.addChartToDashboard({
        title: values.title,
        sqlQuery: values.sqlQuery, // Use value from form
      });
      toast({
        title: 'Chart Added',
        description: 'The chart has been successfully added to your dashboard.',
      });
      setOpen(false);
      form.reset();
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
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Dashboard</DialogTitle>
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
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}