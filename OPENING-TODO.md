# RESTAURANT OPENING — TODO

When the restaurant opens, ask Copilot to:

> "The restaurant is now open. Please undo all the 'TEMPORARILY HIDDEN' changes and remove the 'Opening Soon!' banner."

## What needs to change:

### 1. Remove "Opening Soon!" banner
- **File:** `src/components/sections/HeroSection.tsx`
- Remove the `{/* Opening Soon Banner */}` block

### 2. Unhide Reservation button in Header (desktop)
- **File:** `src/components/layout/Header.tsx`
- Uncomment the `TEMPORARILY HIDDEN` block for the desktop reservation button

### 3. Unhide Reservation button in Header (mobile)
- **File:** `src/components/layout/Header.tsx`
- Uncomment the `TEMPORARILY HIDDEN` block for the mobile reservation button

### 4. Unhide Reserve a Table CTA in Hero
- **File:** `src/components/sections/HeroSection.tsx`
- Uncomment the `TEMPORARILY HIDDEN` block for the hero CTA button

### 5. Unhide Reservation link in Footer
- **File:** `src/components/layout/Footer.tsx`
- Uncomment the `TEMPORARILY HIDDEN` block for the reservation link

### 6. Unhide ReservationSection on Homepage
- **File:** `src/pages/Index.tsx`
- Uncomment the `TEMPORARILY HIDDEN` block for `<ReservationSection />`

## Search hint
All hidden blocks are marked with: `TEMPORARILY HIDDEN - Uncomment when restaurant opens`
