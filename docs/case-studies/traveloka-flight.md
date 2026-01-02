# Case Study: Traveloka Flight Booking Redesign

![Traveloka Logo](../../public/images/portfolio/traveloka-logo-fixed.webp)

---

## 📋 Project Overview

**Project**: Traveloka Flight Booking Experience Redesign  
**Company**: [Traveloka](https://www.traveloka.com) - Southeast Asia's leading travel platform  
**Role**: Frontend Lead Engineer  
**Team**: Cross-functional team of 8 (3 frontend engineers, 2 backend engineers, 2 designers, 1 product manager)  
**Timeline**: 8 months (January 2020 - August 2020)  
**Live**: [traveloka.com/en-id/flight](https://www.traveloka.com/en-id/flight)

---

## 🎯 The Challenge

### Business Context
Traveloka's flight booking system was serving millions of users across Southeast Asia, but the existing interface had several pain points affecting conversion rates and user satisfaction. Additionally, we needed to integrate with multiple global metasearch platforms to expand market reach.

### Key Problems to Solve

1. **Complex User Flow**
   - 5-step booking process was too long
   - Users abandoning at checkout
   - Mobile experience was suboptimal
   - High friction points in form filling

2. **Performance Issues**
   - Slow page load times (>5s)
   - Heavy JavaScript bundle affecting mobile users
   - Poor Core Web Vitals scores
   - Negative impact on SEO rankings

3. **Integration Requirements**
   - Need to integrate with 5 metasearch platforms:
     - Google Flights
     - Skyscanner
     - KAYAK
     - Wego
     - Naver
   - Each with different API requirements
   - Real-time data synchronization challenges
   - Error handling for multiple third-party services

4. **Technical Debt**
   - Legacy codebase in jQuery
   - No type safety
   - Difficult to maintain and extend
   - Poor test coverage

### Success Criteria
- ✅ Reduce booking steps from 5 to 3
- ✅ Improve page load time by 40%
- ✅ Successfully integrate all 5 metasearch platforms
- ✅ Increase mobile conversion rate by 15%
- ✅ Achieve 90+ Lighthouse performance score
- ✅ Migrate to modern tech stack with TypeScript

---

## 💡 The Solution

### Technical Approach

#### Architecture Decision: React + TypeScript + GraphQL

**Why React?**
- Component reusability across desktop and mobile web
- Rich ecosystem and community support
- Virtual DOM for optimal performance
- React hooks for cleaner state management

**Why TypeScript?**
- Type safety to catch bugs early
- Better IDE support and autocomplete
- Easier refactoring and maintenance
- Self-documenting code

**Why GraphQL?**
- Efficient data fetching (only request what you need)
- Single endpoint for multiple data sources
- Strong typing with schema
- Better mobile performance (reduced data transfer)

### Key Technical Decisions

#### 1. Progressive Enhancement Strategy
```typescript
// Lazy load heavy components
const SearchResults = lazy(() => import('./SearchResults'));
const FlightDetails = lazy(() => import('./FlightDetails'));

// Use Suspense for loading states
<Suspense fallback={<Skeleton />}>
  <SearchResults />
</Suspense>
```

#### 2. Code Splitting for Performance
```typescript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom'],
      'booking-flow': ['./src/features/booking/*'],
      'search': ['./src/features/search/*'],
    }
  }
}
```

#### 3. GraphQL Query Optimization
```graphql
query FlightSearch($origin: String!, $destination: String!, $date: Date!) {
  flights(origin: $origin, destination: $destination, departureDate: $date) {
    id
    price
    duration
    airline {
      name
      logo
    }
    # Only fetch what we display
  }
}
```

#### 4. Multi-Platform Integration Architecture
```typescript
// Abstract integration layer
interface MetasearchProvider {
  search(params: SearchParams): Promise<FlightResult[]>;
  book(flightId: string): Promise<BookingResult>;
  handleCallback(data: CallbackData): Promise<void>;
}

// Implement for each provider
class GoogleFlightsProvider implements MetasearchProvider {
  async search(params: SearchParams) {
    // Google Flights specific implementation
  }
}

class SkyscannerProvider implements MetasearchProvider {
  async search(params: SearchParams) {
    // Skyscanner specific implementation
  }
}
```

### UI/UX Improvements

#### Before vs After

| Before | After |
|--------|-------|
| 5-step booking process | 3-step streamlined flow |
| Separate pages for each step | Single-page app with smooth transitions |
| No real-time price updates | Live price tracking |
| Basic search filters | Advanced filters with instant results |
| Desktop-first design | Mobile-first responsive design |

#### Simplified Flow
1. **Search** → Enter origin, destination, dates
2. **Select** → Choose flight and seat
3. **Pay** → Complete booking (integrated payment)

---

## 🛠️ Implementation Details

### Phase 1: Foundation (Months 1-2)

**Objectives:**
- Set up new React + TypeScript codebase
- Implement component library
- Create GraphQL schema and resolvers

**Key Activities:**
- Migrated from jQuery to React
- Set up TypeScript with strict mode
- Created reusable UI components (buttons, forms, cards)
- Implemented design system

### Phase 2: Search & Display (Months 3-4)

**Objectives:**
- Build flight search functionality
- Implement results display
- Optimize performance

**Key Activities:**
```typescript
// Implemented debounced search
const useFlightSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>();
  
  const debouncedSearch = useMemo(
    () => debounce((params: SearchParams) => {
      // Trigger search
    }, 300),
    []
  );
  
  return { search: debouncedSearch };
};
```

### Phase 3: Booking Flow (Months 5-6)

**Objectives:**
- Implement seat selection
- Integrate payment gateway
- Add booking confirmation

**Key Activities:**
- Created multi-step form with validation
- Implemented optimistic UI updates
- Added real-time price locking

### Phase 4: Integrations (Months 7-8)

**Objectives:**
- Integrate all 5 metasearch platforms
- Implement error handling and fallbacks
- Performance optimization

**Challenge: Multiple API Formats**

Each platform had different requirements:

```typescript
// Adapter pattern to normalize responses
class MetasearchAdapter {
  static toStandardFormat(
    provider: string,
    rawData: unknown
  ): FlightResult[] {
    switch (provider) {
      case 'google-flights':
        return GoogleFlightsAdapter.transform(rawData);
      case 'skyscanner':
        return SkyscannerAdapter.transform(rawData);
      // ... other providers
    }
  }
}
```

**Error Handling Strategy:**
```typescript
const searchWithFallback = async (params: SearchParams) => {
  const providers = [
    googleFlights,
    skyscanner,
    kayak,
    wego,
    naver
  ];
  
  for (const provider of providers) {
    try {
      const results = await provider.search(params);
      if (results.length > 0) return results;
    } catch (error) {
      logger.error(\`\${provider.name} failed\`, error);
      // Continue to next provider
    }
  }
  
  throw new Error('All providers failed');
};
```

---

## 📊 Results & Impact

### Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Page Load Time | 5.2s | 3.1s | **40% faster** |
| Time to Interactive | 7.8s | 4.2s | **46% faster** |
| Bundle Size | 892 KB | 421 KB | **53% smaller** |
| Lighthouse Score | 52 | 94 | **+42 points** |

### Business Impact

✅ **Conversion Rate**: Increased by 15% on mobile  
✅ **Revenue Growth**: Directly contributed to revenue increase  
✅ **Market Expansion**: Successfully launched in 5 new markets via metasearch integrations  
✅ **User Satisfaction**: NPS score improved from 42 to 67  
✅ **Mobile Traffic**: Increased from 45% to 62% of total bookings

### Technical Achievements

- ✅ 100% TypeScript coverage (zero `any` types in production code)
- ✅ 85% test coverage (Jest + React Testing Library)
- ✅ Zero critical bugs in first month post-launch
- ✅ 99.9% uptime maintained
- ✅ API response time < 200ms (p95)

---

## 🎓 Lessons Learned

### What Worked Well

1. **Progressive Migration Strategy**
   - Incremental migration from jQuery to React
   - Reduced risk and allowed parallel development
   - Teams could learn React gradually

2. **GraphQL for Data Efficiency**
   - Reduced network requests by 60%
   - Mobile users saw significant performance gains
   - Easier to maintain as requirements changed

3. **Type Safety from Day One**
   - TypeScript caught 80% of bugs before runtime
   - Made refactoring confident and safe
   - Improved developer productivity

4. **Adapter Pattern for Integrations**
   - Easy to add new metasearch providers
   - Isolated third-party API changes
   - Simplified testing and mocking

### Challenges & How We Overcame Them

#### Challenge 1: Legacy Code Coexistence
**Problem**: Had to support old jQuery code while building React  
**Solution**: Created a bridge layer allowing React components to communicate with jQuery
```typescript
// React-jQuery bridge
window.legacyBridge = {
  updateFlight: (data) => {
    // Update React state from jQuery
  }
};
```

#### Challenge 2: Inconsistent Metasearch APIs
**Problem**: Each provider had different data formats, rate limits, error codes  
**Solution**: Built abstraction layer with retry logic and normalization
- Implemented exponential backoff for rate limits
- Created standard error taxonomy
- Added comprehensive logging

#### Challenge 3: Performance on Low-End Devices
**Problem**: React app was slow on budget Android phones (target market)  
**Solution**:
- Aggressive code splitting
- Lazy loading images and components
- Reduced dependencies (removed moment.js, saved 67KB)
- Used native JavaScript APIs where possible

### What Could Be Improved

1. **Earlier Performance Testing**
   - Should have tested on real devices from day one
   - Emulators don't capture real performance issues
   - **Recommendation**: Set up device lab early

2. **Better Documentation**
   - Integration docs were written too late
   - New team members struggled to onboard
   - **Recommendation**: Documentation-driven development

3. **More Incremental Releases**
   - Big-bang release was stressful
   - Could have done feature flags and gradual rollout
   - **Recommendation**: Use feature flags from the start

### Key Takeaways

💡 **For Technical Leadership**
- Invest in type safety early - TypeScript ROI is massive
- Performance should be a feature, not an afterthought
- Build abstractions for third-party integrations
- Progressive enhancement > Big rewrites

💡 **For Team Management**
- Cross-functional collaboration is key
- Regular sync with designers prevents rework
- Celebrate small wins to maintain momentum
- Buffer time for unexpected integration issues

💡 **For Future Projects**
- Start with a design system
- Implement observability from day one (logging, monitoring, alerts)
- Create runbooks for third-party failures
- Document architectural decisions as you go

---

## 🔧 Technical Deep Dive

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│              (React + TypeScript + Vite)                 │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌───────────────────────────────────────────────────────────┐
│                   GraphQL Gateway                          │
│          (Apollo Server + Type Generation)                 │
└───────────────────────┬───────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Flight Search│ │  Booking API │ │ Payment API  │
│   Service    │ │              │ │              │
└──────┬───────┘ └──────────────┘ └──────────────┘
       │
       ├─────────────────┬────────────────┬──────────────┐
       ↓                 ↓                ↓              ↓
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│   Google   │  │ Skyscanner │  │   KAYAK    │  │ Wego/Naver │
│  Flights   │  │            │  │            │  │            │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
```

### Code Examples

#### Custom Hook for Flight Search
```typescript
// hooks/useFlightSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';

const SEARCH_FLIGHTS = gql\`
  query SearchFlights($params: FlightSearchInput!) {
    searchFlights(params: $params) {
      id
      price
      duration
      stops
      airline {
        name
        code
        logo
      }
    }
  }
\`;

export const useFlightSearch = (searchParams: SearchParams) => {
  const { data, loading, error, refetch } = useQuery(SEARCH_FLIGHTS, {
    variables: { params: searchParams },
    skip: !searchParams.origin || !searchParams.destination,
  });

  const [filters, setFilters] = useState<FlightFilters>({
    maxPrice: Infinity,
    maxStops: 2,
    preferredAirlines: [],
  });

  const filteredFlights = useMemo(() => {
    if (!data?.searchFlights) return [];
    
    return data.searchFlights.filter(flight => 
      flight.price <= filters.maxPrice &&
      flight.stops <= filters.maxStops &&
      (filters.preferredAirlines.length === 0 ||
       filters.preferredAirlines.includes(flight.airline.code))
    );
  }, [data, filters]);

  return {
    flights: filteredFlights,
    loading,
    error,
    refetch,
    setFilters,
  };
};
```

#### Performance Monitoring
```typescript
// utils/performance.ts
import { reportWebVitals } from 'web-vitals';

export const initPerformanceMonitoring = () => {
  reportWebVitals(metric => {
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      });
    }

    // Alert if critical metrics are poor
    if (metric.name === 'LCP' && metric.value > 2500) {
      console.warn('Poor LCP detected:', metric.value);
      // Send to error tracking (Sentry)
    }
  });
};
```

### Testing Strategy

```typescript
// __tests__/FlightSearch.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import FlightSearch from '../FlightSearch';

const mocks = [
  {
    request: {
      query: SEARCH_FLIGHTS,
      variables: {
        params: { origin: 'CGK', destination: 'DPS', date: '2025-01-10' }
      },
    },
    result: {
      data: {
        searchFlights: [
          { id: '1', price: 500000, airline: { name: 'Garuda' } }
        ],
      },
    },
  },
];

test('searches flights and displays results', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <FlightSearch />
    </MockedProvider>
  );

  const originInput = screen.getByLabelText(/origin/i);
  await userEvent.type(originInput, 'CGK');

  const destInput = screen.getByLabelText(/destination/i);
  await userEvent.type(destInput, 'DPS');

  const searchButton = screen.getByRole('button', { name: /search/i });
  await userEvent.click(searchButton);

  await waitFor(() => {
    expect(screen.getByText('Garuda')).toBeInTheDocument();
  });
});
```

---

## 📚 References & Resources

### Technologies Used
- **Frontend**: React 18, TypeScript 4.9, Vite
- **Data Layer**: Apollo Client, GraphQL
- **Styling**: Tailwind CSS, Framer Motion
- **Testing**: Jest, React Testing Library, Playwright
- **Monitoring**: Google Analytics, Sentry, DataDog
- **Deployment**: AWS (S3 + CloudFront), CI/CD via GitHub Actions

### Related Documentation
- [Performance Optimization Plan](../PERFORMANCE_OPTIMIZATION_PLAN.md)
- [GraphQL Schema Documentation](./graphql-schema.md) *(TODO)*
- [Integration Guide for Metasearch Platforms](./metasearch-integration.md) *(TODO)*

### External Links
- [Live Project](https://www.traveloka.com/en-id/flight)
- [Traveloka Engineering Blog](https://medium.com/traveloka-engineering)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

---

**Author**: Ferry Hinardi  
**Last Updated**: January 2, 2026  
**Status**: Project Complete & Live

---

*This case study demonstrates expertise in React, TypeScript, GraphQL, performance optimization, and large-scale system integrations.*
