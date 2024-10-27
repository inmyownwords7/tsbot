import { EventEmitter } from "events";

// Global event emitter instance
export const event = new EventEmitter();

// Utility to register events
export async function registerEvent(
  eventType: string,
  handler: (params: any) => void
): Promise<void> {
  event.on(eventType, async (params) => {
    try {
      await handler(params);
    } catch (error) {
      console.error(`Error handling ${eventType} event:`, error);
    }
  });
}
