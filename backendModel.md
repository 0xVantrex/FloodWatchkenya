✅ 1. Finish the Backend MVP (Start Here)

This is what you implement first:

A. Users App (Basic Auth)

Register

Login

User profile (location, phone number)

Token-based auth (SimpleJWT)

B. Reports App

User submits a flood report (location, description, severity)

Store GPS coordinates

Store timestamp

Endpoint to fetch reports by county / region

C. Alerts App

Admin creates an alert (county-level warning)

Endpoint returns active alerts

Later: Automatic alerts from API (rainfall)

D. USSD Integration

(optional but included):

Expose endpoint that Africa’sTalking or Safaricom USSD will hit

Return simple text responses like:

Report Flood

Get Alerts

Check Safety Tips

E. Flood Severity Algorithm (simple rule engine)

For MVP, use rule-based model:

If:

Rainfall > X

River level rising

Multiple user reports in same area

Then trigger alert.

This is what makes your project different from KE-MET or RedCross — community-based crowdsourced real-time risk scoring.