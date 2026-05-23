# Real Time Chat App

Full-stack real-time messaging platform built with Socket.IO, Next.js, Express, MongoDB, Redis, and Firebase.

## Tech Stack

**Frontend:** Next.js, React, Tailwind CSS, Zustand, Socket.IO Client  
**Backend:** Node.js, Express.js, Socket.IO  
**Databases:** MongoDB (messages + channels), Redis (presence/session cache)  
**Auth:** JWT (custom) + Firebase Authentication ready  
**Notifications:** Firebase Cloud Messaging (FCM) ready  
**Infrastructure:** Docker, Docker Compose, Cloudflare Tunnel ready

## Features

- Real-time messaging via Socket.IO WebSockets
- Typing indicators (per channel, per user)
- Online presence (join/disconnect events broadcast to all clients)
- Channel-based messaging (general, design, engineering, random)
- Media/file sharing (image upload + file attach)
- Unread message badge counts
- JWT authentication with persistent sessions
- Message history from MongoDB (paginated)
- Redis for online user presence cache
- Collapsible sidebar

## Project Structure

```
real-time-chat-app/
  client/        
    src/
      app/      
      components/  
      hooks/     
      lib/       
      store/   
      styles/    
  server/        
    src/
      controllers/
      lib/         
      middleware/
      models/      
      routes/      
      socket/    
  docker-compose.yml
```