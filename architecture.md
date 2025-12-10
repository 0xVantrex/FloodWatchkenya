FloodWatch Kenya – MVP System Architecture

The MVP must be lightweight, fast to build, and functional enough to demonstrate the core idea. That means 3 main layers: Data Sources → Backend Engine → User Interfaces.

1. Data Sources Layer (Inputs)

For MVP, keep it simple:

A. Weather API (Primary Source)

Use a free or cheap API (OpenWeather, WeatherAPI, Tomorrow.io)

Pull: rainfall levels, storm forecasts, severe weather alerts

Update frequency: every 15–30 minutes

B. Community Reports (Crowdsourced Source)

Users report:

Water levels (None, Rising, Overflowing)

Blocked drainage

River overflow signs

Flooded roads

Comes from Web App + USSD (simple forms)

C. Optional Future Upgrade (Not needed for MVP, mention only)

Low-cost IoT river sensors

County agencies data feeds

2. Backend Layer (Core Engine)
A. API Server (Node.js / Express)

Handles all logic + communication.

B. Database (MongoDB)

Stores:

User profiles

User locations

Community reports

Risk level logs

Alert history

C. Risk Analysis Engine (Simple MVP Logic)

No ML needed. Use a rule-based logic engine:

If rainfall > threshold → risk “Moderate”

If rainfall + rising community reports → risk “High”

If multiple reports of flooding → risk “Critical”

Automatically trigger an alert

This is enough to pass an MVP demonstration.

D. Alert Engine (Notifications)

SMS alerts (via Africa’s Talking / Twilio)

Email alerts

USSD returns “Current status: Moderate/High/Critical”

3. User Interfaces Layer
A. Web Application (React)

For users:

Register & set location

View live risk level

Submit community reports

View updates from authorities

For admin:

Dashboard with:

Live reports map

Weather-based risk predictions

Approve/validate community reports

Issue warnings

View historical flood patterns

B. USSD Interface

Using Africa’s Talking:

Dial: *XYZ#

Options:
1. Check Flood Risk
2. Report Flooding
3. Safety Tips

C. SMS Alerts

Triggered by backend when risk rises above “High.”

How Everything Connects (Flow)

Weather API sends data → Backend

Users send reports (web/USSD) → Backend

Risk Engine analyses & updates threat level

Alerts Engine sends SMS/USSD/web updates

Admin views all activity in dashboard

This MVP Lets You Demonstrate:

Real-time risk monitoring

Community participation

Multi-channel alerts (web + USSD + SMS)

Admin oversight

Scalable architecture