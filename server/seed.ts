import { storage, hashPassword } from "./storage";

export async function seedDatabase() {
  // Seed admin user
  const existing = await storage.getUserByUsername("admin");
  if (!existing) {
    await storage.createUser({
      username: "admin",
      password: await hashPassword("admin123"),
    });
    console.log("Admin user created: admin / admin123");
  }

  // Seed projects
  const projects = await storage.getProjects();
  if (projects.length === 0) {
    await storage.createProject({
      slug: "finflow-mobile-banking",
      title: "FinFlow Mobile Banking",
      description: "Redesigning mobile banking experience for Gen-Z users",
      category: "Mobile App",
      problemStatement: "How might we make banking more intuitive and engaging for younger users?",
      impact: "+45% user engagement",
      imageUrl: null,
      iconColor: "#2b7fff",
      isFeatured: true,
      sortOrder: 1,
      role: "Lead UX/UI Designer",
      duration: "3 months",
      team: "1 Designer, 2 Engineers, 1 PM",
      theProblem: "Traditional banking apps are complex and intimidating for younger users who grew up with intuitive apps like Instagram and TikTok. FinFlow needed to attract Gen-Z users while maintaining trust and security.",
      theSolution: "We simplified the information architecture, introduced playful micro-interactions, and created a financial literacy section to educate users while building trust.",
      wireframesImageUrl: null,
      results: [
        { label: "User Engagement", value: "+45%" },
        { label: "Account Sign-up", value: "+32%" },
        { label: "App Store Rating", value: "4.8/5" },
      ],
      keyLearnings: [
        "Users trust apps more when complex features are progressively disclosed",
        "Gamification works, but only when it serves a real purpose",
        "Young users want education, not just transactions",
      ],
      tags: ["UX Research", "UI Design", "Mobile App", "Prototyping"],
    });

    await storage.createProject({
      slug: "dashboard-analytics-platform",
      title: "Dashboard Analytics Platform",
      description: "Enterprise SaaS dashboard for real-time data visualization",
      category: "Web Application",
      problemStatement: "Simplifying complex data analytics for non-technical users",
      impact: "60% faster task completion",
      imageUrl: null,
      iconColor: "#ad46ff",
      isFeatured: true,
      sortOrder: 2,
      role: "Senior Product Designer",
      duration: "5 months",
      team: "2 Designers, 4 Engineers, 1 PM",
      theProblem: "Enterprise users were spending hours trying to find actionable insights in a data-heavy dashboard. The cognitive load was causing errors and frustration.",
      theSolution: "Introduced progressive disclosure, smart defaults, and contextual help systems. Rebuilt the information architecture around user goals rather than data categories.",
      wireframesImageUrl: null,
      results: [
        { label: "Task Completion", value: "60% faster" },
        { label: "Error Rate", value: "-40%" },
        { label: "User Satisfaction", value: "9.2/10" },
      ],
      keyLearnings: [
        "Data visualization should tell a story, not just show numbers",
        "Progressive disclosure reduces cognitive load dramatically",
        "Enterprise users need customization but with sensible defaults",
      ],
      tags: ["UX Research", "Data Visualization", "Enterprise", "SaaS"],
    });

    await storage.createProject({
      slug: "e-commerce-redesign",
      title: "E-commerce Redesign",
      description: "Improving conversion rates through UX optimization",
      category: "Web & Mobile",
      problemStatement: "Reducing cart abandonment and increasing purchase completion",
      impact: "+35% conversion rate",
      imageUrl: null,
      iconColor: "#ff6b35",
      isFeatured: true,
      sortOrder: 3,
      role: "UX Designer",
      duration: "2 months",
      team: "1 Designer, 3 Engineers",
      theProblem: "The client's e-commerce site had a 78% cart abandonment rate. Users were dropping off at checkout due to complexity and trust issues.",
      theSolution: "Streamlined the checkout to 2 steps, added trust signals throughout, and improved product discovery with better filtering and search.",
      wireframesImageUrl: null,
      results: [
        { label: "Conversion Rate", value: "+35%" },
        { label: "Cart Abandonment", value: "-28%" },
        { label: "Average Order Value", value: "+18%" },
      ],
      keyLearnings: [
        "Fewer steps in checkout always wins",
        "Trust signals near payment fields dramatically reduce abandonment",
        "Mobile-first checkout is no longer optional",
      ],
      tags: ["Conversion Optimization", "E-commerce", "UX Design", "A/B Testing"],
    });
  }

  // Seed process steps
  const steps = await storage.getProcessSteps();
  if (steps.length === 0) {
    const defaultSteps = [
      {
        stepNumber: 1,
        title: "Research & Discovery",
        description: "Deep dive into user needs, business goals, and market landscape through interviews, surveys, and competitive analysis.",
        keyActivities: ["User interviews & surveys", "Competitive analysis", "Stakeholder workshops", "Data analytics review"],
        color: "#2b7fff",
        sortOrder: 1,
      },
      {
        stepNumber: 2,
        title: "UX Strategy",
        description: "Define the problem, synthesize research insights, and create a strategic direction aligned with business objectives.",
        keyActivities: ["User personas & journeys", "Information architecture", "Feature prioritization", "Success metrics definition"],
        color: "#ad46ff",
        sortOrder: 2,
      },
      {
        stepNumber: 3,
        title: "Wireframing",
        description: "Translate strategy into raw-fidelity wireframes, focusing on structure, flow, and core interactions.",
        keyActivities: ["Low-fi sketches", "User flow diagrams", "Rapid prototyping", "Internal reviews"],
        color: "#ff6b35",
        sortOrder: 3,
      },
      {
        stepNumber: 4,
        title: "UI Design",
        description: "Create high-fidelity designs with polished visuals, micro-interactions, and comprehensive design systems.",
        keyActivities: ["Visual design exploration", "Component libraries", "Interactive prototypes", "Design system documentation"],
        color: "#00c896",
        sortOrder: 4,
      },
      {
        stepNumber: 5,
        title: "Testing & Iteration",
        description: "Validate designs through usability testing, gather feedback, and iterate based on real user behavior.",
        keyActivities: ["Usability testing sessions", "A/B testing", "Feedback synthesis", "Design refinement"],
        color: "#f59e0b",
        sortOrder: 5,
      },
      {
        stepNumber: 6,
        title: "Handoff & Delivery",
        description: "Seamless collaboration with developers to ensure pixel-perfect implementation and smooth launch.",
        keyActivities: ["Developer handoff", "Design specs & assets", "Implementation support", "Post-launch monitoring"],
        color: "#ef4444",
        sortOrder: 6,
      },
    ];
    for (const step of defaultSteps) {
      await storage.createProcessStep(step);
    }
  }

  // Seed playground items
  const playground = await storage.getPlaygroundItems();
  if (playground.length === 0) {
    const items = [
      { title: "Glassmorphic Card Design", category: "UI Concept", description: "Exploring glass morphism for modern card layouts", sortOrder: 1 },
      { title: "Mobile Navigation Animation", category: "Micro-interaction", description: "Smooth gesture-based navigation transitions", sortOrder: 2 },
      { title: "Dashboard Widget Experiment", category: "Data Viz", description: "New ways to visualize complex data at a glance", sortOrder: 3 },
      { title: "Neomorphic Form Controls", category: "UI Concept", description: "Soft UI form elements with tactile feel", sortOrder: 4 },
      { title: "Loading State Animations", category: "Micro-interaction", description: "Delightful loading patterns that keep users engaged", sortOrder: 5 },
      { title: "Color Palette Generator", category: "Tool", description: "A tool to generate accessible color palettes", sortOrder: 6 },
    ];
    for (const item of items) {
      await storage.createPlaygroundItem({ ...item, imageUrl: null });
    }
  }

  // Seed site settings
  const name = await storage.getSiteSetting("designer_name");
  if (!name) {
    await storage.upsertSiteSetting("designer_name", "Alex Morgan");
    await storage.upsertSiteSetting("designer_title", "UX/UI Designer");
    await storage.upsertSiteSetting("bio", "I'm a UX/UI designer passionate about creating digital experiences that solve real problems and delight users. My journey into design started 5 years ago when I realized that good design isn't just about aesthetics—it's about empathy, strategy, and impact.");
    await storage.upsertSiteSetting("bio_extended", "I believe the best designs are invisible. They guide users effortlessly toward their goals while making complex tasks feel simple. My approach combines user research, data analysis, and creative problem-solving to build products that people actually want to use.");
    await storage.upsertSiteSetting("bio_personal", "When I'm not pushing pixels, you'll find me brewing specialty coffee, producing music, or contributing to design communities. I love sharing knowledge and learning from other designers.");
    await storage.upsertSiteSetting("years_experience", 5);
    await storage.upsertSiteSetting("projects_completed", 50);
    await storage.upsertSiteSetting("happy_clients", 20);
    await storage.upsertSiteSetting("location", "San Francisco, CA");
    await storage.upsertSiteSetting("email", "alex@example.com");
    await storage.upsertSiteSetting("linkedin", "linkedin.com/in/alexmorgan");
    await storage.upsertSiteSetting("twitter", "@alexmorgan");
    await storage.upsertSiteSetting("dribbble", "dribbble.com/alexmorgan");
    await storage.upsertSiteSetting("behance", "behance.net/alexmorgan");
    await storage.upsertSiteSetting("cv_url", "#");
    await storage.upsertSiteSetting("availability_status", "Currently Available");
    await storage.upsertSiteSetting("availability_note", "Open for new projects starting February 2026");
    await storage.upsertSiteSetting("trusted_companies", ["TechCorp", "StartupXYZ", "DesignLab", "InnovateCo"]);
    await storage.upsertSiteSetting("skills", [
      "User Research", "Wireframing", "Prototyping", "UI Design",
      "Design Systems", "Usability Testing", "Information Architecture", "Interaction Design"
    ]);
    await storage.upsertSiteSetting("tools", [
      { name: "Figma", icon: "figma" },
      { name: "Adobe XD", icon: "adobexd" },
      { name: "Sketch", icon: "sketch" },
      { name: "Framer", icon: "framer" },
    ]);
    await storage.upsertSiteSetting("beyond_design", [
      { title: "Design Communities", icon: "users" },
      { title: "Coffee Brewing", icon: "coffee" },
      { title: "Music Production", icon: "music" },
    ]);
    await storage.upsertSiteSetting("why_work_with_me", [
      { title: "Research-driven design", description: "Every decision backed by user research, data analysis, and behavioral psychology.", icon: "search" },
      { title: "Fast & scalable systems", description: "Building design systems that grow with your product and accelerate development.", icon: "zap" },
      { title: "Business-focused UX", description: "Balancing user needs with business goals to drive measurable results.", icon: "trending-up" },
    ]);
  }

  // Seed testimonials
  const tList = await storage.getTestimonials();
  if (tList.length === 0) {
    await storage.createTestimonial({
      name: "Sarah Johnson",
      company: "TechCorp",
      role: "Product Manager",
      content: "Alex transformed our product experience completely. The research-driven approach led to a 40% increase in user engagement.",
      avatarUrl: null,
      sortOrder: 1,
    });
    await storage.createTestimonial({
      name: "Marcus Chen",
      company: "StartupXYZ",
      role: "CEO",
      content: "Working with Alex was a game changer. The design system they built saved our engineering team weeks of work.",
      avatarUrl: null,
      sortOrder: 2,
    });
  }
}
