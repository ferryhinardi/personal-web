/**
 * Type declarations for non-standard Navigator APIs
 * Augments the global Navigator interface with deviceMemory and connection properties
 */

declare global {
  interface NavigatorDeviceMemory {
    /** Device memory in GB (non-standard API, varies by browser) */
    deviceMemory?: number;
  }

  interface NetworkInformation extends EventTarget {
    /** Effective connection type: '4g', '3g', '2g', 'slow-2g' */
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    /** Downlink speed in Mbps */
    downlink?: number;
    /** Round trip time in ms */
    rtt?: number;
    /** Whether user has set reduced data mode */
    saveData?: boolean;
  }

  interface Navigator extends NavigatorDeviceMemory {
    /** Connection information (non-standard API, varies by browser) */
    connection?: NetworkInformation;
  }
}

export {};
