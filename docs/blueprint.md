# **App Name**: CloudGuard AI

## Core Features:

- User Authentication: Secure signup/login with email/password and Google OAuth using Firebase Auth; protected routes.
- SaaS Dashboard: Display risk scores, alerts, and active users in cards, charts, and tables; data is mocked for MVP.
- AI Risk Assessment: Analyze uploaded JSON/CSV log files to detect anomalies using rule-based logic, generate risk level (Low / Medium / High).
- Alerts Management: Store alerts in Firestore and show real-time updates using listeners.
- Subscription Simulation: Implement a mock subscription system with free/pro plans and feature locking based on the plan.
- Settings Configuration: Provide profile settings and notification preferences.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) for a secure, intelligent feel.
- Background color: Very light Lavender (#F5EEF8).
- Accent color: Teal (#008080), for interactive elements
- Body: 'Inter', sans-serif, general purpose font
- Headlines: 'Space Grotesk', sans-serif, for technology feel. If longer text is anticipated, use this for headlines and 'Inter' for body
- Use clear, simple icons from a consistent set, such as Material Design Icons, related to security and data analysis.
- Clean, modern layout with a focus on data visualization. Use cards and tables for information display. Fully responsive design.
- Subtle animations for loading states and transitions to enhance user experience.