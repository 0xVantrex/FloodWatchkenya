1. User Registration & Location Setup

Users register via USSD, SMS, or mobile app.

They provide neighborhood / street / river zone.

Optional: Select alert language (English / Kiswahili).

2. Real-time Flood Alerts

Alerts sent via SMS / USSD / mobile app push notifications.

Triggered by:

Local sensor readings (where installed)

Weather API predictions (rainfall/flood risk forecasts)

Community reports (crowdsourced verification)

Alerts include:

Location

Severity (Low, Medium, High)

Recommended actions (e.g., “Move to higher ground”)

3. Community Reporting / Feedback

Users can report water rise or flooding via:

USSD codes

App form

Reports help verify alerts and improve future predictions.

4. Flood History & Dashboard

For users with the app, display:

Past flood events in their area

Severity and duration

Could also show statistics like number of alerts sent, verified reports, or areas most affected.

5. Admin / Authority Panel

Optional for MVP but powerful:

View live reports & alerts

Manage sensor thresholds

Send manual alerts if needed

Can be simplified to a single dashboard page.

6. Alert Escalation

If an alert isn’t acknowledged by residents:

Escalate to local authorities

Optional: integrate with local emergency services / county disaster management

7. USSD Menu Examples

*123# → FloodWatch Kenya menu:

Register / Update location

Check current flood status

Report flooding

Info / safety tips

Key Design Notes

Keep the backend in Django, simple REST API.

Store users, locations, reports, and alert logs.

Make USSD + SMS integration work with one provider (like Africa’s Talking).

Focus on hyper-local alerts + accessibility rather than fancy visuals.