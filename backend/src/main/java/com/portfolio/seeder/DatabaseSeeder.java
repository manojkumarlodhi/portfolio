package com.portfolio.seeder;

import com.portfolio.entity.*;
import com.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * DatabaseSeeder — runs at startup.
 * Seeds admin user (BCrypt-hashed password) and full portfolio data ONLY if not already seeded.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final ProfileRepository profileRepository;
    private final StatRepository statRepository;
    private final OrbitItemRepository orbitItemRepository;
    private final SkillGroupRepository skillGroupRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== DatabaseSeeder: Checking if seeding is needed ===");
        seedAdmin();
        seedProfile();
        seedStats();
        seedOrbitItems();
        seedSkillGroups();
        seedExperience();
        seedProjects();
        seedEducation();
        seedSampleMessage();
        log.info("=== DatabaseSeeder: Done ===");
    }

    // ─── Admin ───────────────────────────────────────────────────────────────
    private void seedAdmin() {
        if (adminRepository.existsByEmail("manojlodhi0821@gmail.com")) {
            log.info("Admin already exists — skipping.");
            return;
        }
        // BCrypt strength 12 — matches SecurityConfig PasswordEncoder
        String hashedPassword = passwordEncoder.encode("manoj@123");
        Admin admin = Admin.builder()
                .email("manojlodhi0821@gmail.com")
                .passwordHash(hashedPassword)
                .build();
        adminRepository.save(admin);
        log.info("Admin seeded: manojlodhi0821@gmail.com (password: manoj@123, BCrypt strength 12)");
    }

    // ─── Profile ─────────────────────────────────────────────────────────────
    private void seedProfile() {
        if (!profileRepository.findAll().isEmpty()) {
            log.info("Profile already exists — skipping.");
            return;
        }
        Profile profile = Profile.builder()
                .name("Manoj Lodhi")
                .role("Java Full Stack Developer")
                .monogram("ML")
                .tagline("I build secure Spring Boot APIs and clean React interfaces.")
                .summary("Java Full Stack Developer at Dollop Infotech, currently building the Coding Arena module of the Smart Education Platform. B.Tech in Electrical & Electronics Engineering, retrained into full stack development at Placement Adda, Indore.")
                .location("Indore, Madhya Pradesh, India")
                .email("manojlodhi0262@gmail.com")
                .phone("+91 7223938787")
                .linkedin("https://www.linkedin.com/in/manoj-lodhi")
                .github("https://github.com/manojkumarlodhi")
                .resumeUrl("#")
                .photoUrl(null)
                .build();
        profileRepository.save(profile);
        log.info("Profile seeded: Manoj Lodhi");
    }

    // ─── Stats ───────────────────────────────────────────────────────────────
    private void seedStats() {
        if (statRepository.count() > 0) {
            log.info("Stats already exist — skipping.");
            return;
        }
        List<Stat> stats = List.of(
                Stat.builder().label("Projects built").value("6+").displayOrder(1).build(),
                Stat.builder().label("Core stack").value("Java + React").displayOrder(2).build(),
                Stat.builder().label("Currently at").value("Dollop Infotech").displayOrder(3).build()
        );
        statRepository.saveAll(stats);
        log.info("Stats seeded: {} records", stats.size());
    }

    // ─── Orbit Items ─────────────────────────────────────────────────────────
    private void seedOrbitItems() {
        if (orbitItemRepository.count() > 0) {
            log.info("Orbit items already exist — skipping.");
            return;
        }
        List<OrbitItem> items = List.of(
                // Outer orbit
                OrbitItem.builder().name("Java").shortLabel("Java").orbitType(OrbitItem.OrbitType.OUTER).displayOrder(1).build(),
                OrbitItem.builder().name("Spring Boot").shortLabel("Boot").orbitType(OrbitItem.OrbitType.OUTER).displayOrder(2).build(),
                OrbitItem.builder().name("React").shortLabel("React").orbitType(OrbitItem.OrbitType.OUTER).displayOrder(3).build(),
                OrbitItem.builder().name("MySQL").shortLabel("SQL").orbitType(OrbitItem.OrbitType.OUTER).displayOrder(4).build(),
                OrbitItem.builder().name("JWT").shortLabel("JWT").orbitType(OrbitItem.OrbitType.OUTER).displayOrder(5).build(),
                OrbitItem.builder().name("Git").shortLabel("Git").orbitType(OrbitItem.OrbitType.OUTER).displayOrder(6).build(),
                // Inner orbit
                OrbitItem.builder().name("REST API").shortLabel("REST").orbitType(OrbitItem.OrbitType.INNER).displayOrder(1).build(),
                OrbitItem.builder().name("Spring Data JPA").shortLabel("JPA").orbitType(OrbitItem.OrbitType.INNER).displayOrder(2).build(),
                OrbitItem.builder().name("Tailwind CSS").shortLabel("TW").orbitType(OrbitItem.OrbitType.INNER).displayOrder(3).build()
        );
        orbitItemRepository.saveAll(items);
        log.info("Orbit items seeded: {} records", items.size());
    }

    // ─── Skill Groups ─────────────────────────────────────────────────────────
    private void seedSkillGroups() {
        if (skillGroupRepository.count() > 0) {
            log.info("Skill groups already exist — skipping.");
            return;
        }
        List<SkillGroup> groups = List.of(
                SkillGroup.builder()
                        .title("Backend")
                        .items(List.of("Java", "Spring Boot", "Spring MVC", "REST APIs", "JPA / Hibernate"))
                        .displayOrder(1).build(),
                SkillGroup.builder()
                        .title("Frontend")
                        .items(List.of("React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"))
                        .displayOrder(2).build(),
                SkillGroup.builder()
                        .title("Database & Security")
                        .items(List.of("MySQL", "Spring Security", "JWT", "BCrypt", "Role Based Access"))
                        .displayOrder(3).build(),
                SkillGroup.builder()
                        .title("Tools & IDEs")
                        .items(List.of("Git", "GitHub", "Postman", "Eclipse", "Maven", "Vite"))
                        .displayOrder(4).build()
        );
        skillGroupRepository.saveAll(groups);
        log.info("Skill groups seeded: {} records", groups.size());
    }

    // ─── Experience ──────────────────────────────────────────────────────────
    private void seedExperience() {
        if (experienceRepository.count() > 0) {
            log.info("Experience already exists — skipping.");
            return;
        }
        List<Experience> experiences = List.of(
                Experience.builder()
                        .type("Employment")
                        .company("Dollop Infotech Pvt. Ltd.")
                        .role("Java Full Stack Developer")
                        .period("Present")
                        .context("Smart Education Platform - Coding Arena")
                        .points(List.of(
                                "Working on the Coding Arena module: categorized problem listings with difficulty, topic and status filters.",
                                "Interactive online code editor with Compile, Run and Submit actions.",
                                "Automated test case verification and formatted execution results."
                        ))
                        .tech(List.of("Java", "Spring Boot", "REST APIs", "MySQL", "React"))
                        .displayOrder(1).build(),
                Experience.builder()
                        .type("Training")
                        .company("Placement Adda, Indore")
                        .role("Java Full Stack Developer Training")
                        .period("Completed - Certified")
                        .context("Intensive full stack program")
                        .points(List.of(
                                "Core Java, OOPs, Collections, Exception Handling and Multithreading.",
                                "Spring Boot, Spring MVC, Spring Security and RESTful API design.",
                                "JWT authentication and hands-on project delivery."
                        ))
                        .tech(List.of("Core Java", "Spring MVC", "Spring Security", "JWT"))
                        .displayOrder(2).build()
        );
        experienceRepository.saveAll(experiences);
        log.info("Experience seeded: {} records", experiences.size());
    }

    // ─── Projects ────────────────────────────────────────────────────────────
    private void seedProjects() {
        if (projectRepository.count() > 0) {
            log.info("Projects already exist — skipping.");
            return;
        }
        List<Project> projects = List.of(
                Project.builder()
                        .title("Coding Arena - Smart Education Platform")
                        .category("Full Stack")
                        .summary("Professional module at Dollop Infotech: a coding practice arena with problem listings, an online editor and automated evaluation.")
                        .features(List.of(
                                "Filterable problem sets by difficulty, topic and status",
                                "Compile, Run and Submit workflow",
                                "Automated test case verification and result formatting"
                        ))
                        .tech(List.of("Java", "Spring Boot", "REST API", "React"))
                        .featured(true).repo("private").demo("none").displayOrder(1).build(),
                Project.builder()
                        .title("Personal Expense Tracker System")
                        .category("Full Stack")
                        .summary("Secure REST backend for tracking income, expenses, budgets and savings goals with role based access.")
                        .features(List.of(
                                "JWT authentication with ROLE_USER and ROLE_ADMIN",
                                "Categories, monthly budgets and savings goals",
                                "Financial reporting and analytics endpoints"
                        ))
                        .tech(List.of("Java", "Spring Boot", "Spring Security", "JWT", "MySQL"))
                        .featured(true).repo("private").demo("none").displayOrder(2).build(),
                Project.builder()
                        .title("P-School LMS")
                        .category("React Apps")
                        .summary("Multi-role learning management dashboard with analytics for Super Admin, Institution, Instructor and Student roles.")
                        .features(List.of(
                                "Role based access selector",
                                "Recharts analytics dashboards",
                                "Course enrollment and assignment management"
                        ))
                        .tech(List.of("React.js", "Vite", "React Router", "Recharts", "CSS3"))
                        .featured(true).repo("private").demo("none").displayOrder(3).build(),
                Project.builder()
                        .title("Online Complaint Registration System")
                        .category("Java Backend")
                        .summary("Backend REST API for logging, categorizing and tracking complaints through their full lifecycle.")
                        .features(List.of(
                                "Authenticated complaint logging",
                                "Categories: Technical, Service, Billing",
                                "Status tracking: Pending -> In Progress -> Resolved"
                        ))
                        .tech(List.of("Java", "Spring Boot", "Spring Data JPA", "MySQL"))
                        .featured(false).repo("private").demo("none").displayOrder(4).build(),
                Project.builder()
                        .title("Job Portal")
                        .category("Java Backend")
                        .summary("Servlet and JSP web application connecting employers posting jobs with candidates applying to them.")
                        .features(List.of(
                                "Employer job posting and application management",
                                "Candidate profile and resume submission",
                                "Search by title, location and skills"
                        ))
                        .tech(List.of("Java", "Servlets", "JSP", "MySQL"))
                        .featured(false).repo("private").demo("none").displayOrder(5).build(),
                Project.builder()
                        .title("PhoneBook Directory")
                        .category("Java Backend")
                        .summary("Core Java contact manager with fast search and strict validation of phone numbers and emails.")
                        .features(List.of(
                                "Add, search, edit and delete contacts",
                                "Phone and email format validation",
                                "Clean console driven workflow"
                        ))
                        .tech(List.of("Java", "Eclipse"))
                        .featured(false).repo("private").demo("none").displayOrder(6).build()
        );
        projectRepository.saveAll(projects);
        log.info("Projects seeded: {} records", projects.size());
    }

    // ─── Education ───────────────────────────────────────────────────────────
    private void seedEducation() {
        if (educationRepository.count() > 0) {
            log.info("Education already exists — skipping.");
            return;
        }
        List<Education> education = List.of(
                Education.builder()
                        .title("B.Tech - Electrical & Electronics Engineering")
                        .org("SAM College of Engineering & Technology, Bhopal")
                        .meta("CGPA 6.8")
                        .note("Engineering fundamentals, problem solving and systems thinking that carried over into software.")
                        .displayOrder(1).build(),
                Education.builder()
                        .title("Java Full Stack Developer Certification")
                        .org("Placement Adda, Indore")
                        .meta("Certified")
                        .note("Intensive training in Core Java, Spring Boot, Spring Security, REST APIs and JWT authentication.")
                        .displayOrder(2).build()
        );
        educationRepository.saveAll(education);
        log.info("Education seeded: {} records", education.size());
    }

    // ─── Sample Message ──────────────────────────────────────────────────────
    private void seedSampleMessage() {
        if (messageRepository.count() > 0) {
            log.info("Messages already exist — skipping.");
            return;
        }
        Message message = Message.builder()
                .name("Rahul Sharma")
                .email("rahul.techlead@example.com")
                .message("Hi Manoj, loved your Coding Arena work! Are you available for a Senior Java Full Stack role in Pune?")
                .isRead(false)
                .build();
        messageRepository.save(message);
        log.info("Sample message seeded.");
    }
}
