# Analytics & SEO Configuration

## Google Tag Manager (GTM) & GA4 Setup

Event Hub uses Google Tag Manager for comprehensive analytics tracking with GA4 integration.

### Initial Setup

1. **Create GTM Container**
   - Go to https://tagmanager.google.com/
   - Create a new account and container
   - Copy your GTM Container ID (GTM-XXXXXX)

2. **Create GA4 Property**
   - Go to https://analytics.google.com/
   - Create a new GA4 property
   - Copy your Measurement ID (G-XXXXXXXXXX)

3. **Update GTM Container ID**
   ```html
   <!-- In index.html, replace GTM-XXXXXX with your actual container ID -->
   <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
   new Date().getTime(),event:'gtm.js'});...
   })(window,document,'script','dataLayer','GTM-XXXXXX');</script>
   ```

### GTM Configuration

**1. Create GA4 Configuration Tag**
- Tag Type: Google Analytics: GA4 Configuration
- Measurement ID: Your G-XXXXXXXXXX
- Trigger: All Pages

**2. Create History Change Trigger** (for SPA page_view events)
- Trigger Type: History Change
- This trigger should fire on: All History Change Events

**3. Create Page View Tag**
- Tag Type: Google Analytics: GA4 Event
- Event Name: page_view
- Configuration Tag: Select your GA4 Configuration Tag
- Trigger: History Change + Page View

**4. Create Outbound Click Trigger**
- Trigger Type: Link Click - Just Links
- Wait for Tags: 2000ms
- Check Validation: true
- Trigger fires on: Click URL does NOT start with https://eventhub.buzz

**5. Create Outbound Click Tag**
- Tag Type: Google Analytics: GA4 Event
- Event Name: outbound_click
- Event Parameters:
  - link_url: {{Click URL}}
  - link_domain: {{Page Hostname}}
- Trigger: Outbound Click Trigger

## Analytics Events Dictionary

All events are tracked via the `track()` utility in `src/lib/track.ts`. Each event includes UTM parameters when available.

### Core Events

| Event Name | Description | Parameters | Where It's Fired |
|-----------|-------------|------------|-----------------|
| `page_view` | Page navigation in SPA | `page_path`, `page_title`, `page_location` | Every route change (automatic) |
| `cta_primary_clicked` | Primary CTA button click | `cta_label`, `cta_location` | Hero, CTA Section, Navbar |
| `outbound_click` | External link click | `link_url`, `link_domain` | Footer social links, external links |
| `search_performed` | User performs a search | `search_term`, `results_count` | Dashboard search bar |
| `filter_changed` | User changes a filter | `filter_name`, `filter_value` | Dashboard filter panel |
| `add_to_calendar` | User adds event to calendar | `calendar_type`, `event_title` | Dashboard calendar actions |
| `suggest_source_submitted` | User suggests new calendar source | `source_name`, `source_type` | Suggestion form |
| `share_clicked` | User clicks share button | `content_type`, `method` | Share functionality |

### Conversion Events

Mark these events as conversions in GA4 for better tracking:
- `cta_primary_clicked` (Primary CTA clicks)
- `add_to_calendar` (Event additions)
- `suggest_source_submitted` (Feature suggestions)

## Testing Analytics

### 1. GTM Preview Mode
```bash
# Start the development server
npm run dev

# In GTM, click "Preview"
# Enter http://localhost:5173
# Test all events and verify they appear in the Preview pane
```

### 2. GA4 DebugView
```
1. Enable debug mode by adding query parameter: ?debug_mode=true
2. Open GA4 → Admin → DebugView
3. Interact with the app and verify events appear in real-time
4. Check event parameters are correct
```

### 3. Browser Console Testing
```javascript
// Check if dataLayer exists
console.log(window.dataLayer);

// Track a test event
track('test_event', { test_param: 'test_value' });

// Verify event was pushed
console.log(window.dataLayer[window.dataLayer.length - 1]);
```

### 4. Real Click Testing
Test these user journeys and verify events:
- Click "Get Started" → `cta_primary_clicked`
- Search for events → `search_performed`
- Change filters → `filter_changed`
- Click social links → `outbound_click`
- Navigate between pages → `page_view`

## UTM Parameter Management

UTM parameters are automatically:
1. **Captured** from the URL on initial page load
2. **Stored** in `sessionStorage` for the session duration
3. **Attached** to all analytics events automatically
4. **Preserved** on internal navigation and CTA links

**Supported UTM Parameters:**
- `utm_source` - Traffic source (e.g., google, facebook)
- `utm_medium` - Marketing medium (e.g., cpc, email)
- `utm_campaign` - Campaign name
- `utm_term` - Paid search keywords
- `utm_content` - Content variation

**Example URL with UTMs:**
```
https://eventhub.buzz/?utm_source=reddit&utm_medium=social&utm_campaign=launch
```

## SEO Configuration

### Meta Tags & Open Graph

All pages use the `<SEO>` component for dynamic meta tags:

```typescript
import SEO from '@/components/SEO';

<SEO
  title="Dashboard"
  description="Manage your unified calendar"
  canonical="https://eventhub.buzz/dashboard"
  ogImage="https://eventhub.buzz/og-image.png"
/>
```

### Sitemap & Robots

**Sitemap:** `public/sitemap.xml` - Lists all public pages
**Robots:** `public/robots.txt` - Configured for SEO optimization

**To submit to Google Search Console:**
```
1. Go to https://search.google.com/search-console
2. Add property: eventhub.buzz
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: https://eventhub.buzz/sitemap.xml
5. Request indexing for key pages
```

### Structured Data (JSON-LD)

The app includes WebApplication schema:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Event Hub",
  "description": "Unified calendar management",
  "url": "https://eventhub.buzz/",
  "applicationCategory": "ProductivityApplication"
}
```

### Creating OG Image

Create a 1200x630px image for social sharing:
1. Design dimensions: 1200x630px
2. Safe zone: Keep text within 1200x600px
3. File format: PNG or JPG
4. File name: `og-image.png`
5. Place in: `public/og-image.png`
6. Test with: https://www.opengraph.xyz/

