"use client";

import { useEffect, useId, useRef } from "react";

import {
  DialogActions,
  DialogButton,
  DialogHeader,
  DialogShell,
} from "@/components/ui/dialog";

type CareaiValidationDialogProps = {
  messages: readonly string[];
  onClose: () => void;
};

/** One popup listing everything the agent still has to fix. */
export function CareaiValidationDialog({
  messages,
  onClose,
}: CareaiValidationDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (messages.length > 0 && !dialog.open) dialog.showModal();
    if (messages.length === 0 && dialog.open) dialog.close();
  }, [messages]);

  return (
    <DialogShell ref={ref} aria-labelledby={titleId} onClose={onClose}>
      <DialogHeader badge="!" titleId={titleId}>
        Please review the following fields
      </DialogHeader>
      <ul className="m-0 max-h-[50vh] list-none overflow-y-auto px-6 pt-[18px] pb-2">
        {messages.map((message) => (
          <li
            key={message}
            className="relative py-2 pr-0 pl-7 text-[15px] text-[#333] before:absolute before:top-1/2 before:left-1 before:-mt-[5px] before:size-2.5 before:rounded-full before:border-[3px] before:border-care-purple before:content-['']"
          >
            {message}
          </li>
        ))}
      </ul>
      <DialogActions>
        <DialogButton autoFocus onClick={() => ref.current?.close()}>
          OK
        </DialogButton>
      </DialogActions>
    </DialogShell>
  );
}
