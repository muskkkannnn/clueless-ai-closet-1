# Testing Strategy – Clueless AI Closet MVP

## 🎯 Goal
Ensure the end-to-end outfit visualization flow works reliably before launch.

---

## ✅ Manual Tests (REQUIRED – Must pass before deploy)

### Core Flow
- Upload image → background is removed
- Image appears in Digital Closet grid
- Select 2–3 items in Canvas
- Click “Visualize”
- AI visualization is generated
- Visualization displays correctly
- Save visualization to gallery
- Download image locally
- Delete item from Digital Closet

---

## ⚠️ Edge Cases (Must not crash)

- Empty closet → show helpful empty state
- Upload non-image file → show validation error
- Upload very large image → handle gracefully
- AI API failure → show retry / error message
- Slow network → show loading state
- Duplicate uploads → allowed (MVP behavior)

---

## ⏱ Performance Checks (Soft Limits)

- Image upload: < 5 seconds
- Background removal: < 5 seconds
- AI visualization: < 20 seconds
- UI remains responsive during AI calls

---

## 🌐 Browser Testing (Minimum)

- Chrome (Desktop + Mobile)
- Safari (Desktop + Mobile)
- Firefox (Desktop)

---

## 🚫 Explicitly NOT Testing (Out of MVP Scope)

- Load testing
- Automated unit tests
- Visual regression testing
- Mobile native behavior
- Accessibility audits (basic only)

---

## ✅ Definition of “Tested Enough”
The MVP is considered test-ready when:
- One complete user flow works end-to-end
- Errors are handled without crashes
- App works on desktop + mobile browsers
- No blocking bugs in core flow


<!-- # Testing Strategy

## Manual Tests (Required)
- Upload image → background removed
- Image appears in digital closet
- Select 2–3 items in canvas
- Generate AI visualization
- Save visualization
- Download image
- Delete item from closet

## Edge Cases
- Empty closet
- Upload non-image file
- AI API failure
- Slow network

## Performance Checks
- Upload < 5s
- Background removal < 5s
- AI generation < 20s

## Browsers
- Chrome (desktop + mobile)
- Safari (desktop + mobile)
- Firefox -->
