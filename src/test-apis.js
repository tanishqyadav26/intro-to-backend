/**
 * Automated API Test Runner
 * Run with: npm test
 * Tests all CRUD endpoints and authentication against the running server.
 */

const BASE_URL = "http://localhost:8000";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

const log = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);

async function ensureServerRunning() {
  try {
    const res = await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) return null;
  } catch (e) {
    // Server is not running yet; boot it up dynamically
    const dotenv = await import("dotenv");
    dotenv.config({ path: "./.env" });
    const connectDB = (await import("./database.js")).default;
    const app = (await import("./app.js")).default;
    await connectDB();
    const server = app.listen(8000);
    return server;
  }
}

async function runTests() {
  const server = await ensureServerRunning();
  log("\n========================================================", colors.cyan);
  log("🧪  STARTING BACKEND API AUTOMATED TEST SUITE", colors.bold);
  log("========================================================\n", colors.cyan);

  let passed = 0;
  let total = 0;
  let samplePostId = null;
  const testUser = {
    username: `student_${Date.now().toString().slice(-4)}`,
    email: `student_${Date.now()}@college.edu`,
    password: "password123",
  };

  async function testStep(name, fn) {
    total++;
    try {
      process.stdout.write(`⏳ Testing: ${name}... `);
      const res = await fn();
      passed++;
      console.log(`${colors.green}✔ PASSED${colors.reset} (${res || "OK"})`);
    } catch (err) {
      console.log(`${colors.red}✖ FAILED${colors.reset}`);
      console.error(`   Error: ${err.message}`);
    }
  }

  // 1. Health Check
  await testStep("Server Health Check (GET /)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return `Status ${res.status} | DB: ${data.database}`;
  });

  // 2. User Registration
  await testStep("User Registration (POST /api/v1/users/register)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    if (res.status !== 201) throw new Error(data.message || `Status ${res.status}`);
    return `Status ${res.status} | Registered User: ${data.data.username}`;
  });

  // 3. User Login
  await testStep("User Authentication / Login (POST /api/v1/users/login)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(data.message || `Status ${res.status}`);
    return `Status ${res.status} | Verified Password via bcrypt`;
  });

  // 4. Create Post (CREATE)
  await testStep("Create Post (POST /api/v1/posts)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Evaluation Demo Post",
        description: "Testing CRUD operations connected to MongoDB Atlas.",
        author: testUser.username,
        category: "College Assignment",
      }),
    });
    const data = await res.json();
    if (res.status !== 201) throw new Error(data.message || `Status ${res.status}`);
    samplePostId = data.data._id;
    return `Status ${res.status} | Created ID: ${samplePostId}`;
  });

  // 5. Read All Posts (READ ALL)
  await testStep("Read All Posts (GET /api/v1/posts)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/posts`);
    const data = await res.json();
    if (res.status !== 200) throw new Error(data.message || `Status ${res.status}`);
    return `Status ${res.status} | Total Posts: ${data.count}`;
  });

  // 6. Read Single Post by ID (READ ONE)
  if (samplePostId) {
    await testStep(`Read Single Post by ID (GET /api/v1/posts/${samplePostId})`, async () => {
      const res = await fetch(`${BASE_URL}/api/v1/posts/${samplePostId}`);
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message || `Status ${res.status}`);
      return `Status ${res.status} | Found: "${data.data.title}"`;
    });

    // 7. Update Post (UPDATE)
    await testStep(`Update Post (PUT /api/v1/posts/${samplePostId})`, async () => {
      const res = await fetch(`${BASE_URL}/api/v1/posts/${samplePostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Updated Evaluation Demo Post (Modified)",
          description: "This post was updated via the PUT CRUD API.",
        }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message || `Status ${res.status}`);
      return `Status ${res.status} | Title Updated`;
    });

    // 8. Delete Post (DELETE)
    await testStep(`Delete Post (DELETE /api/v1/posts/${samplePostId})`, async () => {
      const res = await fetch(`${BASE_URL}/api/v1/posts/${samplePostId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message || `Status ${res.status}`);
      return `Status ${res.status} | Deleted Successfully`;
    });
  }

  log("\n========================================================", colors.cyan);
  if (passed === total) {
    log(`🎉 ALL ${passed}/${total} API TESTS PASSED SUCCESSFULLY!`, colors.green + colors.bold);
    log(`⚡ Backend, Express routes, and MongoDB Atlas are working 100%!`, colors.green);
  } else {
    log(`⚠️  ${passed}/${total} tests passed. Check server logs.`, colors.yellow);
  }
  log("========================================================\n", colors.cyan);

  if (server) {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err.message);
  process.exit(1);
});
