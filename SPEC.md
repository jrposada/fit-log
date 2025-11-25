Perfect! Optimizing for **in-session use** completely changes the priorities. Let's design for someone who's:
- Standing in a gym with chalk-covered hands
- Trying to quickly log sends between attempts
- Looking up that crimpy V4 in the cave
- Checking if they've done a route before

---

## Climbing Screen - In-Session Optimized UX

### Core Navigation Structure

**Tab-based switching at top:**
```
[Quick Log] [Browse] [Projects] [Stats]
```

Default to **Quick Log** since that's the primary action during sessions.

---

## 1. Quick Log Tab (Default View)

**This should be FAST—like 2 taps fast.**

### Layout:

```
┌─────────────────────────────┐
│  Quick Log                   │
├─────────────────────────────┤
│                              │
│  🏢 Current Location         │
│  [Mesa Rim - Pacific Beach ▼]│
│                              │
│  ──────────────────────────  │
│                              │
│  Recent routes here:         │
│                              │
│  ┌──────────────────────┐   │
│  │ 🟢 V4 | Crimp City   │   │
│  │ Cave section    [✓ Log]   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ 🟡 V5 | The Gaston   │   │
│  │ Corner wall    [✓ Log]   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ 🔴 V6 | Roof Monster │   │
│  │ Ceiling       [+ Project] │
│  └──────────────────────┘   │
│                              │
│  [+ Log Custom Route]        │
│                              │
└─────────────────────────────┘
```

**Key features:**

1. **Location selector at top**
   - Auto-detect current gym (GPS + saved locations)
   - Quick switch if wrong: dropdown with recent gyms
   - Filters entire experience to that location

2. **Recency-based list**
   - Routes recently logged by YOU at this location
   - Routes set recently (if you have setter data)
   - Popular routes this week (social signal)
   - This anticipates "I'm working the same problems as last session"

3. **Single-tap logging**
   - Each route card has immediate action button
   - "✓ Log" = send (tapped → done, with haptic feedback)
   - Hold for options (flash, attempts, notes)

4. **Visual scanability**
   - Color coding by grade or zone
   - Large, finger-friendly tap targets (min 44pt)
   - Route name + key identifier (wall section)

---

## 2. Browse Tab

**For finding new routes or that specific problem you heard about.**

### Layout:

```
┌─────────────────────────────┐
│  Browse                      │
├─────────────────────────────┤
│  🔍 [Search routes...]       │
│                              │
│  Quick Filters (chips):      │
│  [V3-V5] [Overhang] [New] ⚙️│
│                              │
│  ──────────────────────────  │
│                              │
│  📍 Cave Section             │
│  ┌──────────────────────┐   │
│  │ 🟢 V4 | Crimp City   │   │
│  │ Set: 2 weeks ago          │
│  │ ⭐ 4.3 | 👥 47 sends  │   │
│  │              [Quick View] │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ 🟣 V3 | Slab Master  │   │
│  │ Set: 1 month ago     │ ✓ │ <- You've sent this
│  │ ⭐ 3.8 | 👥 89 sends  │   │
│  │              [Quick View] │
│  └──────────────────────┘   │
│                              │
└─────────────────────────────┘
```

**Key features:**

1. **Search-first**
   - Predictive search as you type
   - Search by: route name, grade, setter, color, hold type
   - "V4 crimpy overhang" should work

2. **Sticky filter chips**
   - Pre-selected to your typical grade range
   - Tap to toggle: Grade, Angle, Style, New/Classic
   - Gear icon → advanced filters (location areas, setter, date range)

3. **Grouped by location/zone**
   - "Cave Section" header with collapse/expand
   - Helps mental mapping to physical gym
   - Can pin zones you're working

4. **Status indicators**
   - Checkmark badge: already sent
   - 🎯 Project badge: on your project list
   - Attempt count if tried but not sent

5. **Quick View button**
   - Opens bottom sheet (not full screen)
   - Shows croquis, key details, quick log
   - Swipe down to dismiss = back to browsing

---

## 3. Projects Tab

**Your personal hit list.**

### Layout:

```
┌─────────────────────────────┐
│  My Projects                 │
├─────────────────────────────┤
│                              │
│  🎯 Active (4)               │
│                              │
│  ┌──────────────────────┐   │
│  │ 🔴 V6 | Roof Monster │   │
│  │ Mesa Rim PB               │
│  │ 5 attempts | Last: 2d ago │
│  │                           │
│  │ [Log Attempt] [Details]   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ 🟠 V5 | Shoulder Burn│   │
│  │ Mesa Rim PB               │
│  │ 12 attempts | Last: 1w ago│
│  │ Note: "Try right heel"    │
│  │ [Log Attempt] [Details]   │
│  └──────────────────────┘   │
│                              │
│  ✓ Completed (23)            │
│  [Show completed projects]   │
│                              │
└─────────────────────────────┘
```

**Key features:**

1. **Attempt tracking front & center**
   - How many tries
   - Last attempt date (creates urgency)
   - Quick note snippet from last session

2. **Dual actions**
   - "Log Attempt" (failed) vs. "Send!" (success)
   - Both single tap

3. **Motivation signals**
   - Progress indicator (getting closer?)
   - Time since last attempt
   - Your notes/beta visible

4. **Archive completed**
   - Collapsed by default
   - Satisfying to see the list grow

---

## 4. Route Detail View (Modal/Bottom Sheet)

**Appears when tapping any route from Browse or Projects.**

### Layout (Bottom Sheet, 80% height):

```
┌─────────────────────────────┐
│         [Swipe bar]          │
├─────────────────────────────┤
│                              │
│  [   Croquis/Photo   ]       │
│  [     Full Width    ]       │
│                              │
├─────────────────────────────┤
│  🔴 V6 | Roof Monster        │
│  Cave Section | Mesa Rim PB  │
│                              │
│  Set by: @josh_setter        │
│  2 weeks ago                 │
│                              │
│  ⭐ 4.1 (38 ratings)          │
│  👥 156 sends                │
│                              │
│  ──────────────────────────  │
│                              │
│  Your Status:                │
│  🎯 Project | 5 attempts     │
│                              │
│  [  ✓ Log Send  ] [+ Attempt]│
│                              │
│  ──────────────────────────  │
│                              │
│  📝 Your Notes:              │
│  "Right heel hook on 3rd..." │
│  [Edit]                      │
│                              │
│  🏷️ Tags: Crimpy, Roof, Powerful│
│                              │
│  [▼ View Community Beta (12)]│
│                              │
└─────────────────────────────┘
```

**Key features:**

1. **Croquis hero**
   - Full-width image
   - Pinch to zoom (chalk-hand friendly)
   - Swipeable if multiple photos

2. **Context at a glance**
   - Grade, name, location
   - Social proof (ratings, sends)
   - Setter info

3. **Action-oriented**
   - Your current status highlighted
   - Primary action buttons prominent
   - No hunting for "how do I log this"

4. **Personal notes integrated**
   - Not buried in submenu
   - Quick edit
   - Beta is personal first, community second

---

## Interaction Patterns for In-Session Use

### 1. **Logging Flow (Optimized)**

**Happy path (already in recents):**
- Tap Quick Log tab
- Tap ✓ on route card
- Done. (2 taps, <2 seconds)

**With details:**
- Tap and hold ✓
- Quick menu: Flash | 2-3 tries | Project | Failed
- Select → optional note field
- Confirm (haptic)

### 2. **Adding New Route**

**If not in recents:**
- Switch to Browse
- Search or scroll to route
- Tap Quick View
- Log Send button
- Back to browsing or Quick Log

### 3. **Project Management**

**Marking as project:**
- From any route detail: "Add to Projects" button
- Automatically tracks attempts going forward

**Sending a project:**
- Quick Log shows projects prominently
- Tap Send → celebration micro-animation
- Moves to "Completed" automatically

---

## Smart Features for In-Session

### 1. **Session Context Awareness**
- App detects when you're at a gym (location + time pattern)
- Banner: "Session at Mesa Rim started 45 min ago"
- Quick Log prioritizes this location
- Auto-suggests: "Log all attempts from today?"

### 2. **Offline-First**
- Cache current gym's routes on last wifi connection
- Log climbs offline → sync when back online
- Visual indicator when offline

### 3. **Quick Grade Filter**
- Floating button to filter to "My Range" (your typical ±1 grade)
- Reduces scroll fatigue in busy gyms

### 4. **Voice/Photo Quick Log** (Future enhancement)
- Tap mic: "Logged send on Roof Monster"
- Tap camera: Photo of route tag/color → auto-suggests route

---

## Visual Design Considerations

### Thumb Zones
- Bottom 1/3 of screen: All primary actions
- Top: Navigation, filters (less critical during session)
- Middle: Scrollable content

### Contrast & Readability
- High contrast for gym lighting conditions
- Large text (min 16pt for body, 18pt+ for route names)
- Consider "Gym Mode" with increased brightness/contrast

### Feedback
- Haptic feedback on all logs (satisfying tactile response)
- Subtle animations (checkmark, confetti on project sends)
- Toast notifications for success (not blocking)

---

## Edge Cases to Handle

1. **Route not found**
   - "Can't find it? Add custom route" always visible
   - Quick form: Photo, Name, Grade, Wall → done

2. **Multiple climbers sharing device**
   - Quick profile switch in header
   - "Climbing with:" option to tag partners

3. **Chalk hands**
   - Large tap targets (minimum 48x48pt)
   - Avoid complex gestures
   - Support double-tap to confirm sends (accessibility + ease)

4. **Battery drain**
   - Location tracking only when app active
   - Option to disable auto-session detection
   - Low power mode when battery <20%

---

## Key Metrics to Track

How you'll know this UX is working:

- **Time to log send** (goal: <5 seconds)
- **% of climbs logged vs. actual climbs** (completion rate)
- **Browse → Detail → Log conversion** (findability)
- **Project engagement** (% of projects eventually sent)

---

Would you like me to detail the interaction flows for any specific scenario, like handling a failed attempt or browsing for a new route to try? Or should we move on to the Training screen next?
