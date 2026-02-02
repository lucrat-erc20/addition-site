# Addition.site Rebuild - Project Timeline

**Started**: February 2, 2026
**Stack**: Next.js 16 + TypeScript + Tailwind + Zustand
**Repo**: github.com/lucrat-erc20/addition-site

---

## Progress Tracker

### MILESTONE 1: Project Foundation ✅
- [x] **Step 1**: Initialize Next.js 16 with TypeScript + Tailwind
  - Created with App Router, src/ directory
  - Default Tailwind + ESLint configured
  
- [x] **Step 2**: Install core dependencies
  - zustand: State management
  - framer-motion: Animations
  - lz-string: URL compression
  
- [x] **Step 3**: Create base directory structure
  - /components/ui - Reusable UI components
  - /components/skins - Skin system components
  - /hooks - Custom React hooks
  - /lib/calculations - Shared calculation functions
  - /store - Zustand stores
  - /public/sounds - Audio files

- [ ] **Step 4**: Set up Git repo and push to GitHub
  - Notes: 

- [ ] **Step 5**: Configure Vercel deployment
  - Notes:

### MILESTONE 2: Base Calculator UI (Steps 6-10)
- [ ] **Step 6**: Create Calculator component
- [ ] **Step 7**: Add Tailwind styling with animations
- [ ] **Step 8**: Implement responsive layout
- [ ] **Step 9**: Add button grid
- [ ] **Step 10**: Create LCD display component

### MILESTONE 3: Calculator Logic & State (Steps 11-15)
- [ ] **Step 11**: Set up Zustand store
- [ ] **Step 12**: Create calculation library
- [ ] **Step 13**: Wire up button clicks
- [ ] **Step 14**: Implement calculation engine
- [ ] **Step 15**: Add keyboard listeners

### MILESTONE 4: Audio System (Steps 16-20)
- [ ] **Step 16**: Set up Web Audio API
- [ ] **Step 17**: Add MP3 sounds
- [ ] **Step 18**: Create useAudio hook
- [ ] **Step 19**: Implement volume slider
- [ ] **Step 20**: Connect audio to keypresses

### MILESTONE 5: Recording & Playback (Steps 21-25)
- [ ] **Step 21**: Add recording to store
- [ ] **Step 22**: Create playback UI
- [ ] **Step 23**: Implement playback animation
- [ ] **Step 24**: Build compression utilities
- [ ] **Step 25**: Add Share button

### MILESTONE 6: Calculator Cards System (Steps 26-30)
- [ ] **Step 26**: Create CalculatorCard component
- [ ] **Step 27**: Build calculator registry
- [ ] **Step 28**: Implement card shuffle
- [ ] **Step 29**: Create dynamic routes
- [ ] **Step 30**: Add placeholder calculators

### MILESTONE 7: Skin System Foundation (Steps 31-35)
- [ ] **Step 31**: Define skin schema
- [ ] **Step 32**: Create skin selector UI
- [ ] **Step 33**: Build clickable region detection
- [ ] **Step 34**: Implement CSS variable swapping
- [ ] **Step 35**: Add base themes

### MILESTONE 8: Blog & Content (Steps 36-40)
- [ ] **Step 36**: Set up MDX configuration
- [ ] **Step 37**: Create blog layouts
- [ ] **Step 38**: Write initial blog posts
- [ ] **Step 39**: Add blog listing page
- [ ] **Step 40**: Implement meta tags

### MILESTONE 9: SEO & Monetization (Steps 41-45)
- [ ] **Step 41**: Add JSON-LD schema
- [ ] **Step 42**: Configure sitemap
- [ ] **Step 43**: Integrate Monetag
- [ ] **Step 44**: Add Amazon affiliate links
- [ ] **Step 45**: Set up Analytics

### MILESTONE 10: Launch & Polish (Steps 46-50)
- [ ] **Step 46**: Performance audit
- [ ] **Step 47**: Accessibility testing
- [ ] **Step 48**: Configure redirects
- [ ] **Step 49**: Production deployment
- [ ] **Step 50**: Create maintenance docs

---

## Key Decisions Log

**2026-02-02**: Chose zero-backend stack to stay on Vercel free tier
**2026-02-02**: Using LZ-String for URL-based sharing (no database needed)
**2026-02-02**: MDX for blog (no CMS costs)
**2026-02-02**: Skin system uses rectangle-based clickable regions for future image overlays

---

## Issues & Solutions

_(Will document problems and fixes as we encounter them)_