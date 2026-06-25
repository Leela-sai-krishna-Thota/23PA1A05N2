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



# Stage 2


For storing notifications reliably, I would use **PostgreSQL** because:

* It provides ACID properties for data consistency.
* It handles structured notification data efficiently.
* Supports indexing for fast retrieval.
* Scales well for large datasets.

---

## Database Schema


| Column Name | Data Type        | Description                                  |
| ----------- | ---------------- | -------------------------------------------- |
| id          | UUID PRIMARY KEY | Unique notification ID                       |
| student_id  | UUID             | Unique student ID                            |
| type        | VARCHAR(20)      | Notification type (Event, Result, Placement) |
| message     | TEXT             | Notification content                         |
| timestamp   | TIMESTAMP        | Notification created time                    |
| isRead      | BOOLEAN          | Read/Unread status                           |



To improve query performance:

CREATE INDEX idx_notifications_student_read_time
ON notifications(student_id, isRead, timestamp DESC);
```

This helps:

* Faster unread notification retrieval.
* Faster sorting by latest notifications.
* Efficient filtering.

---


As notification volume increases:

1. Query performance may slow down.
2. Sorting large records becomes expensive.
3. High write traffic increases load.

---

## Solutions

* Composite indexing
* Pagination using LIMIT/OFFSET
* Redis caching
* Archiving old notifications





INSERT INTO notifications
(id, student_id, type, message, timestamp, isRead)
VALUES
(uuid_generate_v4(), '1042', 'Placement', 'Google Hiring', NOW(), false);
```


SELECT * FROM notifications
WHERE student_id='1042'
AND isRead=false
ORDER BY timestamp DESC;



UPDATE notifications
SET isRead=true
WHERE id='notification_id';


