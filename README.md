<div align="center">
  
  <img src="https://img.shields.io/badge/FlowCRM-v1.0.0-667eea?style=for-the-badge&logo=react&logoColor=white" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
  
  <br />
  <br />
  
  <h1>🚀 FlowCRM</h1>
  <h3>Real-Time CRM with Pipeline & Workflow Automation</h3>
  
  <p>
    <strong>Enterprise-grade Customer Relationship Management system</strong><br />
    with drag-and-drop pipeline, visual automation builder, and real-time collaboration
  </p>
  
  <br />
  
  [✨ Live Demo](https://flowcrm-demo.yourdomain.com) •
  [📚 Documentation](https://docs.flowcrm.com) •
  [🐛 Report Bug](https://github.com/yourusername/flowcrm/issues) •
  [💡 Request Feature](https://github.com/yourusername/flowcrm/issues)
  
  <br />
  <br />
  
  ![FlowCRM Dashboard Demo](https://via.placeholder.com/800x400.png?text=FlowCRM+Dashboard+Demo)
  
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Why FlowCRM?](#-why-flowcrm)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [📱 Usage](#-usage)
- [🔧 Configuration](#-configuration)
- [📊 Database Schema](#-database-schema)
- [🔌 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [📈 Performance](#-performance)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🎯 Core CRM Features
- **Contact & Company Management** - Full CRM with custom fields, tags, and activity timelines
- **Deal Pipeline (Kanban)** - Drag-and-drop deals with custom stages and pipeline analytics
- **Task Management** - Create, assign, and track tasks linked to contacts, deals, or companies
- **Activity Timeline** - Track all interactions (calls, emails, meetings, notes) per contact

### 🤖 Automation & Workflows
- **Visual Automation Builder** - Create if/then automation rules with drag-and-drop interface
- **Email Sequences** - Build multi-step drip campaigns with open/click tracking
- **Trigger Types** - Deal stage changes, contact creation, date-based, form submissions
- **Actions** - Send emails/SMS, create tasks, add tags, call webhooks
- **Delay Support** - "Wait 2 days then send email" functionality

### 🔔 Real-Time Features
- **WebSocket Notifications** - Instant updates when deals change or tasks are assigned
- **Live Collaboration** - See team members' actions in real-time
- **Notification Center** - In-app notifications with unread counts and mark-as-read

### 👥 Team Collaboration
- **Multi-Tenant Workspaces** - Each company gets its own isolated workspace
- **Role-Based Access** - Owner, Admin, Sales Rep, Viewer roles with granular permissions
- **Team Invites** - Invite team members by email with role assignment

### 📊 Analytics & Reporting
- **Sales Leaderboard** - Track deals closed and revenue per sales rep
- **Pipeline Analytics** - Pipeline value, win rates, average time in stage
- **Activity Reports** - Track calls, emails, meetings per representative
- **CSV Export** - Export reports and contact lists

### 🔐 Authentication & Security
- **Email/Password Login** - Secure authentication with bcrypt hashing
- **Google OAuth2** - One-click login with Google
- **JWT with Refresh Tokens** - Secure, stateless authentication with httpOnly cookies
- **Rate Limiting** - Protection against brute force attacks

---

## 🎯 Why FlowCRM?

FlowCRM stands out from traditional CRMs with its **enterprise-grade features** while maintaining **developer-friendly architecture**:

| Feature | FlowCRM | Traditional CRM |
|---------|---------|-----------------|
| Real-time updates | ✅ WebSocket | ❌ Polling |
| Visual automation | ✅ Drag & drop | ❌ Code-only |
| Open source | ✅ MIT License | ❌ Proprietary |
| Self-hosted | ✅ Docker | ❌ Cloud-only |
| API-first | ✅ REST + WebSocket | ❌ Limited |
| Customizable | ✅ Full source | ❌ Black box |
| Modern stack | ✅ React + NestJS | ❌ Legacy |

---

## 🏗️ Architecture

FlowCRM uses a **microservices architecture** for scalability and maintainability:
