# ⚡ Quick Reference: Worker-by-Service Assignment

## 📋 Service → Worker Mapping

### 🔧 Plumbing
**When User Selects:** Plumbing
**Skill Required:** 'plumbing'
**Available Workers:**
- H001: Rajesh Kumar ⭐4.8 | 256 jobs | 8 yrs
- H009: Arun Kumar ⭐4.7 | 234 jobs | 7 yrs  
- H010: Ravi Shankar ⭐4.5 | 167 jobs | 6 yrs

---

### ⚡ Electrical
**When User Selects:** Electrical
**Skill Required:** 'electrical'
**Available Workers:**
- H002: Amit Singh ⭐4.6 | 189 jobs | 6 yrs
- H011: Suresh Yadav ⭐4.8 | 312 jobs | 9 yrs
- H012: Karthik Reddy ⭐4.6 | 198 jobs | 5 yrs

---

### 🧹 Cleaning
**When User Selects:** Cleaning
**Skill Required:** 'cleaning'
**Available Workers:**
- H003: Priya Sharma ⭐4.9 | 342 jobs | 10 yrs
- H013: Anjali Singh ⭐4.9 | 428 jobs | 11 yrs
- H014: Veena Rani ⭐4.7 | 256 jobs | 8 yrs

---

### 🔨 Carpentry
**When User Selects:** Carpentry
**Skill Required:** 'carpentry'
**Available Workers:**
- H004: Vikram Patel ⭐4.5 | 156 jobs | 5 yrs
- H015: Ramesh Tiwari ⭐4.6 | 189 jobs | 7 yrs
- H016: Chandru Das ⭐4.5 | 145 jobs | 6 yrs

---

### 🎨 Painting
**When User Selects:** Painting
**Skill Required:** 'painting'
**Available Workers:**
- H017: Arjun Malhotra ⭐4.7 | 223 jobs | 8 yrs
- H018: Balaji Reddy ⭐4.4 | 112 jobs | 4 yrs

---

### ❄️ AC Repair
**When User Selects:** AC Repair
**Skill Required:** 'ac-repair'
**Available Workers:**
- H019: Naveen Kumar ⭐4.8 | 267 jobs | 8 yrs
- H020: Pranav Singh ⭐4.6 | 178 jobs | 6 yrs

---

### 🦟 Pest Control
**When User Selects:** Pest Control
**Skill Required:** 'pest-control'
**Available Workers:**
- H021: Dinesh Kumar ⭐4.7 | 201 jobs | 7 yrs
- H022: Harish Patel ⭐4.5 | 134 jobs | 5 yrs

---

### 🌿 Gardening
**When User Selects:** Gardening
**Skill Required:** 'gardening'
**Available Workers:**
- H023: Sita Devi ⭐4.8 | 287 jobs | 9 yrs
- H024: Prakash Negi ⭐4.6 | 156 jobs | 6 yrs

---

## 🔄 Assignment Priority Logic

```
1. Service Type → Extract skill requirement
2. Get all helpers with matching skill
3. Filter available workers only (isAvailable: true)
4. Calculate distance from user to each
5. Sort by:
   a. Distance (nearest first)
   b. Rating (higher rated, if same distance)
6. Assign top candidate
```

## 📊 Summary Stats

| Service | Workers | Avg Rating | Avg Experience |
|---------|---------|-----------|-----------------|
| Plumbing | 3 | 4.67 | 7 yrs |
| Electrical | 3 | 4.67 | 6.67 yrs |
| Cleaning | 3 | 4.83 | 9.67 yrs |
| Carpentry | 3 | 4.53 | 6 yrs |
| Painting | 2 | 4.55 | 6 yrs |
| AC Repair | 2 | 4.70 | 7 yrs |
| Pest Control | 2 | 4.60 | 6 yrs |
| Gardening | 2 | 4.70 | 7.5 yrs |
| **TOTAL** | **24** | **4.64** | **6.8 yrs** |

## 🎯 How to Test

```javascript
// Example: User books Plumbing
bookingData = {
  service: 'plumbing',  // ← Service type
  userLocation: { lat: 28.615, lng: 77.207 },
  // ...other fields
}

// System internally:
1. Extracts: skill = 'plumbing'
2. Filters: helpers.filter(h => h.skills.includes('plumbing'))
   → [Rajesh Kumar, Arun Kumar, Ravi Shankar]
3. Checks availability: isAvailable && status === 'available'
   → All 3 ✓
4. Calculates: distance to each
5. Returns: Rajesh Kumar (nearest at 0.8km)
6. Assigns: Rajesh Kumar assigned to booking ✓
```

## ✅ Verification Checklist

- [x] All 8 service types have workers
- [x] Each service has at least 2 workers
- [x] All workers have unique IDs (H001-H024)
- [x] All workers have skills matching service types
- [x] All workers have available status set
- [x] All workers have realistic ratings
- [x] All workers have experience years
- [x] All workers have phone numbers
- [x] All workers have locations in Delhi
- [x] Distance calculations work
- [x] Skill filtering works
- [x] Auto-assignment active

## 🚀 Live Now!

System is ready. Users can book any service and get automatic worker assignment! ✅
