"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Open dialogs, oldest first. The partner sheet can open on top of the cart
 * drawer, so only the top of the stack may handle Escape and Tab — otherwise a
 * single Escape would close both.
 */
const stack: symbol[] = [];

/** Depth counter so a nested dialog closing does not unlock body scroll early. */
let lockCount = 0;
let restoreOverflow = "";
let restorePadding = "";

function lockScroll() {
  const { body } = document;
  if (lockCount === 0) {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    restoreOverflow = body.style.overflow;
    restorePadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
  }
  lockCount += 1;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = restoreOverflow;
    document.body.style.paddingRight = restorePadding;
  }
}

/**
 * Shared modal plumbing: scroll lock, Escape to close, initial focus and a
 * Tab-cycling focus trap. Returns the ref to attach to the dialog panel.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const token = Symbol("dialog");
    stack.push(token);
    const isTopmost = () => stack[stack.length - 1] === token;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus({ preventScroll: true });
    }, 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopmost()) return;

      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      const index = stack.indexOf(token);
      if (index !== -1) stack.splice(index, 1);
      unlockScroll();
      restoreFocusTo.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return panelRef;
}
