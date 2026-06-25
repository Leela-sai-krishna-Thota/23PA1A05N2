# Notification System Design

# Stage 1


GET /notifications

Headers:
Authorization: Bearer <token>

Response:
{
  "notifications": [
    {
      "id": "1",
      "type": "placement",
      "message": "Google hiring",
      "timestamp": "2026-04-22T17:51:18Z",
      "isRead": false
    }
  ]
}

---

PATCH /notifications/:id/read

Response:
{
  "message": "Notification marked as read"
}

---

DELETE /notifications/:id

Response:
{
  "message": "Notification deleted"
}

---

GET /notifications?type=Placement

---

Use WebSockets (Socket.IO).

Flow:
1. Backend pushes notifications instantly
2. Frontend listens to socket event
3. UI updates automatically
