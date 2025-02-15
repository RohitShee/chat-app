# **Chat App**
🚀 **Live Demo:** [Talkify](https://talkify-mvqw.onrender.com/)  
A real-time chat application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) with **WebSockets** for instant messaging.

## **Features**

✅ **User Authentication** (Sign-up, Login, JWT-based authentication)  
✅ **Real-time Messaging** using **Socket.io**  
✅ **Group Chat Functionality** (Create and manage group chats)  
✅ **Broadcast Messaging** (Send messages to all users)  
✅ **Media Uploads** (Send images in chat via Cloudinary)  
✅ **User Profile & Settings**  
✅ **Online/Offline Status**  
✅ **Block/Unblock Users**  
✅ **Responsive UI with Tailwind CSS**  

---

## **Tech Stack**

### **Frontend**
- **React** (with Vite)
- **Tailwind CSS** for styling
- **Daisy UI** for themes and styling
- **React Router** for navigation
- **Zustand** for state management
- **Socket.io Client** for real-time messaging

### **Backend**
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Database)
- **Socket.io** (WebSockets)
- **Cloudinary** (Media uploads)
- **JWT Authentication** (Secure user sessions)
- **CORS & Cookie-Parser** for security

### **Deployment**
- **Frontend**:Render
- **Backend**: Render 
- **Database**: MongoDB Atlas  

---

## **Setup & Installation**

### **1. Clone the repository**
```bash
git clone https://github.com/RohitShee/chat-app.git
cd chat-app
```
### **2. Install dependencies**
```bash
npm install --prefix backend
npm install --prefix frontend
```
### **3. Configure Environment Variables**
Create a .env file inside the backend/ folder and add:
```bash
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
###**4. Start the Application**
```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```
By default, the frontend runs on http://localhost:5173 and the backend on http://localhost:8000.
