import { useAuthStore } from "@/hooks/auth_hook";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Copy, FolderSync, RefreshCcw } from "lucide-react";
import { Input } from "./ui/input";

export function ICSLinkDialog() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {"Sync with other calendars "}
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FolderSync className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Sync with other calendars</h3>
          </div>
        </DialogHeader>
        <div className="p-4">
          <p className="mb-2">
            You can sync your calendar with external services like Google
            Calendar or Outlook by using the iCal link below. This allows you to
            view your schedule in other calendar applications.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Input
              readOnly
              value={
                user
                  ? `https://localhost/api/calendar/${user.uid}`
                  : "Please log in to get your iCal link."
              }
            />
            {user && (
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={() => {
                  navigator.clipboard.writeText(
                    user
                      ? `https://localhost/api/calendar/${user.uid}`
                      : "Please log in to get your iCal link."
                  );
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
              </Button>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
