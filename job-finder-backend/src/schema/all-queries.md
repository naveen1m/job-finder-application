
---

### **User Operations**

#### **1. Get User by ID**

```graphql
query {
  getUserById(id: "676273abda707cce50d7a3aa") {
    id
    username
    email
    role
  }
}
```

#### **2. Get All Users**

```graphql
query {
  getUsers {
    id
    username
    email
    role
  }
}
```

#### **3. Create User (Sign Up)**

```graphql
mutation {
  signUp(
    signUpInput: {
      username: "John Doe"
      email: "john.doe111@example.com"
      password: "securePassword123"
      role: "seeker"
    }
  ) {
    id
    username
    email
    token
  }
}
```

Using Variables:

```json
{
  "signUpInput": {
    "username": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "role": "user"
  }
}
```

#### **4a. Log In (Seeker)**

```graphql
mutation {
  login(email: "john.doe111@example.com", password: "securePassword123") {
    id
    username
    email
    token
  }
}
```

#### **4b. Log In (Poster)**

```graphql
mutation {
  login(email: "john.employee@example.com", password: "securePassword123") {
    id
    username
    email
    token
  }
}
```

#### **5. Update User Profile**

```graphql
mutation {
  updateUserProfile(
    id: "6762e9f3e40131d1bc554b10", 
    username: "user1", 
    email: "email1@m.com"
  ) {
    id
    username
    email
  }
}
```

### **6. Get Job Applicants**

```graphql
query {
  getJobApplicants(jobId: "jobId12345") {
    id
    status
    userId
  }
}
```

---

### **7. Check If User Applied for Job**

```graphql
query {
  hasUserAppliedForJob(jobId: "jobId12345")
}
```

---

### **Job Operations**

#### **1. Get All Jobs**

```graphql
query {
  getJobs(location: "New York", salaryRange: "50000-80000") {
    id
    title
    company
    description
    salary
    location
  }
}
```

#### **2. Get Job by ID**

```graphql
query {
  getJobById(id: "jobId12345") {
    id
    title
    company
    description
    salary
    location
  }
}
```

#### **3. Post Job**

```graphql
mutation {
  postJob(
    title: "Software Engineer",
    company: "Apple",
    description: "Develop and maintain software solutions",
    salary: 70000,
    location: "New York"
  ) {
    id
    title
    company
    description
    salary
    location
  }
}
```

#### **4. Apply for Job**

```graphql
mutation {
  applyForJob(jobId: "jobId12345") {
    id
    userId
    status
  }
}
```

#### **5. Update Application Status**

```graphql
mutation {
  updateApplicationStatus(applicationId: "12345", status: "Hired") {
    id
    jobId
    userId
    status
  }
}
```

---

### **Seeker-Specific Operations**

#### **1. Get Jobs Applied by Seeker**

```graphql
query {
  getJobsAppliedBySeeker {
    id
    jobId
    userId
    status
  }
}
```

---

### **Poster-Specific Operations**

#### **1. Get Jobs Posted by Poster**

```graphql
query {
  getJobsPostedByPoster {
    id
    title
    company
    location
    salary
    description
  }
}
```

---

This structure organizes queries and mutations based on their functionality and user roles (general, seeker, poster), making it easy to understand and navigate.
