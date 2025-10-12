# 🧪 Real-Time Notification System - Testing Checklist

## Pre-Testing Setup

### ✅ Start All Services

```powershell
# Option 1: Use batch scripts (RECOMMENDED)
START-ALL.bat

# Option 2: Manual startup
# Terminal 1 - Patient Portal Backend
cd PaitentsPage
npm run start:backend

# Terminal 2 - Patient Portal Frontend
cd PaitentsPage
npm run dev

# Terminal 3 - Hospital Backend
cd Hospital
npm run start:backend

# Terminal 4 - Hospital Frontend
cd Hospital
npm run dev
```

### ✅ Verify Services Running

Check that these URLs are accessible:
- ✅ Patient Portal Frontend: http://localhost:5173
- ✅ Patient Portal Backend: http://localhost:5001/health (should show "OK")
- ✅ Hospital Frontend: http://localhost:5174
- ✅ Hospital Backend: http://localhost:5000

---

## 📋 Visual Testing Checklist

### Test 1: Connection Status Indicator

**Hospital Dashboard** → Check bottom-left corner

- [ ] Green pulsing dot visible
- [ ] Text shows "Live Updates Active"
- [ ] Badge has rounded corners with shadow
- [ ] Background is light green (green-50)
- [ ] Badge animates in on page load

**Expected**: ![Connection Badge](data:image/svg+xml,%3Csvg width='200' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23f0fdf4' stroke='%23bbf7d0' width='200' height='50' rx='25'/%3E%3Ccircle cx='30' cy='25' r='4' fill='%2322c55e'/%3E%3Ctext x='45' y='30' font-family='sans-serif' font-size='14' fill='%2315803d'%3ELive Updates Active%3C/text%3E%3C/svg%3E)

---

### Test 2: Book Appointment (Patient Portal)

**Patient Portal** → Book Appointment page

**Fill form:**
- [ ] Patient Name: "John Doe"
- [ ] Phone: "555-0123"
- [ ] Email: "john@example.com"
- [ ] Symptoms: "High fever and persistent cough"
- [ ] Priority: "High"
- [ ] Preferred Doctor: "Dr. Smith"
- [ ] Date/Time: Tomorrow at 10:00 AM

**Submit:**
- [ ] Click "Book Appointment" button
- [ ] Success toast appears (green)
- [ ] Form resets
- [ ] No errors in console

---

### Test 3: Real-Time Notification (Hospital Dashboard)

**Hospital Dashboard** → Watch for notifications

**Within 1-2 seconds after booking:**

#### 3.1 Sound Alert
- [ ] Hear two-tone beep (ding-dong)
- [ ] Sound is pleasant and not too loud
- [ ] Sound plays only once

#### 3.2 Browser Notification
- [ ] Desktop notification appears
- [ ] Shows: "New Appointment from John Doe"
- [ ] Has hospital icon/logo
- [ ] Auto-dismisses after a few seconds

#### 3.3 Toast Notification
- [ ] Green toast slides in from top-right
- [ ] Message: "New appointment from John Doe"
- [ ] Success icon (checkmark) visible
- [ ] Progress bar animates from full to empty
- [ ] Auto-hides after 5 seconds
- [ ] Can manually close with X button

#### 3.4 Appointment List Update
- [ ] New appointment appears in "Pending Appointments"
- [ ] Shows correct patient name
- [ ] Shows correct symptoms
- [ ] Priority badge displays correctly (red for "High")
- [ ] Status shows "Pending"

---

### Test 4: Appointment Detail Modal

**Hospital Dashboard** → Click on the new appointment card

#### 4.1 Modal Opening Animation
- [ ] Modal fades in smoothly
- [ ] Modal scales from 95% to 100%
- [ ] Backdrop appears with blur effect
- [ ] Animation takes ~200ms

#### 4.2 Modal Content
- [ ] **Header**: Shows "Appointment Details"
- [ ] **Patient Info**:
  - [ ] Name: "John Doe"
  - [ ] Phone: "555-0123"
  - [ ] Email: "john@example.com"
- [ ] **Status Badge**: Shows current status with color
- [ ] **Priority Badge**: Shows "High" in red
- [ ] **Symptoms Section**:
  - [ ] Icon visible (stethoscope)
  - [ ] Full symptoms text displayed
- [ ] **Timeline Section**:
  - [ ] Created date/time shown
  - [ ] Preferred appointment date/time shown
- [ ] **Documents Section**:
  - [ ] Shows "No documents attached" or file list

#### 4.3 Action Buttons
- [ ] **Accept Button**:
  - [ ] Green background (green-500)
  - [ ] White text
  - [ ] Hover scales to 105%
  - [ ] Checkmark icon visible
- [ ] **Reject Button**:
  - [ ] Red background (red-500)
  - [ ] White text
  - [ ] Hover scales to 105%
  - [ ] X icon visible
- [ ] **Close Button** (top-right X):
  - [ ] Hover changes color
  - [ ] Closes modal on click

---

### Test 5: Accept Appointment

**Hospital Dashboard** → Open modal → Click "Accept Appointment"

**Expected Results:**
- [ ] Modal closes smoothly
- [ ] Success toast appears: "Appointment accepted!"
- [ ] Appointment card status updates to "Confirmed"
- [ ] Status badge turns green
- [ ] Card may move to "Confirmed Appointments" section
- [ ] No errors in console

**Verify in Database:**
```sql
-- Run in Patient Portal backend terminal
sqlite3 patients-portal.db
SELECT * FROM appointments WHERE patient_name = 'John Doe';
-- status should be 'confirmed'
```

---

### Test 6: Reject Appointment

**Create new appointment** → Open modal → Click "Reject Appointment"

**Expected Results:**
- [ ] Modal closes smoothly
- [ ] Toast appears: "Appointment rejected" (red/error type)
- [ ] Appointment card status updates to "Rejected"
- [ ] Status badge turns red or gray
- [ ] Card may move to different section or get marked
- [ ] No errors in console

---

### Test 7: Toast Notification Behavior

**Test auto-hide:**
- [ ] Book appointment
- [ ] Toast appears
- [ ] Progress bar shrinks over 5 seconds
- [ ] Toast slides out after 5 seconds

**Test manual close:**
- [ ] Book another appointment
- [ ] Click X button on toast immediately
- [ ] Toast disappears instantly

**Test multiple toasts:**
- [ ] Accept an appointment (toast 1)
- [ ] Quickly reject another (toast 2)
- [ ] Both toasts should be visible (stacked)

---

### Test 8: Connection Resilience

#### 8.1 Test Reconnect
- [ ] Stop Patient Portal backend: `Ctrl+C` in backend terminal
- [ ] Connection badge disappears or changes color
- [ ] Console shows reconnection attempts
- [ ] Restart backend: `npm run start:backend`
- [ ] Connection badge reappears
- [ ] Book appointment → Notification works again

#### 8.2 Test No Duplicates
- [ ] Book appointment
- [ ] Note appointment ID
- [ ] Refresh Hospital Dashboard
- [ ] Should NOT trigger notification for existing appointment
- [ ] Only new appointments should notify

---

### Test 9: Browser Notification Permission

**First time loading Hospital Dashboard:**
- [ ] Permission prompt appears
- [ ] Click "Allow"
- [ ] Permission saved for future visits

**If blocked:**
- [ ] System still works (toast + sound only)
- [ ] No errors in console
- [ ] Browser notification section can be ignored

---

### Test 10: Responsive Design

**Test on different screen sizes:**

**Desktop (1920x1080):**
- [ ] Modal centered
- [ ] Connection badge visible in bottom-left
- [ ] Toast in top-right corner
- [ ] No layout issues

**Laptop (1366x768):**
- [ ] Modal fits on screen
- [ ] All content readable
- [ ] Buttons accessible

**Tablet (768px):**
- [ ] Modal scrollable if needed
- [ ] Buttons remain tappable
- [ ] Text readable

---

### Test 11: Animation Smoothness

**Check all animations:**
- [ ] Modal fade-in/out: Smooth, no jank
- [ ] Toast slide-in/out: Smooth transition
- [ ] Button hover scale: Instant, no delay
- [ ] Connection badge pulse: Continuous, smooth
- [ ] Card hover lift: Smooth transform

**Performance check:**
- [ ] No frame drops
- [ ] Console shows no performance warnings
- [ ] Animations run at 60fps

---

### Test 12: Error Handling

#### 12.1 Backend Down
- [ ] Stop Patient Portal backend
- [ ] Try booking appointment
- [ ] Error toast appears
- [ ] User-friendly message shown

#### 12.2 Network Error
- [ ] Disconnect internet
- [ ] Try accepting appointment
- [ ] Error handling graceful
- [ ] Reconnects when internet returns

#### 12.3 Invalid Data
- [ ] Book appointment with missing fields
- [ ] Validation prevents submission
- [ ] No crashes

---

## 📊 Testing Results Summary

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Connection Badge | ⬜ Pass / ⬜ Fail | |
| 2 | Book Appointment | ⬜ Pass / ⬜ Fail | |
| 3 | Real-Time Notification | ⬜ Pass / ⬜ Fail | |
| 4 | Detail Modal | ⬜ Pass / ⬜ Fail | |
| 5 | Accept Appointment | ⬜ Pass / ⬜ Fail | |
| 6 | Reject Appointment | ⬜ Pass / ⬜ Fail | |
| 7 | Toast Behavior | ⬜ Pass / ⬜ Fail | |
| 8 | Connection Resilience | ⬜ Pass / ⬜ Fail | |
| 9 | Browser Permissions | ⬜ Pass / ⬜ Fail | |
| 10 | Responsive Design | ⬜ Pass / ⬜ Fail | |
| 11 | Animation Smoothness | ⬜ Pass / ⬜ Fail | |
| 12 | Error Handling | ⬜ Pass / ⬜ Fail | |

---

## 🐛 Common Issues & Solutions

### Issue: Sound doesn't play
**Solution**: 
1. Click anywhere on the page first (browser autoplay policy)
2. Check browser console for errors
3. Verify audio context is allowed

### Issue: No notifications received
**Solution**:
1. Check Patient Portal backend is running on port 5001
2. Open DevTools → Network tab → Look for `stream` connection
3. Verify connection badge is green
4. Check console for SSE errors

### Issue: Modal doesn't open
**Solution**:
1. Check console for React errors
2. Verify appointment data structure
3. Check if `onClick` handler is attached to card

### Issue: Toast doesn't auto-hide
**Solution**:
1. Check if timeout is being cleared
2. Verify `isVisible` state changes
3. Check for JavaScript errors

### Issue: Animations are laggy
**Solution**:
1. Check CPU usage in browser task manager
2. Reduce motion in browser settings if needed
3. Check for other resource-heavy processes

---

## ✅ Final Checklist

Before marking as complete, verify:

- [ ] All 12 tests passed
- [ ] No console errors
- [ ] No TypeScript warnings
- [ ] Sound plays correctly
- [ ] Modal opens/closes smoothly
- [ ] Toasts appear and auto-hide
- [ ] Accept/Reject updates database
- [ ] Real-time updates work consistently
- [ ] Connection status accurate
- [ ] Documentation is clear

---

## 🎉 Success Criteria

The implementation is **COMPLETE** when:

✅ Patient books appointment → Hospital receives notification within 2 seconds
✅ Sound alert plays once per new appointment
✅ Browser notification appears (if permitted)
✅ Toast notification slides in and auto-hides
✅ Modal opens on card click with smooth animation
✅ Accept/Reject buttons update appointment status
✅ Connection status indicator shows live status
✅ System auto-reconnects on connection loss
✅ No duplicate notifications for same appointment
✅ All animations are smooth and performant

---

## 📸 Screenshots Checklist

**Take screenshots of:**
1. Connection badge (bottom-left, green pulsing)
2. Toast notification (top-right, green success)
3. Appointment detail modal (centered, with buttons)
4. Appointment card with updated status
5. Browser notification popup
6. Console showing SSE connection message

---

**Happy Testing! 🚀**

Report any issues in the project GitHub repository or contact the development team.
