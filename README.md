# Event Hub

A unified calendar dashboard that synchronizes Google Calendar and Microsoft Outlook events into a single view with real-time updates.

## At a glance

- **Multi-provider calendar aggregation**: Connect Google Calendar and/or Microsoft Outlook accounts
- **Real-time synchronization**: Firestore listeners keep events updated across devices
- **Unified data model**: Normalizes events from different providers into a consistent interface
- **Client-side OAuth**: Secure authentication via Firebase Auth with Google and Microsoft providers
- **Search and filtering**: Full-text search across event titles, descriptions, and attendees
- **Responsive UI**: React + TypeScript with Tailwind CSS and shadcn/ui components
- **For**: Developers managing multiple calendars, teams evaluating calendar integration patterns

## Live demo

**URL**: [https://eventhub.buzz](https://eventhub.buzz)

**Credentials**: Public access - sign in with Google or Microsoft account

### 30-second walkthrough

1. Click "Get Started" on the homepage
2. Choose "Sign in with Google" or "Sign in with Microsoft"
3. Grant calendar read permissions when prompted
4. If you have both accounts, link the second provider from the dashboard settings
5. View your unified calendar events in the dashboard
6. Use the search bar to filter events by title or description
7. Click any event to see details (attendees, location, description)
8. Toggle between month, week, day, and list views using the view selector
9. Change filters (date range, calendar source) in the filter panel
10. Refresh events manually using the refresh button (auto-sync runs every 5 minutes)

## Architecture overview

```mermaid
graph LR
    A[Client UI<br/>React + TypeScript] --> B[Firebase Auth<br/>OAuth 2.0]
    B --> C[Google Calendar API]
    B --> D[Microsoft Graph API]
    C --> E[Event Normalizer<br/>src/lib/types.ts]
    D --> E
    E --> F[Firestore<br/>users/{uid}/events]
    F --> G[Real-time Listener<br/>onSnapshot]
    G --> A
```

**OAuth flow**: Client-side authentication via Firebase Auth. Users sign in with Google or Microsoft, and access tokens are stored in `localStorage` (see Security & Privacy section for limitations).

**Token refresh**: Tokens expire after ~1 hour. Current implementation requires manual re-authentication via `linkWithPopup()`. Automatic refresh using refresh tokens is not yet implemented.

**Real-time sync**: Firestore `onSnapshot` listeners on `users/{userId}/events` collection provide instant UI updates when events change. External APIs (Google/Microsoft) are polled every 5 minutes and synced to Firestore via batch writes.

**Data flow**:
1. User authenticates → OAuth tokens stored in localStorage
2. External APIs fetched using stored tokens → Events normalized via `convertGoogleEvent()` / `convertMicrosoftEvent()`
3. Normalized events written to Firestore with document IDs `{source}_{eventId}`
4. Real-time listener updates UI automatically
5. Offline changes queued and synced when connection restored

## Data model

### Unified event interface

```typescript
// src/lib/types.ts
interface UnifiedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  location?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    status?: string;
  }>;
  organizer?: {
    email: string;
    name?: string;
  };
  description?: string;
  calendarId: string;
  calendarName: string;
  calendarColor: string;
  source: 'google' | 'microsoft';
  htmlLink?: string;
}
```

**Event normalization**: Mapping functions in `src/lib/types.ts` convert provider-specific formats:
- Google Calendar: `summary` → `title`, `dateTime`/`date` → `Date`
- Microsoft Graph: `subject` → `title`, `emailAddress.address` → `email`

**Firestore structure**:
- Collection: `users/{userId}/events`
- Document ID: `{source}_{eventId}` (e.g., `google_abc123`, `microsoft_xyz789`)
- Fields: All `UnifiedEvent` fields plus:
  - `userId: string`
  - `syncStatus: 'synced' | 'pending' | 'error'`
  - `lastSyncAt: Timestamp`
  - `version: number`
  - `createdAt: Timestamp`
  - `updatedAt: Timestamp`

**Security rules**: `firestore.rules` enforces user-scoped access - users can only read/write their own events (`request.auth.uid == userId`).

## Key engineering decisions

1. **Client-side token storage in localStorage**
   - Tradeoff: Simple implementation vs. security risk (XSS vulnerability)
   - Why: Prototype/demo focused on functionality; production should use httpOnly cookies or secure session storage

2. **Firestore as intermediate cache layer**
   - Tradeoff: Additional storage costs vs. reduced API quota usage and offline support
   - Why: Google/Microsoft API rate limits make direct client polling expensive; Firestore enables real-time UI updates and offline queuing

3. **Manual token refresh via re-auth**
   - Tradeoff: Poor UX (users must re-authenticate) vs. implementation complexity
   - Why: Firebase Auth refresh token flow requires backend coordination; client-only OAuth tokens expire quickly

4. **Event normalization at fetch time**
   - Tradeoff: Duplication of mapping logic vs. simpler query layer
   - Why: Provider APIs have different schemas (Google uses `summary`, Microsoft uses `subject`); normalization enables unified search/filter logic

5. **5-minute polling interval for external APIs**
   - Tradeoff: Latency vs. API quota consumption
   - Why: Balance between freshness and quota limits; manual refresh available for immediate sync

## Local development

### Quick start

```bash
# Clone the repository
git clone https://github.com/ChimdumebiNebolisa/event-hub.git

# Navigate to project directory
cd event-hub

# Install dependencies (npm is primary; bun.lockb also present)
npm install

# Firebase configuration is hardcoded in src/lib/firebase.ts
# For local testing, update firebaseConfig with your Firebase project credentials

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase (requires Firebase CLI and project access)
firebase deploy
```

**Package manager**: This project uses npm (package-lock.json). A bun.lockb file exists but npm scripts in package.json are canonical.

**Environment variables**: Currently none required - Firebase config is hardcoded. For production, consider moving to environment variables.

**Firebase emulator**: Not configured. Local development connects to the production Firebase project (event-hub-38053).

### Troubleshooting

- **OAuth redirect URIs**: Ensure your Firebase project has authorized redirect URIs configured:
  - Development: `http://localhost:5173`
  - Production: `https://eventhub.buzz`
- **CORS errors**: Verify Firebase project settings allow your domain
- **Empty events after auth**: Check browser console for token errors; expired tokens require re-authentication
- **Firestore permission denied**: Verify Firestore rules allow read/write for authenticated users
- **Events not syncing**: Check network tab for Google Calendar/Microsoft Graph API errors; verify calendar read permissions were granted

## Security & privacy

**Authentication boundaries**: Firebase Auth handles OAuth flows. Users must explicitly grant calendar read permissions. Tokens stored in `localStorage` are accessible to any script on the domain (XSS risk).

**Firestore security model**: Rules enforce user isolation (`users/{userId}/events` - only accessible by matching `request.auth.uid`). No cross-user data access possible.

**Sensitive data stored**:
- OAuth access tokens in `localStorage` (expire ~1 hour)
- Calendar event data in Firestore (title, location, attendees, descriptions)
- User email address from Firebase Auth

**Explicit limitations for production hardening**:
- Move tokens to httpOnly cookies or secure session storage
- Implement automatic token refresh using refresh tokens (requires backend)
- Add rate limiting for API calls (currently none)
- Encrypt sensitive event fields at rest in Firestore
- Add audit logging for data access
- Implement CSP headers to mitigate XSS
- Add request signing/validation for API calls

**Privacy**: Users' calendar data is stored in Firestore. Event Hub does not share data with third parties beyond Google/Microsoft APIs used for synchronization.

## Limitations & roadmap

### Current limitations

- No automatic token refresh - users must re-authenticate when tokens expire (~1 hour)
- No rate limiting on API calls - risk of quota exhaustion
- Tokens stored in localStorage - vulnerable to XSS attacks
- No backend service - all logic runs client-side
- Limited error handling - API failures may result in incomplete data
- No calendar write operations - read-only synchronization
- Basic offline support - queue exists but not fully tested
- No pagination - all events loaded at once (may struggle with large calendars)
- No event deduplication logic - same event from multiple calendars may appear twice

### Roadmap

- Automatic token refresh with refresh tokens (requires backend service)
- Rate limiting middleware for API calls
- Secure token storage (httpOnly cookies or backend session management)
- Backend proxy service for API calls (hide tokens from client)
- Write operations (create/edit/delete events)
- Advanced offline support with conflict resolution
- Event deduplication across providers
- Pagination and lazy loading for large event sets
- Webhook subscriptions for real-time updates (reduce polling)
- Additional calendar providers (Apple Calendar, Yahoo Calendar)
- Team calendar sharing and collaboration features

## Contributing

Contributions welcome. Please open an issue to discuss major changes before submitting a PR.

## License

Not specified.

## Contact

**Developer**: Chimdumebi Nebolisa
**Email**: chimdumebinebolisa@gmail.com
**LinkedIn**: [Chimdumebi Nebolisa](https://www.linkedin.com/in/chimdumebi-nebolisa-020162389/)

---

**Additional documentation**:
- [Analytics & SEO Setup](docs/analytics-seo.md) - GTM/GA4 configuration and SEO guidelines
