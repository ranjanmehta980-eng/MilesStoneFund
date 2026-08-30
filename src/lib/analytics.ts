/**
 * MilestoneFund Custom Telemetry & On-chain Analytics Logger
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'campaign_created'
  | 'donation_initiated'
  | 'donation_confirmed'
  | 'proof_submitted'
  | 'milestone_voted'
  | 'milestone_released'
  | 'refund_claimed';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  userAddress?: string;
  campaignId?: string;
  milestoneIndex?: number;
  amount?: number;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'milestonefund_analytics_events';

export const AnalyticsService = {
  logEvent(type: AnalyticsEventType, data?: { userAddress?: string; campaignId?: string; milestoneIndex?: number; amount?: number; metadata?: Record<string, any> }): AnalyticsEvent {
    const newEvent: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      type,
      timestamp: new Date().toISOString(),
      ...data,
    };

    if (typeof window !== 'undefined') {
      try {
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const existing: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
        existing.unshift(newEvent);
        // Keep last 100 events
        const trimmed = existing.slice(0, 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.warn('Could not persist analytics event:', err);
      }
    }

    return newEvent;
  },

  getRecentEvents(limit: number = 20): AnalyticsEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      if (!existingRaw) return [];
      const events: AnalyticsEvent[] = JSON.parse(existingRaw);
      return events.slice(0, limit);
    } catch {
      return [];
    }
  },

  clearEvents() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};
