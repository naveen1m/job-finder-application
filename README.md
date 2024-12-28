# Real-time Job Board Application

The **Real-time Job Board Application** is a modern, web-based platform designed to seamlessly connect job seekers with employers. Built with a robust tech stack, it ensures an intuitive and efficient user experience while addressing real-world hiring challenges.

---

## **Features**
- **Authentication**: Secure login/signup with JWT and bcrypt-encrypted passwords.
- **Job Management**: View job details, filter by location/salary, and track application status.
- **Job Applications**: Job-seekers can apply for jobs, and job posters(Employers) receive email notifications.
- **Job Posting**: Job-posters can create, update, and manage job listings.
- **Notifications**: Stay informed with instant notifications about new job postings and application statuses via GraphQL subscriptions.
- **Email Notifications**: Job-seekers are notified when new jobs are posted.

---

## **Tech Stack**
### **Frontend**
- **React**: Component-based architecture for building reusable UI elements.
- **React Router**: Facilitates dynamic routing for seamless navigation.
- **GraphQL**: Handles efficient data fetching for improved performance.

### **Backend**
- **GraphQL API**: Supports queries, mutations, and subscriptions for real-time data interactions.
- **MongoDB**: Stores job details, user profiles, and application statuses with robust querying for advanced filters.
- **Authentication & Authorization**: Secured using JWT and role-based access control.

---

## **Core Functionalities**
- **For Job Seekers**:
  - Search and filter job listings by location, and salary.
  - Submit job applications and track their status in real-time.
- **For Employers**:
  - Post job openings and manage application data.
  - Receive instant updates about new applications.

---

## **Project Highlights**
- Implements **real-time capabilities** to enhance user engagement.
- Utilizes **modern technologies** like GraphQL and MongoDB for scalability.
- Prioritizes security with JWT-based authentication and role-based authorization.
- Offers a **responsive and user-friendly interface** powered by React.

---

## **Run Locally**
1. Clone the project
  ```bash
  git clone <repo_url>
  ```
2. **job-finder-backend**

```bash
cd job-finder-backend
npm install --legacy-peer-deps
npm run dev
```

3. **job-finder-frontend**
```bash
cd job-finder-frontend
npm install
npm run dev
```

4. Update the backend URL in the frontend and access the application:

    - Copy `backend url` and paste it into the  `main.jsx` in the frontend.
    - Open the application on the browser.