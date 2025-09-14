import { useAuthStore } from "@/hooks/auth_hook";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Copy, FolderSync, RefreshCcw } from "lucide-react";
import { Input } from "./ui/input";
import { config } from "@/lib/config";
import { toast } from "sonner";

export function ICSLinkDialog() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  const value = user ? `${config.api.baseUrl}/calendar/${user.uid}` : "";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {"Sync with other calendars "}
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[900px]">
        <DialogTitle>
          <div className="flex items-center gap-2">
            <FolderSync className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Sync with other calendars</h3>
          </div>
        </DialogTitle>
        <div className="p-2 flex-col gap-4 items-center">
          <p className="mb-4">
            Sync your schedule with external calendar applications like Google
            Calendar, Apple Calendar, or Outlook
            <br />
          </p>
          <h2>Google Calendar</h2>
          <p className="mb-4 text-sm text-gray-500">
            Go to Google Calendar, click the Cogwheel &gt; Settings &gt; Add
            calendar &gt; From URL, and paste the link below:
            <br />
          </p>

          <div className="flex w-full items-center gap-2">
            <Input readOnly className="flex-1 w-fit" value={value} />
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between gap-2">
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>

            {user && (
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={() => {
                  copyToClipboard(value);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
