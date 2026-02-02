# Addition.site Rebuild - Project Timeline

**Started**: February 2, 2026  
**Stack**: Next.js 16 + TypeScript + Tailwind + Zustand + Framer Motion  
**Repo**: github.com/lucrat-erc20/addition-site  
**Staging**: https://addition-site.vercel.app/  
**Production Domain**: addition.site (Cloudflare DNS → Vercel hosting)

---

## 🎯 Current Status: MILESTONE 2 - Steps 6-10 COMPLETE

**Last Updated**: February 2, 2026  
**Completed Steps**: 1-10 of 50  
**Next Up**: Step 11 - Set up Zustand store for calculator state

---

## ⚙️ Architecture & Tech Stack

### Core Technologies
- **Framework**: Next.js 16 (App Router) - NO `src/` directory, everything in `app/`
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Framer Motion for animations
- **State Management**: Zustand (not installed/configured yet)
- **URL Compression**: LZ-String for shareable calculation links
- **Hosting**: Vercel (free tier, auto-deploy on GitHub push)
- **Domain**: addition.site via Cloudflare DNS (points to Vercel)
- **Blog**: MDX files (no CMS, content in repo)

### Directory Structure
```
addition-site/
├── app/
│   ├── components/
│   │   ├── Calculator.tsx          # Main calculator wrapper
│   │   ├── ui/
│   │   │   ├── Display.tsx         # LCD display with status indicators
│   │   │   ├── Button.tsx          # Individual button component
│   │   │   └── ButtonGrid.tsx      # 5x5 button layout
│   │   └── skins/                  # (future) Skin system components
│   ├── hooks/                      # (future) useKeyboard, useAudio
│   ├── lib/
│   │   └── calculations/           # (future) Shared math functions
│   ├── store/                      # (future) Zustand stores
│   ├── layout.tsx                  # Root layout with fonts
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Tailwind imports
├── public/
│   └── sounds/                     # (future) MP3 click sounds
├── PROJECT_TIMELINE.md             # This file
└── package.json
```

---

## 🎨 Design System

### Calculator Dimensions (Unit System: 8px base)
- **Display**: 43×9 units = 344px × 72px
- **Buttons**: 7×5 units = 56px × 40px each
- **Grid**: 5 columns × 5 rows
- **Gaps**: 8px horizontal, 12px vertical
- **Outer padding**: 20px (5 units from edges)
- **Display-to-buttons gap**: 16px

### Color Palette
All gradients are **left-to-right**:

| Element | Gradient | Usage |
|---------|----------|-------|
| **Black buttons** | `#474747` → `#1a1a1a` | Function buttons (x², √, 1/x, %, x, ÷, ±, =) |
| **Grey buttons** | `#999999` → `#666666` | Number buttons (0-9, .) |
| **Green buttons** | `rgb(109,164,49)` → `rgb(153,204,153)` | Clear buttons (⌫, C, AC) |
| **Orange button** | `rgb(230,120,20)` → `rgb(250,150,100)` | Special button (🟠 placeholder - position 24) |

### Button Layout
```
Row 1:  x²   √   1/x   %    ⌫
Row 2:  7    8    9    C   AC
Row 3:  4    5    6    x    ÷
Row 4:  1    2    3    +    -
Row 5:  ±    0    .   🟠    =
```

### Typography
- **Display Numbers**: Roboto Mono (400 weight, 2.25rem, monospaced, tabular-nums)
- **Button Labels**: Arial/system font (300 weight, white)
- **Status Indicators**: Roboto Mono (xs size)

### Display Components (Placeholders Documented)
The calculator display has three zones:

**LEFT**: Brand/Calculator Type Indicators
- `PLACEHOLDER_LOGO_LARGE`: 24px × 12px - main branding area
- `PLACEHOLDER_LOGO_SMALL`: 12px × 12px - secondary indicator

**CENTER**: Active Operator Indicators
- Shows: `+ - × ÷`
- Lights up green when operator pressed

**RIGHT**: Status Indicators
- `ERROR_INDICATOR`: Shows 'E' in red on calculation error
- `PLACEHOLDER_STATUS`: 12px × 12px - for battery/memory/etc

---

## 📋 Progress Tracker

### ✅ MILESTONE 1: Project Foundation (Steps 1-5) - COMPLETE

- [x] **Step 1**: Initialize Next.js 16 with TypeScript + Tailwind
  - ✅ Created with App Router
  - ✅ NO `src/` directory (learned: Next.js doesn't need it, cleaner without)
  - ✅ Tailwind + ESLint configured
  
- [x] **Step 2**: Install core dependencies
  - ✅ zustand: State management (installed, not yet configured)
  - ✅ framer-motion: Button animations
  - ✅ lz-string: URL compression for sharing
  
- [x] **Step 3**: Create base directory structure
  - ✅ /components/ui - Reusable UI components
  - ✅ /components/skins - Skin system (empty, for future)
  - ✅ /hooks - Custom hooks (empty, for future)
  - ✅ /lib/calculations - Shared math functions (empty, for future)
  - ✅ /store - Zustand stores (empty, for future)
  - ✅ /public/sounds - Audio files (empty, for future)

- [x] **Step 4**: Set up Git repo and push to GitHub
  - ✅ Pushed to github.com/lucrat-erc20/addition-site
  - ✅ Branch: main
  
- [x] **Step 5**: Configure Vercel deployment
  - ✅ Live at https://addition-site.vercel.app/
  - ✅ Auto-deploy on push configured
  - 📝 **NOTE**: Domain addition.site is on Cloudflare DNS
  - 📝 **SOLUTION**: Point Cloudflare DNS to Vercel (Vercel supports custom domains with external DNS)

### ✅ MILESTONE 2: Base Calculator UI (Steps 6-10) - COMPLETE

- [x] **Step 6**: Create Calculator component
  - ✅ Main wrapper component created
  - ✅ Basic state management (useState for display)
  
- [x] **Step 7**: Add Tailwind styling with animations
  - ✅ Framer Motion hover/tap animations on buttons
  - ✅ Gradient backgrounds per spec
  - ✅ Rounded corners and borders
  
- [x] **Step 8**: Implement responsive layout
  - ✅ Fixed-size calculator (344px × 300px total)
  - ✅ Centered on page with gradient background
  - 📝 **NOTE**: Not fully mobile-responsive yet (future enhancement)
  
- [x] **Step 9**: Add button grid
  - ✅ 5×5 grid layout with exact spacing (8px H, 12px V)
  - ✅ Four button variants (number, function, clear, special)
  - ✅ Color-coded per design spec
  - ✅ Special orange button (🟠) at position 24
  
- [x] **Step 10**: Create LCD display component
  - ✅ Top status bar with placeholder indicators
  - ✅ Operator indicators (+ - × ÷) that light up
  - ✅ Error indicator ('E')
  - ✅ Main number display (right-aligned, bottom-aligned)
  - ✅ Roboto Mono font for monospaced digits
  - ✅ 10-character limit enforced
  - 📝 **LEARNED**: Used `items-end justify-end` for bottom-right alignment

### 🔄 MILESTONE 3: Calculator Logic & State (Steps 11-15) - NOT STARTED

- [ ] **Step 11**: Set up Zustand store
- [ ] **Step 12**: Create calculation library
- [ ] **Step 13**: Wire up button clicks
- [ ] **Step 14**: Implement calculation engine
- [ ] **Step 15**: Add keyboard listeners

### 🔄 MILESTONE 4: Audio System (Steps 16-20)
### 🔄 MILESTONE 5: Recording & Playback (Steps 21-25)
### 🔄 MILESTONE 6: Calculator Cards System (Steps 26-30)
### 🔄 MILESTONE 7: Skin System Foundation (Steps 31-35)
### 🔄 MILESTONE 8: Blog & Content (Steps 36-40)
### 🔄 MILESTONE 9: SEO & Monetization (Steps 41-45)
### 🔄 MILESTONE 10: Launch & Polish (Steps 46-50)

---

## 🔑 Key Decisions & Rules

### Code Standards
1. **File Path Comments**: EVERY file starts with `// path/to/file.tsx` comment
2. **No `src/` Directory**: Use `app/` directly (Next.js App Router standard)
3. **TypeScript**: Strict mode, explicit types for all props
4. **Component Structure**: Client components use `'use client'` directive

### Design Rules
1. **Unit System**: 8px base unit for all measurements
2. **Button Sizes**: Always 7×5 units (56×40px)
3. **Gradients**: Always left-to-right
4. **Fonts**: Roboto Mono for display, Arial for buttons
5. **Display Limit**: Max 10 characters visible

### Development Workflow
1. Code locally in VS Code
2. Commit to GitHub via command line
3. Vercel auto-deploys on push to main
4. Test on staging URL before domain switch

### Domain Setup (Cloudflare → Vercel)
- **Current**: addition.site registered with Cloudflare
- **Hosting**: Vercel (can use Cloudflare DNS with Vercel hosting)
- **Process**: 
  1. Add addition.site to Vercel project
  2. Get Vercel's DNS target (A/CNAME records)
  3. Update Cloudflare DNS to point to Vercel
  4. Keep Cloudflare for DNS management only

---

## 🐛 Issues & Solutions

### Issue 1: TypeScript path alias not working
- **Error**: `Cannot find module '@/components/Calculator'`
- **Cause**: `tsconfig.json` had `"@/*": ["./*"]` instead of `"@/*": ["./app/*"]`
- **Solution**: Updated path mapping to point to `app/` directory
- **Learning**: Always restart dev server after `tsconfig.json` changes

### Issue 2: Buttons not filling width
- **Error**: Buttons only as wide as text content
- **Cause**: Button component missing `w-full h-full` classes
- **Solution**: Added `w-full h-full` to button base styles
- **Learning**: Flexbox children need explicit sizing to fill container

### Issue 3: TypeScript error on `isEmpty` prop
- **Error**: `Property 'isEmpty' does not exist on type...`
- **Cause**: Button array had mixed types without explicit type definition
- **Solution**: Created `ButtonConfig` type with optional `isEmpty?: boolean`
- **Learning**: Type arrays explicitly when objects have optional properties

---

## 📝 Next Session Startup Checklist

To resume work in a new chat:
1. Share this `PROJECT_TIMELINE.md` file
2. Note current milestone and step number
3. Mention any specific feature you want to work on
4. I'll read the file and continue from where we left off!

**Quick Context for Claude**:
- Windows 10 environment
- Using command line for Git
- Vercel auto-deploys on push
- All files use path comments as first line
- No `src/` directory - everything in `app/`
- Domain on Cloudflare DNS (will point to Vercel)

---

## 🎯 Immediate Next Steps

1. **Step 11**: Set up Zustand store for calculator state
   - Create `/app/store/calculatorStore.ts`
   - Define state: display, operator, operand, history
   - Add actions: updateDisplay, setOperator, calculate, clear

2. **Domain Setup**: Point addition.site to Vercel
   - Add custom domain in Vercel dashboard
   - Update Cloudflare DNS records
   - Test production deployment

3. **Continue Milestone 3**: Wire up calculator logic
   - Steps 12-15 for full working calculator

---

**End of Timeline Document**