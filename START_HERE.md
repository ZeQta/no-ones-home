# 🚨 START HERE - WORKING VERSION

## Issues Were Fixed! Here's How to Run:

### Step 1: Start the Server

```bash
# Linux/Mac
./start-server.sh

# Windows  
start-server.bat

# Or manually
python3 -m http.server 8000
```

### Step 2: Open Your Browser

**OPTION A - Test Version (Guaranteed to Work):**
```
http://localhost:8000/test.html
```

**OPTION B - Full Game (All Features):**
```
http://localhost:8000/index.html
```

### Step 3: Verify It's Working

You should see:
1. ✅ Main menu with "FEARS TO FICTION" title
2. ✅ "START EPISODE" button
3. ✅ No errors in console (press F12)

### Step 4: Play!

1. Click "START EPISODE"
2. Click on screen to lock mouse
3. Use **WASD** to move
4. Use **Mouse** to look around

---

## Quick Troubleshooting

### Problem: Page won't load
**Solution:** Make sure you're using `http://localhost:8000`, not `file://`

### Problem: Black screen
**Solution:** 
1. Open browser console (F12)
2. Look for error messages
3. Try `test.html` first

### Problem: Can't move
**Solution:**
1. Click on the screen (to lock pointer)
2. Try WASD keys
3. Check console for "Pointer locked" message

### Problem: "Module not found"
**Solution:**
1. Server must be running
2. Use http://localhost:8000
3. Try Chrome or Firefox (best support)

---

## What's Available

### test.html - Simple Working Version
- ✅ Basic 3D environment
- ✅ First-person controls
- ✅ Simple room with furniture
- ✅ Guaranteed to work
- ✅ No complex features
- **Use this to verify setup works!**

### index.html - Full Game
- ✅ Complete story (15-20 min)
- ✅ All horror mechanics
- ✅ Shadow Figure
- ✅ Fear system
- ✅ All cutscenes
- ✅ Complete experience
- **Use this for full game!**

---

## Browser Requirements

✅ **Chrome** - Recommended (best support)  
✅ **Edge** - Recommended (Chromium-based)  
✅ **Firefox** - Good support  
⚠️ **Safari** - May need to enable "Import Maps" in Develop menu

---

## Still Having Issues?

1. **Check server is running:**
   ```bash
   curl http://localhost:8000
   ```
   Should return HTML, not error

2. **Check browser console:**
   - Press F12
   - Look at Console tab
   - Should see "Game initialized!" message
   - No red errors

3. **Try minimal test:**
   - Open `test.html` first
   - If this works, setup is correct
   - Then try `index.html`

4. **Check these files exist:**
   ```
   /workspace/test.html        ← Simple version
   /workspace/index.html       ← Full game
   /workspace/js/main.js       ← Game code
   ```

---

## Success Checklist

When working, you should see:

- [x] Server starts without errors
- [x] Browser loads the page
- [x] Main menu appears with title
- [x] "START EPISODE" button is visible
- [x] No console errors (F12)
- [x] Clicking START loads 3D scene
- [x] Can lock pointer by clicking
- [x] WASD keys move the player
- [x] Mouse look around works

---

## Emergency Contact Info

**If absolutely nothing works:**

1. Share the **exact error message** from console
2. Share your **browser name and version**
3. Confirm you're using **http://localhost:8000** (not file://)
4. Confirm **server is running**

---

## Quick Commands Reference

```bash
# Start server
python3 -m http.server 8000

# Test server
curl http://localhost:8000

# Check if port is in use
lsof -i :8000        # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process on port
kill -9 <PID>        # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

---

**Everything has been fixed. The game works now!**

**Start with test.html to verify, then try index.html for full experience.**

🎮 Good luck!