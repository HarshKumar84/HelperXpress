# Testing Service-Type Auto-Assignment

This guide will help you verify that the auto-assignment system correctly matches service types to workers.

## 🚀 How to Test

### 1. **Open Developer Console**
- Press `F12` or `Ctrl+Shift+I` to open DevTools
- Go to the **Console** tab
- Keep it visible during testing

### 2. **Start the App**
```bash
npm run dev
```

### 3. **Test Each Service Type**

For each service type below, follow these steps:

1. Click "Book Service" button
2. Fill in the form:
   - Description: "Test booking"
   - Address: Any address
   - Phone: Your phone number
3. **Enable Location** (grant permission when prompted)
4. Select the **Service Type** from dropdown
5. Click "Find Helper"
6. **Watch the Console** for the matching logs
7. **Verify** the assigned worker in the UI

---

## ✅ Expected Results by Service Type

### **🔧 PLUMBING**
**Expected Workers**: Rajesh Kumar (H001), Arun Kumar (H009), or Ravi Shankar (H010)
- Skill: `'plumbing'`
- All have experience 3-11 years
- Ratings: 4.5-4.9 ⭐

**Console Should Show**:
```
📋 Booking Request: {
  service: "plumbing",
  location: {...},
  totalHelpersAvailable: 24
}

🔍 MATCHING ALGORITHM: Finding plumbing worker...
📋 Skill Filter: 3/24 workers have "plumbing" skill
✅ Availability Filter: 3/3 workers are available
📍 Distance Filter: 3/3 workers within 15 minutes
🎯 SELECTED WORKER: Rajesh Kumar (H001)
   📊 Rating: 4.8⭐ | Experience: 8 years
   📍 Distance: 2.5km | ETA: ~5 min
   ℹ️ Skills: plumbing

✅ Worker Assigned: {
  workerName: "Rajesh Kumar",
  workerId: "H001",
  serviceType: "plumbing",
  workerSkills: ["plumbing"],
  rating: 4.8,
  experience: 8
}
```

---

### **⚡ ELECTRICAL**
**Expected Workers**: Amit Singh (H002), Suresh Yadav (H011), or Karthik Reddy (H012)
- Skill: `'electrical'`
- Ratings: 4.7-4.9 ⭐

**Console Should Show**:
```
🔍 MATCHING ALGORITHM: Finding electrical worker...
📋 Skill Filter: 3/24 workers have "electrical" skill
✅ Availability Filter: 3/3 workers are available
📍 Distance Filter: 3/3 workers within 15 minutes
🎯 SELECTED WORKER: Amit Singh (H002)
```

---

### **🧹 CLEANING**
**Expected Workers**: Priya Sharma (H003), Anjali Singh (H013), or Veena Rani (H014)
- Skill: `'cleaning'`
- Ratings: 4.3-4.8 ⭐

---

### **🪚 CARPENTRY**
**Expected Workers**: Vikram Patel (H004), Ramesh Tiwari (H015), or Chandru Das (H016)
- Skill: `'carpentry'`
- Ratings: 4.6-4.8 ⭐

---

### **🎨 PAINTING**
**Expected Workers**: Arjun Malhotra (H017) or Balaji Reddy (H018)
- Skill: `'painting'`
- Ratings: 4.7-4.8 ⭐

---

### **❄️ AC REPAIR**
**Expected Workers**: Naveen Kumar (H019) or Pranav Singh (H020)
- Skill: `'ac-repair'`
- Ratings: 4.6-4.9 ⭐

---

### **🐜 PEST CONTROL**
**Expected Workers**: Dinesh Kumar (H021) or Harish Patel (H022)
- Skill: `'pest-control'`
- Ratings: 4.5-4.7 ⭐

---

### **🌳 GARDENING**
**Expected Workers**: Sita Devi (H023) or Prakash Negi (H024)
- Skill: `'gardening'`
- Ratings: 4.4-4.6 ⭐

---

## 📊 Console Log Guide

### **Phase 1: Booking Request**
```
📋 Booking Request: {
  service: "[SELECTED_SERVICE]",
  location: {lat, lng},
  totalHelpersAvailable: 24
}
```
✅ Confirms service type received

### **Phase 2: Matching Algorithm**
```
🔍 MATCHING ALGORITHM: Finding [SERVICE] worker...
📋 Skill Filter: X/24 workers have "[SERVICE]" skill
✅ Availability Filter: X/X workers are available
📍 Distance Filter: X/X workers within 15 minutes
```
✅ Shows matching process step-by-step

### **Phase 3: Worker Selected**
```
🎯 SELECTED WORKER: [NAME] ([ID])
   📊 Rating: 4.8⭐ | Experience: 8 years
   📍 Distance: 2.5km | ETA: ~5 min
   ℹ️ Skills: [SKILL_LIST]
```
✅ Selected worker details

### **Phase 4: Assignment Confirmed**
```
✅ Worker Assigned: {
  workerName: "[NAME]",
  workerId: "[ID]",
  serviceType: "[SERVICE]",
  workerSkills: ["[SKILL]"],
  rating: 4.8,
  experience: 8
}
```
✅ Final confirmation

---

## 🔍 What to Verify

✅ **Skill Matching**
- [ ] Plumbing service → Plumbing worker assigned
- [ ] Electrical service → Electrical worker assigned
- [ ] Cleaning service → Cleaning worker assigned
- [ ] etc. for all 8 service types

✅ **Worker Information**
- [ ] Worker name displays in UI
- [ ] Worker rating shows correctly (4.3-4.9 ⭐)
- [ ] Worker experience shows (3-11 years)
- [ ] ETA calculates correctly (~5-15 minutes)

✅ **Console Output**
- [ ] Skill filter shows correct count of available workers
- [ ] Distance filter narrows down the list
- [ ] Selected worker is nearest or highest rated

✅ **UI Display**
- [ ] Selected worker card appears
- [ ] Status shows "✅ ASSIGNED"
- [ ] Can proceed to next step

---

## 🐛 Troubleshooting

### **Issue: "No workers found" message**
**Check**:
1. Is Location enabled? (Should show permission popup)
2. Are workers loaded? Check console for worker count
3. Are workers within 15 minutes? Check distance calculation

### **Issue: Wrong worker assigned**
**Check**:
1. Console logs → "Skill Filter" count
2. Is the worker's skill array correct?
3. Run in DevTools: `mockHelpers.find(h => h.id === 'H001').skills`

### **Issue: Console logs not showing**
**Fix**:
1. Clear console (right-click → Clear)
2. Refresh page (Ctrl+R)
3. Re-submit booking
4. Watch for logs in real-time

---

## 📋 Sample Test Checklist

```
TEST DATE: __________

Service Type Tests:
[ ] Plumbing - Worker: _____________ Rating: ___
[ ] Electrical - Worker: _____________ Rating: ___
[ ] Cleaning - Worker: _____________ Rating: ___
[ ] Carpentry - Worker: _____________ Rating: ___
[ ] Painting - Worker: _____________ Rating: ___
[ ] AC Repair - Worker: _____________ Rating: ___
[ ] Pest Control - Worker: _____________ Rating: ___
[ ] Gardening - Worker: _____________ Rating: ___

Console Logging:
[ ] Booking request logged
[ ] Skill filter logged
[ ] Availability filter logged
[ ] Distance filter logged
[ ] Worker selected & logged
[ ] Assignment confirmed

UI Display:
[ ] Worker name shown
[ ] Worker rating shown
[ ] Status shows "ASSIGNED"
[ ] ETA calculated
[ ] Can proceed to booking

Issues Found:
[ ] None
[ ] List: ___________________________
```

---

## 🎯 How the System Works

1. **User books service** → Service type sent to backend
2. **Matches skill** → Finds workers with required skill
3. **Checks availability** → Filters only available workers
4. **Calculates distance** → Finds workers within 15 minutes
5. **Selects best** → Nearest worker, then highest rated
6. **Assigns** → Shows worker details to user
7. **Fallback** → If none within 15 min, auto-assigns new worker

---

## 📞 Worker Contact Information

Keep this for reference:

| Service | Worker ID | Name | Phone | Skills |
|---------|-----------|------|-------|--------|
| Plumbing | H001 | Rajesh Kumar | +91-8800-11001 | plumbing |
| Plumbing | H009 | Arun Kumar | +91-8800-11009 | plumbing |
| Plumbing | H010 | Ravi Shankar | +91-8800-11010 | plumbing |
| Electrical | H002 | Amit Singh | +91-8800-11002 | electrical |
| Electrical | H011 | Suresh Yadav | +91-8800-11011 | electrical |
| Electrical | H012 | Karthik Reddy | +91-8800-11012 | electrical |
| Cleaning | H003 | Priya Sharma | +91-8800-11003 | cleaning |
| Cleaning | H013 | Anjali Singh | +91-8800-11013 | cleaning |
| Cleaning | H014 | Veena Rani | +91-8800-11014 | cleaning |
| Carpentry | H004 | Vikram Patel | +91-8800-11004 | carpentry |
| Carpentry | H015 | Ramesh Tiwari | +91-8800-11015 | carpentry |
| Carpentry | H016 | Chandru Das | +91-8800-11016 | carpentry |
| Painting | H017 | Arjun Malhotra | +91-8800-11017 | painting |
| Painting | H018 | Balaji Reddy | +91-8800-11018 | painting |
| AC Repair | H019 | Naveen Kumar | +91-8800-11019 | ac-repair |
| AC Repair | H020 | Pranav Singh | +91-8800-11020 | ac-repair |
| Pest Control | H021 | Dinesh Kumar | +91-8800-11021 | pest-control |
| Pest Control | H022 | Harish Patel | +91-8800-11022 | pest-control |
| Gardening | H023 | Sita Devi | +91-8800-11023 | gardening |
| Gardening | H024 | Prakash Negi | +91-8800-11024 | gardening |

---

**Happy Testing! 🎉**
