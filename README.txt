================================================================================
                              ZEROHOUR DEMO
================================================================================

A controlled demo environment for the ZeroHour pre-impact intelligence platform.

--------------------------------------------------------------------------------
                            WHAT IS THIS?
--------------------------------------------------------------------------------

ZeroHour is an executive-facing intelligence dashboard that shows how multiple 
independent signals can converge to indicate upcoming exposure events before 
they happen.

This demo allows you to:
  - View the dashboard with different threat scenarios
  - See how signals evolve from "normal" to "escalation imminent"
  - Control the demo state using a simple admin panel

--------------------------------------------------------------------------------
                         HOW TO START THE DEMO
--------------------------------------------------------------------------------

STEP 1: INSTALL REQUIREMENTS

Make sure you have Node.js installed on your computer. Then open a terminal 
and run:

    npm install

STEP 2: START THE SERVER

    npm start

Or:

    node src/server.js

STEP 3: OPEN THE DEMO

Open your web browser and go to:

    http://localhost:3000

--------------------------------------------------------------------------------
                          HOW TO USE THE DEMO
--------------------------------------------------------------------------------

LOGIN
-----
Use these credentials:
  - Email:    demo@zerohour.com
  - Password: demo1234

DASHBOARD
---------
After login, you'll see the main dashboard with four modules:
  - Signal Intelligence Layer
  - Correlation & Risk Engine
  - Exposure Window Intelligence
  - Decision & Access Layer

Click any module to see the signal cards.

ADMIN PANEL
-----------
Click the "Admin" button in the bottom-right corner to open the control panel.

From here you can:

1. SELECT A SCENARIO - Choose the type of threat:
   - Cyber Breach Pre-Disclosure
   - Weaponized Public Narrative
   - Legal Escalation Pre-Filing
   - Third Party Exposure Event

2. SELECT A STATE - Choose the escalation level:
   - Normal (no threat)
   - Signal Convergence (early warning)
   - Exposure Window Open (active threat)
   - Escalation Imminent (crisis)

3. APPLY - Click to apply the selected scenario and state

4. RESET - Click to return to the default state

LOGOUT
------
Click the profile icon in the top-right corner and select "Logout".

--------------------------------------------------------------------------------
                      WHAT CHANGES WITH EACH STATE?
--------------------------------------------------------------------------------

STATE                     WHAT YOU'LL SEE
----------------------    --------------------------------------------------
Normal                    Low risk, neutral status across all domains

Signal Convergence        Elevated risk, some domains showing "forming" status

Exposure Window Open      High risk, multiple domains "active", 
                          signal cards show alignment

Escalation Imminent       Critical risk, all domains active, 
                          exposure window visible

The signal cards will show:
  - Different trajectory positions (early -> detected -> alignment -> exposure)
  - Highlighted cards when exposure is imminent
  - Updated descriptions matching the current state

--------------------------------------------------------------------------------
                            DEMO FEATURES
--------------------------------------------------------------------------------

  - 6 SIGNAL CARDS      Fixed set that evolves with state changes
  - 4 SCENARIOS         Different threat types with unique content
  - 4 STATES            Progressive escalation levels
  - LIVE DATE           Timestamp updates to today's date each time you open
  - RESPONSIVE DESIGN   Works on desktop and tablet screens

--------------------------------------------------------------------------------
                           TECHNICAL NOTES
--------------------------------------------------------------------------------

  - No database required - All data is stored in memory
  - No internet required - Runs completely offline
  - Port 3000           - The server runs on http://localhost:3000

--------------------------------------------------------------------------------
                           TROUBLESHOOTING
--------------------------------------------------------------------------------

THE PAGE WON'T LOAD:
  - Make sure the server is running (you should see "Server running on port 
    3000" in the terminal)
  - Check that nothing else is using port 3000

THE ADMIN PANEL DOESN'T WORK:
  - Make sure you're clicking "Apply" after selecting scenario and state
  - Check the browser console for any error messages

CAN'T LOGIN:
  - Use exactly: demo@zerohour.com / demo1234
  - Make sure there are no extra spaces

--------------------------------------------------------------------------------

(c) Villeroy Reserve. ZeroHour is a proprietary intelligence product.

================================================================================
