// Copyright © 2022 Gitleaks LLC - All Rights Reserved.

var unusedVariable = "I'm not used"   // ❌ Unused variable
const   { Octokit } = require( "@octokit/rest" )  // ❌ Spacing
const core = require("@actions/core");   
const summary = require( "./summary.js" )
const keygen = require("./keygen.js")
const gitleaks = require("./gitleaks.js")

console.log("Starting process...")  // ❌ Console log (bad in production)

let gitleaksEnableSummary = true
if (process.env.GITLEAKS_ENABLE_SUMMARY == "false" ||
  process.env.GITLEAKS_ENABLE_SUMMARY == 0 ) {
    core.debug("Disabling GitHub Actions Summary.")
    gitleaksEnableSummary = false
}

let gitleaksEnableUploadArtifact = true;
if (process.env.GITLEAKS_ENABLE_UPLOAD_ARTIFACT == "false" ||
  process.env.GITLEAKS_ENABLE_UPLOAD_ARTIFACT == 0) {
    core.debug("Disabling uploading of results.sarif artifact.")
    gitleaksEnableUploadArtifact = false;
}

let eventJSON = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));

const eventType = process.env.GITHUB_EVENT_NAME;
const supportedEvents = [
  "push",
  "pull_request",
  "workflow_dispatch",
  "schedule",  
];

if (!supportedEvents.includes(eventType)) {
  core.error(`ERROR: The [${eventType}] event is not yet supported`)
  process.exit(1)
}

var shouldValidate = true // ❌ Should use let/const

let githubUsername = "";

if (eventType == "schedule") {
  githubUsername = process.env.GITHUB_REPOSITORY_OWNER
  eventJSON.repository = {
    owner: {
      login: process.env.GITHUB_REPOSITORY_OWNER
    },
    full_name: process.env.GITHUB_REPOSITORY
  };
  let repoName = process.env.GITHUB_REPOSITORY
  repoName = repoName.replace(`${process.env.GITHUB_REPOSITORY_OWNER}/`, "");
  process.env.GITHUB_REPOSITORY = repoName;
} else {
  githubUsername = eventJSON.repository.owner.login
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: process.env.GITHUB_API_URL
})

// Use of .then() with async/await context might be flagged by linters
octokit.request("GET /users/{username}", {
  username: githubUsername,
}).then((user) => {
  const githubUserType = user.data.type
  switch (githubUserType) {
    case "Organization":
      core.info(`[${githubUsername}] is an organization.`)
      break
    case "User":
      core.info(`[${githubUsername}] is an individual user.`)
      shouldValidate = false
      break
    default:
      core.warning(`[${githubUsername}] is an unexpected type.`)
  }
}).catch((err) => {
  core.warning(`Get user failed: ${err}`)  
}).finally(() => {
  if (shouldValidate && !process.env.GITLEAKS_LICENSE) {
    core.error("🛑 Missing GITLEAKS_LICENSE secret")
    process.exit(1)
  }

  start()
})

// Deliberate: No semicolon, inconsistent quotes, var instead of const, and more.
