/**
 * Firebase type definitions for Firestore collections.
 */

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  avatar?: string;
  createdAt: Date;
  replyTo?: string;
  /** Visitor ID from localStorage (anonymous) */
  visitorId: string;
}

export interface Reaction {
  emoji: string;
  count: number;
}

export interface ReactionDoc {
  /** Record of emoji -> count */
  reactions: Record<string, number>;
  /** Subcollection of per-user reactions */
  targetId: string;
  targetType: 'project' | 'achievement';
}

export interface UserReaction {
  visitorId: string;
  emoji: string;
  createdAt: Date;
}

export interface ViewCount {
  path: string;
  count: number;
  lastViewed: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'certificate' | 'badge' | 'award';
  category: string;
  issuer: string;
  date: Date;
  url?: string;
  createdAt: Date;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  changes: ChangeItem[];
  date: Date;
  createdAt: Date;
}

export interface ChangeItem {
  type: 'added' | 'changed' | 'fixed' | 'removed';
  description: string;
}
