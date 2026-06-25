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


## Stage 3

**Yes, the query is functionally accurate.** It correctly uses the `WHERE` clause to filter by a specific student (`studentID = 1042`) and isolates unread messages (`isRead = false`), while sorting them chronologically from oldest to newest (`ORDER BY createdAt ASC`). 


The query is slow because the database has scaled to **5,000,000 notifications**. 

Without an explicit index on these columns, the database engine is forced to perform a **Full Table Scan**. This means it must scan through all 5 million rows one by one to find the matching records for that specific student, causing severe disk I/O and CPU overhead.

---


Instead of a full table scan, we should implement a **Composite Index** (a multi-column index) that covers the filtering and sorting columns:

```sql
CREATE INDEX idx_notifications_student_unread_date 
ON notifications (studentID, isRead, createdAt);




### Stage 4

### 1. The Core Problem
Fetching data directly from the primary relational database on every single page load for every student creates an intense, repetitive read bottleneck. As concurrent traffic grows, the database experiences high CPU usage, connection pool exhaustion, and severe disk I/O bottlenecks, resulting in slow response times and a degraded user experience.

---

### 2. Suggested Solutions & Strategies

To scale this system and alleviate database pressure, we can implement three primary strategies: **Caching**, **Connection Polling/Read Replicas**, and **Event-Driven Push Architecture**.

| Strategy | How it Improves Performance | Key Tradeoffs |
| :--- | :--- | :--- |
| **Strategy 1: In-Memory Caching (Redis / Memcached)** | Stores the unread notification count or list in memory. Instead of hitting the DB on every page load, the API reads from Redis in sub-milliseconds. The cache is updated only when a new notification arrives or when a user marks a notification as read. | * **Pros:** Extremely fast reads, instantly drops DB load by 80-90%.<br>* **Cons:** Adds architectural complexity. Risks data stale-ness if cache invalidation logic fails. |
| **Strategy 2: Database Read Replicas** | Separates database traffic. All write operations (`INSERT`, `UPDATE`) go to a Primary DB node, while all page-load read queries are distributed across one or more Read Replicas. | * **Pros:** Highly effective for read-heavy applications; requires minimal changes to application logic.<br>* **Cons:** Replication lag (a student might see a slight delay of a few milliseconds/seconds before a new notification shows up on a replica). |
| **Strategy 3: WebSockets / Server-Sent Events (SSE)** | Instead of the client constantly polling or requesting data on page load, establish a persistent connection. The server pushes new notifications to the client browser in real time *only* when they happen. | * **Pros:** Eliminates redundant page-load database hits for unchanged data; provides an instant, real-time user experience.<br>* **Cons:** Maintaining thousands of concurrent open connections requires specialized server memory configurations (e.g., using a reverse proxy or gateway). |

---

### 3. Recommended Architectural Choice

The ideal production architecture should combine **Strategy 1 (Caching)** and **Strategy 3 (WebSockets/SSE)**:

1. **On Page Load:** The client requests the unread notification batch. The application layer looks at **Redis**. If it's a cache hit, it returns immediately. If it's a miss, it fetches from the DB once and populates Redis.
2. **Real-Time Delivery:** When a background process generates a notification, it pushes it directly to the active user session via **WebSockets/SSE** and concurrently updates the database/cache asynchronously. This removes the need for brute-force database fetching altogether.



