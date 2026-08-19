export const initialData = {
  photoUrl: null,
  orbitOuter: [
    { id: "oo-1", name: "Java", short: "Java" },
    { id: "oo-2", name: "Spring Boot", short: "Boot" },
    { id: "oo-3", name: "React", short: "React" },
    { id: "oo-4", name: "MySQL", short: "SQL" },
    { id: "oo-5", name: "JWT", short: "JWT" },
    { id: "oo-6", name: "Git", short: "Git" },
  ],
  orbitInner: [
    { id: "oi-1", name: "REST API", short: "REST" },
    { id: "oi-2", name: "Spring Data JPA", short: "JPA" },
    { id: "oi-3", name: "Tailwind CSS", short: "TW" },
  ],
  profile: {
    name: "Manoj Lodhi",
    role: "Java Full Stack Developer",
    monogram: "ML", // Custom Monogram Avatar Initials
    tagline: "I build secure Spring Boot APIs and clean React interfaces.",
    summary:
      "Java Full Stack Developer at Dollop Infotech, currently building the Coding Arena module of the Smart Education Platform. B.Tech in Electrical & Electronics Engineering, retrained into full stack development at Placement Adda, Indore.",
    location: "Indore, Madhya Pradesh, India",
    email: "manojlodhi0262@gmail.com",
    phone: "+91 7223938787",
    linkedin: "https://www.linkedin.com/in/manoj-lodhi",
    github: "https://github.com/manojkumarlodhi",
    resumeUrl: "#", // Add resume URL (Google Drive/PDF link or file)
  },
  stats: [
    { id: "stat-1", label: "Projects built", value: "6+" },
    { id: "stat-2", label: "Core stack", value: "Java + React" },
    { id: "stat-3", label: "Currently at", value: "Dollop Infotech" },
  ],
  skillGroups: [
    {
      id: "sg-1",
      title: "Backend",
      items: ["Java", "Spring Boot", "Spring MVC", "REST APIs", "JPA / Hibernate"],
    },
    {
      id: "sg-2",
      title: "Frontend",
      items: ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
    },
    {
      id: "sg-3",
      title: "Database & Security",
      items: ["MySQL", "Spring Security", "JWT", "BCrypt", "Role Based Access"],
    },
    {
      id: "sg-4",
      title: "Tools & IDEs",
      items: ["Git", "GitHub", "Postman", "Eclipse", "Maven", "Vite"],
    },
  ],
  experience: [
    {
      id: "exp-1",
      type: "Employment",
      company: "Dollop Infotech Pvt. Ltd.",
      role: "Java Full Stack Developer",
      period: "Present",
      context: "Smart Education Platform → Coding Arena",
      points: [
        "Working on the Coding Arena module: categorized problem listings with difficulty, topic and status filters.",
        "Interactive online code editor with Compile, Run and Submit actions.",
        "Automated test case verification and formatted execution results.",
      ],
      tech: ["Java", "Spring Boot", "REST APIs", "MySQL", "React"],
    },
    {
      id: "exp-2",
      type: "Training",
      company: "Placement Adda, Indore",
      role: "Java Full Stack Developer Training",
      period: "Completed · Certified",
      context: "Intensive full stack program",
      points: [
        "Core Java, OOPs, Collections, Exception Handling and Multithreading.",
        "Spring Boot, Spring MVC, Spring Security and RESTful API design.",
        "JWT authentication and hands-on project delivery.",
      ],
      tech: ["Core Java", "Spring MVC", "Spring Security", "JWT"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Coding Arena — Smart Education Platform",
      category: "Full Stack",
      summary:
        "Professional module at Dollop Infotech: a coding practice arena with problem listings, an online editor and automated evaluation.",
      features: [
        "Filterable problem sets by difficulty, topic and status",
        "Compile, Run and Submit workflow",
        "Automated test case verification and result formatting",
      ],
      tech: ["Java", "Spring Boot", "REST API", "React"],
      featured: true,
      repo: "private",
      demo: "none",
    },
    {
      id: "proj-2",
      title: "Personal Expense Tracker System",
      category: "Full Stack",
      summary:
        "Secure REST backend for tracking income, expenses, budgets and savings goals with role based access.",
      features: [
        "JWT authentication with ROLE_USER and ROLE_ADMIN",
        "Categories, monthly budgets and savings goals",
        "Financial reporting and analytics endpoints",
      ],
      tech: ["Java", "Spring Boot", "Spring Security", "JWT", "MySQL"],
      featured: true,
      repo: "private",
      demo: "none",
    },
    {
      id: "proj-3",
      title: "P-School LMS",
      category: "React Apps",
      summary:
        "Multi-role learning management dashboard with analytics for Super Admin, Institution, Instructor and Student roles.",
      features: [
        "Role based access selector",
        "Recharts analytics dashboards",
        "Course enrollment and assignment management",
      ],
      tech: ["React.js", "Vite", "React Router", "Recharts", "CSS3"],
      featured: true,
      repo: "private",
      demo: "none",
    },
    {
      id: "proj-4",
      title: "Online Complaint Registration System",
      category: "Java Backend",
      summary:
        "Backend REST API for logging, categorizing and tracking complaints through their full lifecycle.",
      features: [
        "Authenticated complaint logging",
        "Categories: Technical, Service, Billing",
        "Status tracking: Pending → In Progress → Resolved",
      ],
      tech: ["Java", "Spring Boot", "Spring Data JPA", "MySQL"],
      featured: false,
      repo: "private",
      demo: "none",
    },
    {
      id: "proj-5",
      title: "Job Portal",
      category: "Java Backend",
      summary:
        "Servlet and JSP web application connecting employers posting jobs with candidates applying to them.",
      features: [
        "Employer job posting and application management",
        "Candidate profile and resume submission",
        "Search by title, location and skills",
      ],
      tech: ["Java", "Servlets", "JSP", "MySQL"],
      featured: false,
      repo: "private",
      demo: "none",
    },
    {
      id: "proj-6",
      title: "PhoneBook Directory",
      category: "Java Backend",
      summary:
        "Core Java contact manager with fast search and strict validation of phone numbers and emails.",
      features: [
        "Add, search, edit and delete contacts",
        "Phone and email format validation",
        "Clean console driven workflow",
      ],
      tech: ["Java", "Eclipse"],
      featured: false,
      repo: "private",
      demo: "none",
    },
  ],
  education: [
    {
      id: "edu-1",
      title: "B.Tech — Electrical & Electronics Engineering",
      org: "SAM College of Engineering & Technology, Bhopal",
      meta: "CGPA 6.8",
      note: "Engineering fundamentals, problem solving and systems thinking that carried over into software.",
    },
    {
      id: "edu-2",
      title: "Java Full Stack Developer Certification",
      org: "Placement Adda, Indore",
      meta: "Certified",
      note: "Intensive training in Core Java, Spring Boot, Spring Security, REST APIs and JWT authentication.",
    },
  ],
  messages: [
    {
      id: "msg-1",
      name: "Rahul Sharma",
      email: "rahul.techlead@example.com",
      message: "Hi Manoj, loved your Coding Arena work! Are you available for a Senior Java Full Stack role in Pune?",
      timestamp: "2026-08-18 10:30 AM",
      read: false,
    },
  ],
};
