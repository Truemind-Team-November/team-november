# TalentFlow API Integration Handoff

Backend integration guide for the implemented TalentFlow learner and admin experience. This document is intended for the frontend team and covers the active API surface for auth, role management, dashboard, profile, notifications, courses, lessons, assignments, progress, discussion, teams, and certificates.

- Project: `TalentFlow`
- Scope: `Backend API Integration`
- Date: `2026-03-31`
- Auth: `Bearer JWT` for protected routes

## Response Shape

Protected and public API endpoints return the standard response envelope below:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

## Auth

### `POST /api/auth/register`

Registers a learner account.

Request fields:
- `firstName`
- `lastName`
- `email`
- `discipline`
- `password`
- `confirmPassword`

Notes:
- Role is not accepted from the UI.
- The backend always assigns `Learner`.

### `POST /api/auth/login`

Authenticates the user and returns the JWT plus identity data.

### `POST /api/auth/forgot-password`

Sends the password reset email using the configured frontend URL.

### `POST /api/auth/reset-password`

Resets the password using the reset token from the email link.

## Role Management and RBAC

### Registration RBAC Rule

- All self-registered users are created as `Learner`
- The UI must not send admin or instructor role selection
- Admin and instructor elevation happens after registration through protected role-management flows

### `POST /api/role/request-instructor`

Authenticated user endpoint for submitting an instructor role request.

Request fields:
- `bio`
- `expertise`

Stored request state:
- `Pending`
- `Approved`
- `Rejected`

### `GET /api/admin/role-requests`

Admin-only endpoint to view all instructor role requests.

Optional query param:
- `status`

### `PATCH /api/admin/approve-role/{roleRequestId}`

Admin-only endpoint to approve an instructor role request.

Effects:
- request status becomes `Approved`
- user role becomes `Instructor`
- user receives an in-app notification to sign in again and refresh access

### `PATCH /api/admin/reject-role`

Admin-only endpoint to reject an instructor role request.

Request fields:
- `roleRequestId`
- `rejectionReason`

### `PATCH /api/admin/assign-role`

Admin-only endpoint for manual role assignment.

Request fields:
- `userId`
- `role`

Supported roles:
- `Learner`
- `Instructor`
- `Admin`

## Dashboard

### `GET /api/dashboard/me`

Returns the learner dashboard payload:
- greeting and full name
- metric cards
- continue learning
- upcoming deadlines
- recent activity
- team preview
- identity card with public ID, discipline, cohort, location, role, and team

### `GET /api/dashboard/admin`

Admin-only dashboard endpoint.

Returns:
- total users
- total learners
- total instructors
- total admins
- pending instructor role requests
- total teams
- total courses
- total assignments
- total submissions
- total certificates
- total discussion posts
- recent platform activity

## Profile

### `GET /api/profile/me`

Returns profile header, badges, personal information, learning summary, and achievements.

### `PUT /api/profile/me`

Updates:
- `firstName`
- `lastName`
- `phoneNumber`

## Notifications

### `GET /api/notification`

Returns the current user's in-app notifications.

### `GET /api/notification/unread-count`

Returns unread notification count for the badge UI.

### `PUT /api/notification/{notificationId}/read`

Marks one notification as read.

### `PUT /api/notification/read-all`

Marks all notifications as read.

## Teams

### `GET /api/team`

Returns all teams with member previews.

### `GET /api/team/my-team`

Returns the authenticated learner's assigned team.

## Course Catalog and Detail

### `GET /api/course`

Course catalog endpoint.

Query params:
- `search`
- `category`
- `enrolledOnly`

### `GET /api/course/{id}`

Returns course detail with metadata, progress, includes, modules, and resume lesson information.

### `POST /api/course`

Admin/instructor endpoint for creating a course.

### `PUT /api/course/{id}`

Admin/instructor endpoint for updating a course.

## Lesson Player

### `GET /api/lesson/course/{courseId}`

Returns lesson summaries for a course.

### `GET /api/lesson/{lessonId}`

Returns lesson-player content, sidebar lessons, note, navigation ids, and progress.

### `POST /api/lesson/{lessonId}/complete`

Marks the lesson complete and updates course progress.

### `PUT /api/lesson/{lessonId}/note`

Saves or updates the user's quick note for the lesson.

### `POST /api/lesson`

Instructor endpoint for creating a lesson.

### `POST /api/lesson/content`

Instructor endpoint for adding lesson content.

## Assignments and Submissions

### `GET /api/assignment/my`

Learner assignment list for the UI tabs.

Query param:
- `status` with values such as `Pending`, `Submitted`, or `Graded`

### `GET /api/assignment/course/{courseId}`

Returns assignments for a specific course.

### `GET /api/assignment`

Paginated assignment endpoint.

### `POST /api/assignment`

Admin/instructor endpoint for creating an assignment.

### `POST /api/submission`

Learner endpoint for submitting an assignment.

### `PUT /api/submission/{submissionId}/grade`

Instructor/admin endpoint for grading a submission and attaching feedback.

## Progress

### `GET /api/progress/me`

Returns the learner progress screen payload:
- per-course progress cards
- overall progress percentage
- skill breakdown
- graded work history

## Discussion Forum

### `GET /api/discussion`

Returns discussion post summaries.

Query params:
- `tag`
- `search`

### `GET /api/discussion/{postId}`

Returns the thread detail with the post and replies.

### `POST /api/discussion`

Creates a discussion post with tags.

### `POST /api/discussion/{postId}/reply`

Adds a reply to an existing discussion thread.

### `GET /api/discussion/top-contributors?count=5`

Returns the top contributor list for the sidebar panel.

Note:
- The discussion forum is a public threaded forum, not private messaging.
- When someone replies to a user's post, the backend creates an in-app notification.

## Certificates

### `GET /api/certificate/me`

Returns the learner's certificates with:
- course title
- public ID
- discipline
- cohort label
- final score
- certificate number
- issued date

### `POST /api/certificate/{courseId}`

Issues a certificate when the learner meets the grading threshold and all course assignments are graded.

## Frontend Notes

- All protected endpoints require `Authorization: Bearer <token>`.
- The UI should remove role selection from registration.
- The registration form must send `confirmPassword`.
- Notification updates are in-app only right now; there is no socket-based live push.
- The backend supports learner-facing screens plus some instructor/admin create flows not yet exposed in the current UI.
- Role changes affect newly issued JWTs immediately, but an already-issued token will still carry the old role claim until the user signs in again or refreshes the token.
- Admin dashboard data is separate from the learner dashboard payload and should be consumed from `GET /api/dashboard/admin`.
