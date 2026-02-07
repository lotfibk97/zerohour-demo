# ZeroHour Demo

A controlled demo environment for the ZeroHour pre-impact intelligence platform.

---

## What is This?

ZeroHour is an executive-facing intelligence dashboard that shows how multiple independent signals can converge to indicate upcoming exposure events before they happen.

This demo allows you to:
- View the dashboard with different threat scenarios
- See how signals evolve from "normal" to "escalation imminent"
- Control the demo state using a simple admin panel

---

## How to Start the Demo

### Step 1: Install Requirements

Make sure you have Node.js installed on your computer. Then open a terminal and run:

```
npm install
```

### Step 2: Start the Server

```
npm start
```

Or:

```
node src/server.js
```

### Step 3: Open the Demo

Open your web browser and go to:

```
http://localhost:3000
```

---

## How to Use the Demo

### Login

Use these credentials:
- **Email:** demo@zerohour.com
- **Password:** demo1234

### Dashboard

After login, you'll see the main dashboard with four modules:
- Signal Intelligence Layer
- Correlation & Risk Engine
- Exposure Window Intelligence
- Decision & Access Layer

Click any module to see the signal cards.

### Admin Panel

Click the **"Admin"** button in the bottom-right corner to open the control panel.

From here you can:
1. **Select a Scenario** - Choose the type of threat:
   - Cyber Breach Pre-Disclosure
   - Weaponized Public Narrative
   - Legal Escalation Pre-Filing
   - Third Party Exposure Event

2. **Select a State** - Choose the escalation level:
   - Normal (no threat)
   - Signal Convergence (early warning)
   - Exposure Window Open (active threat)
   - Escalation Imminent (crisis)

3. **Apply** - Click to apply the selected scenario and state
4. **Reset** - Click to return to the default state

### Logout

Click the profile icon in the top-right corner and select "Logout".

---

## What Changes with Each State?

| State | What You'll See |
|-------|-----------------|
| **Normal** | Low risk, neutral status across all domains |
| **Signal Convergence** | Elevated risk, some domains showing "forming" status |
| **Exposure Window Open** | High risk, multiple domains "active", signal cards show alignment |
| **Escalation Imminent** | Critical risk, all domains active, exposure window visible |

The signal cards will show:
- Different trajectory positions (early → detected → alignment → exposure)
- Highlighted cards when exposure is imminent
- Updated descriptions matching the current state

---

## Demo Features

- **6 Signal Cards** - Fixed set that evolves with state changes
- **4 Scenarios** - Different threat types with unique content
- **4 States** - Progressive escalation levels
- **Live Date** - The timestamp updates to today's date each time you open the demo
- **Responsive Design** - Works on desktop and tablet screens

---

## Technical Notes

- **No database required** - All data is stored in memory
- **No internet required** - Runs completely offline
- **Port 3000** - The server runs on http://localhost:3000

---

## Troubleshooting

**The page won't load:**
- Make sure the server is running (you should see "Server running on port 3000" in the terminal)
- Check that nothing else is using port 3000

**The admin panel doesn't work:**
- Make sure you're clicking "Apply" after selecting scenario and state
- Check the browser console for any error messages

**Can't login:**
- Use exactly: demo@zerohour.com / demo1234
- Make sure there are no extra spaces

---

© Villeroy Reserve. ZeroHour™ is a proprietary intelligence product.
