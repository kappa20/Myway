# Demo Mode - Myway Student Module Management

## Overview

Demo Mode allows you to explore the Myway application with realistic pre-seeded data without affecting your actual database. This is perfect for:

- Showcasing the application to potential users
- Testing analytics features with realistic data
- Demonstrating app functionality during presentations
- Exploring the interface without creating test data

## How to Enable Demo Mode

Simply add `?demo=true` to any URL:

- **Dashboard**: `http://localhost:3000/?demo=true`
- **Analytics**: `http://localhost:3000/analytics?demo=true`

When demo mode is active, you'll see a **"DEMO MODE"** badge in the header.

## What's Included in Demo Data

### 5 Modules
1. **Advanced Web Development** (Blue)
2. **Machine Learning Fundamentals** (Green)
3. **Database Systems** (Orange)
4. **Software Engineering Principles** (Purple)
5. **Mobile App Development** (Pink)

### 25 Tasks
- 5 tasks per module (at least 3 per module as requested)
- Mix of completed and pending tasks
- Different priority levels (low, medium, high)
- Realistic descriptions and due dates

### 17 Resources
- Mix of URLs, notes, and files
- Real-world examples (course websites, study notes, documentation)
- Varying access counts to demonstrate usage patterns

### 190 Pomodoro Sessions
- **60 sessions** for Web Development (most active)
- **45 sessions** for Machine Learning
- **35 sessions** for Database Systems
- **30 sessions** for Software Engineering
- **20 sessions** for Mobile Development (newer module)

**Session Distribution**:
- Work sessions: ~114 completed
- Short breaks: ~40
- Long breaks: ~14
- Interrupted sessions: ~22
- Total focus time: ~1,654 minutes (~27.5 hours)

**Realistic Patterns**:
- Sessions spread across last 30 days
- Peak activity during afternoon/evening hours (14:00-22:00)
- Varying completion rates per module (70-85%)
- Different productivity patterns by day/hour

## Features in Demo Mode

### What Works
- View all modules, tasks, and resources
- Browse analytics dashboards with real data
- See realistic productivity patterns
- View completed and pending tasks
- Explore pomodoro session history
- Navigate between Dashboard and Analytics

### What's Read-Only
In demo mode, you **cannot**:
- Create new modules, tasks, or resources
- Update existing data
- Delete items
- Toggle task completion
- Modify pomodoro sessions

Any attempt to modify data will show an error: "Cannot [action] in demo mode"

However, you **can still use the Pomodoro timer** - it will function normally but won't save sessions to the demo database.

## Analytics Insights in Demo Mode

The demo data provides realistic analytics showing:

### Overview Dashboard
- 5 modules tracked
- 25 total tasks (11 completed, 14 pending)
- 27.5 hours of total focus time
- Realistic daily/weekly trends

### Module Engagement
- Clear engagement ranking showing most active modules
- Web Development leading with 60 sessions
- Machine Learning and Database Systems with moderate activity
- Mobile Development showing typical "newer project" patterns

### Productivity Patterns
- **Peak hours**: 14:00-20:00 (afternoon to evening)
- **Most productive days**: Mid-week (Tuesday-Thursday)
- **Session completion rate**: ~80% average
- **Average session duration**: ~25 minutes for work sessions

### Task Trends
- Historical task creation and completion over 30 days
- Completion rate trends
- Priority distribution
- Module-specific task analytics

## Switching Between Normal and Demo Mode

- **To enter demo mode**: Add `?demo=true` to the URL
- **To exit demo mode**: Remove `?demo=true` from the URL or navigate without the parameter
- The navigation links automatically preserve demo mode when active

## Technical Implementation

Demo mode works by:
1. Routing API requests to `/api/demo/*` instead of `/api/*`
2. Serving static demo data from `backend/database/demoData.js`
3. Blocking all write operations (POST, PUT, PATCH, DELETE)
4. Maintaining the same API response format as the real database

## Use Cases

### For Presentations
1. Open `http://localhost:3000/?demo=true`
2. Show the populated dashboard with 5 modules
3. Navigate to Analytics to demonstrate insights
4. Highlight productivity patterns and trends

### For Testing Features
1. Use demo mode to test new UI components
2. Verify analytics calculations with known data
3. Check responsive design with realistic content
4. Test filtering and sorting with adequate data volume

### For Onboarding
1. Let new users explore the app without fear of breaking things
2. Show what a "fully set up" workspace looks like
3. Demonstrate best practices for organizing modules and tasks

## Notes

- Demo data includes timestamps spanning several months for realistic trends
- All dates are relative to 2026-01-14 (the "current" date in demo mode)
- Session data includes realistic variance in duration and completion
- Resource access counts reflect realistic usage patterns
- Demo mode does not require authentication or separate database setup

## Questions or Issues?

If you encounter any issues with demo mode or have suggestions for improving the demo data, please open an issue on GitHub.
