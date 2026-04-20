import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle?: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px] border-border/60 bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[15px] font-[510] tracking-[-0.01em]">
            Delete task
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-muted-foreground">
            Are you sure you want to delete{' '}
            {taskTitle ? (
              <span className="font-[510] text-foreground">"{taskTitle}"</span>
            ) : (
              'this task'
            )}
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-8 text-[13px] font-[510]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-8 text-[13px] font-[510] bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
