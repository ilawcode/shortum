# Social Engine & Real-Time Messaging

## 1. Fork Request Workflow
1. User clicks "Request Fork".
2. System creates `ForkRequest` (Status: PENDING).
3. Owner receives:
   - Real-time Toast (if online).
   - In-app notification badge.
   - Email alert.
4. If "Approved": Original JSON is copied to Requester's library with "Original Author" metadata.

## 2. Voting & Metrics
- 1 User = 1 Vote (Unique Constraint on DB).
- Public Dashboard displays "Trending" based on (Votes * 0.7 + Downloads * 0.3).