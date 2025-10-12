/**
 * Toast Notification System
 * Provides a global toast notification system with state management
 * Supports adding, updating, dismissing, and removing toast notifications
 */

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

/** Maximum number of toasts to display simultaneously */
const TOAST_LIMIT = 1;

/** Delay before automatically removing dismissed toasts (in milliseconds) */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * Extended toast type with additional properties
 * @interface ToasterToast
 */
type ToasterToast = ToastProps & {
  /** Unique identifier for the toast */
  id: string;
  /** Optional toast title */
  title?: React.ReactNode;
  /** Optional toast description */
  description?: React.ReactNode;
  /** Optional action button element */
  action?: ToastActionElement;
};

/** Action types for toast state management */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

/** Global counter for generating unique toast IDs */
let count = 0;

/**
 * Generates a unique ID for toast notifications
 * @returns string - Unique toast ID
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

/** Type for action type constants */
type ActionType = typeof actionTypes;

/**
 * Union type for all possible toast actions
 * Defines the structure of actions that can be dispatched to the toast reducer
 */
type Action =
  | {
      /** Add a new toast to the display */
      type: ActionType["ADD_TOAST"];
      /** Complete toast object to add */
      toast: ToasterToast;
    }
  | {
      /** Update an existing toast with new properties */
      type: ActionType["UPDATE_TOAST"];
      /** Partial toast object with properties to update */
      toast: Partial<ToasterToast>;
    }
  | {
      /** Dismiss a toast (mark as closed but keep in state temporarily) */
      type: ActionType["DISMISS_TOAST"];
      /** Optional specific toast ID, if not provided dismisses all toasts */
      toastId?: ToasterToast["id"];
    }
  | {
      /** Remove a toast completely from state */
      type: ActionType["REMOVE_TOAST"];
      /** Optional specific toast ID, if not provided removes all toasts */
      toastId?: ToasterToast["id"];
    };

/**
 * State interface for the toast system
 * @interface State
 */
interface State {
  /** Array of currently active toast notifications */
  toasts: ToasterToast[];
}

/** Map to track timeout IDs for delayed toast removal */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Adds a toast to the removal queue with a delay
 * Prevents immediate removal and allows for smooth animations
 * @param toastId - The ID of the toast to remove
 */
const addToRemoveQueue = (toastId: string) => {
  // Prevent duplicate timeouts for the same toast
  if (toastTimeouts.has(toastId)) {
    return;
  }

  // Set up delayed removal
  const timeout = setTimeout(() => {
    // Clean up the timeout reference
    toastTimeouts.delete(toastId);
    // Dispatch removal action
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  // Store timeout reference for potential cancellation
  toastTimeouts.set(toastId, timeout);
};

/**
 * Reducer function for managing toast state
 * Handles all toast-related actions and state updates
 * @param state - Current toast state
 * @param action - Action to process
 * @returns New state after processing the action
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Add new toast to the beginning of the array and limit total count
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      // Update existing toast by ID with new properties
      return {
        ...state,
        toasts: state.toasts.map((t) => 
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Side effect: Add toasts to removal queue for delayed cleanup
      // This allows for smooth exit animations before actual removal
      if (toastId) {
        // Dismiss specific toast
        addToRemoveQueue(toastId);
      } else {
        // Dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      // Mark toasts as closed (open: false) but keep in state
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      // Completely remove toasts from state
      if (action.toastId === undefined) {
        // Remove all toasts
        return {
          ...state,
          toasts: [],
        };
      }
      // Remove specific toast by ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

/** Array of state change listeners for reactive updates */
const listeners: Array<(state: State) => void> = [];

/** In-memory state store for the toast system */
let memoryState: State = { toasts: [] };

/**
 * Dispatches an action to update the toast state
 * Updates memory state and notifies all listeners
 * @param action - The action to dispatch
 */
function dispatch(action: Action) {
  // Update the memory state using the reducer
  memoryState = reducer(memoryState, action);
  
  // Notify all registered listeners of the state change
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/** Toast type without the id property (for creating new toasts) */
type Toast = Omit<ToasterToast, "id">;

/**
 * Creates a new toast notification
 * @param props - Toast properties (without id)
 * @returns Object with toast id, dismiss function, and update function
 */
function toast({ ...props }: Toast) {
  // Generate unique ID for this toast
  const id = genId();

  /**
   * Updates the toast with new properties
   * @param props - New toast properties
   */
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  
  /**
   * Dismisses the toast (marks as closed)
   */
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Add the toast to the state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // Auto-dismiss when toast is closed by user interaction
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Return control functions for the toast
  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Custom hook for managing toast notifications
 * Provides access to toast state and control functions
 * @returns Object containing toast state and control functions
 */
function useToast() {
  // Local state that syncs with the global memory state
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    // Register this component as a listener for state changes
    listeners.push(setState);
    
    // Cleanup: remove listener when component unmounts
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    // Spread the current state (toasts array)
    ...state,
    // Toast creation function
    toast,
    // Dismiss function that can target specific toast or all toasts
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Export both the hook and the standalone toast function
export { useToast, toast };
