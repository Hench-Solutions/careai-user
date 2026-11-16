"use client";

import { useEffect, useId, useRef } from "react";

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
    <dialog
      ref={ref}
      className="careai-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <div className="careai-dialog-head">
        <span className="careai-dialog-icon" aria-hidden>
          !
        </span>
        <h2 id={titleId}>Please review the following fields</h2>
      </div>
      <ul className="careai-dialog-list">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <div className="careai-dialog-actions">
        <button type="button" autoFocus onClick={() => ref.current?.close()}>
          OK
        </button>
      </div>
    </dialog>
  );
}
