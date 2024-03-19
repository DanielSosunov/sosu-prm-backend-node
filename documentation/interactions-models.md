### Interactions Documentation

```
Document ID: contact-id
javascript
{
  "userId": "user-id",
  "name": "Contact Name",
  "email": "contact@email.com",
  "phone": "1234567890",
  "createdAt": "timestamp"
}

contacts/contact-id/interactions subcollection:
Document ID: interaction-id
javascript
{
  "contactId": "contact-id",
  "userId": "user-id",
  "type": {
    "channel": "phone",
    "direction": "incoming"
  },
  "timestamp": "2023-06-01T10:30:00Z",
  "duration": 15,
  "notes": "Discussed project updates",
  "initiatedBy": "contact",
  "waitTime": 120,
  "previousInteractionTimestamp": "2023-05-31T09:45:00Z",
  "sentiment": "positive",
  "purpose": "business"
}

The type field in the interactions document is now an object with two properties:
channel: Represents the communication channel of the interaction. Possible values include "phone", "inPerson", "email", "message", etc.
direction: Indicates the direction of the interaction. Possible values include "incoming" (initiated by the contact) or "outgoing" (initiated by you).
Additional fields like sentiment and purpose are added to each interaction document to provide more details about the interaction.
```

```
contacts/contact-id/monthlyInteractions subcollection:
Document ID: YYYY-MM (e.g., "2023-01")
javascript
{
  "totalInteractions": 10,
  "initiatedByMe": 4,
  "initiatedByContact": 6,
  "interactionTypes": {
    "phone": 5,
    "inPerson": 3,
    "messages": 2
  },
  "interactionSentiments": {
    "positive": 6,
    "neutral": 3,
    "negative": 1
  },
  "interactionPurposes": {
    "personal": 7,
    "business": 3
  },
  "resolvedIssues": 2,
  "pendingFollowUps": 1,
  "averageResponseTime": 2.5,
  "longestInteractionDuration": 120,
  "shortestInteractionDuration": 5
}
```

```
contactInteractions/contact-id document:
Document ID: contact-id
javascript
{
  "userId": "user-id",
  "totalInteractions": 500,
  "initiatedByMe": 300,
  "initiatedByContact": 200,
  "interactionTypes": {
    "phone": 200,
    "inPerson": 150,
    "messages": 150
  },
  "interactionSentiments": {
    "positive": 350,
    "neutral": 100,
    "negative": 50
  },
  "interactionPurposes": {
    "personal": 400,
    "business": 100
  },
  "resolvedIssues": 100,
  "pendingFollowUps": 50,
  "averageResponseTime": 3.5,
  "longestInteractionDuration": 180,
  "shortestInteractionDuration": 2
}
```

```
userTotalInteractions collection:
Document ID: user-id
javascript
{
  "totalInteractions": 5000,
  "initiatedByMe": 3000,
  "initiatedByContacts": 2000,
  "interactionTypes": {
    "phone": 2000,
    "inPerson": 1500,
    "messages": 1500
  },
  "interactionSentiments": {
    "positive": 3500,
    "neutral": 1000,
    "negative": 500
  },
  "interactionPurposes": {
    "personal": 4000,
    "business": 1000
  },
  "resolvedIssues": 1000,
  "pendingFollowUps": 500,
  "averageResponseTime": 4,
  "longestInteractionDuration": 240,
  "shortestInteractionDuration": 1
}
```

These JSON structures provide a more detailed representation of the interactions and their associated properties. The type field in the interactions document allows for capturing both the communication channel and the direction of the interaction. The additional fields like sentiment and purpose provide more context about each interaction.
Remember to update the corresponding aggregation logic in the monthlyInteractions and totalInteractions documents to reflect these changes and ensure accurate statistics are maintained.
