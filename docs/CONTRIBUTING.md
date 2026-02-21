# Contributing to BUS-FULL-AA

Thank you for your interest in contributing to BUS-FULL-AA! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Be respectful, inclusive, and constructive in all interactions.

---

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Git
- Text editor or IDE (VS Code recommended)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/krishnavenisshiju-afk/BUS-FULL-AA.git
cd BUS-FULL-AA-1

# Create a new branch
git checkout -b feature/your-feature-name

# Install dependencies
cd backend
npm install
cd ../BUS-FULL-AA
npm install  # if needed for frontend build tools
```

---

## Development Workflow

### 1. Branch Naming Conventions

```
feature/short-description       # New features
bugfix/short-description        # Bug fixes
docs/short-description          # Documentation updates
refactor/short-description      # Code refactoring
test/short-description          # Test additions
```

Examples:
- `feature/qr-code-validation`
- `bugfix/passenger-count-reset`
- `docs/api-endpoint-examples`

### 2. Making Changes

#### Frontend Changes
```bash
cd BUS-FULL-AA
# Edit HTML, CSS, or JavaScript files
# Test in browser (http://localhost:5000)
```

#### Backend Changes
```bash
cd backend
# Edit server.js or create new route files
# Restart the server to test changes
# Test using curl or Postman
```

### 3. Testing Your Changes

**Backend Testing:**
```bash
# Start server
cd backend
node server.js

# Test endpoints
curl http://localhost:5000/
curl "http://localhost:5000/buses?from=ALUVA&to=VYTILA"
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"busId":"BUS1001","userId":"USER123"}'
```

**Frontend Testing:**
- Open browser to http://localhost:5000
- Test all user interactions
- Verify no console errors (F12)
- Test on mobile devices when possible

### 4. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new feature: bus capacity warnings"

# Make sure to follow commit message guidelines (see below)
```

---

## Coding Standards

### JavaScript

**Naming Conventions:**
```javascript
// Use camelCase for variables and functions
const userName = "John";
const getPassengerCount = () => {};

// Use PascalCase for classes/constructors
class BusManager {}

// Use UPPER_SNAKE_CASE for constants
const MAX_PASSENGERS = 50;
const API_BASE_URL = "http://localhost:5000";
```

**Code Style:**
```javascript
// Use semicolons
const x = 10;

// Use const by default, let if needed, avoid var
const CONSTANT = "value";
let counter = 0;

// Use arrow functions for callbacks
const data = array.map(item => item.value);

// Add comments for complex logic
// Check if user already boarded this bus
if (scanLog[userId][busId]) {
  // User previously scanned, now checking out
  bus.passengers--;
}
```

### HTML/CSS

**HTML:**
```html
<!-- Use semantic HTML5 elements -->
<header>
  <h1>Title</h1>
</header>

<main>
  <section id="content">
    <article>Content</article>
  </section>
</main>

<footer>Footer content</footer>
```

**CSS:**
```css
/* Use class selectors, avoid IDs */
.bus-card {
  padding: 20px;
  border-radius: 8px;
}

/* Use consistent spacing and indentation */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```

### Comments

Always add meaningful comments:
```javascript
// Good comment - explains WHY
// Increment passenger count for each check-in
bus.passengers++;

// Bad comment - explains WHAT (code already does this)
// Increment bus.passengers
bus.passengers++;

// Document functions
/**
 * Validates if bus route exists
 * @param {string} from - Starting location
 * @param {string} to - Destination location
 * @returns {boolean} True if route exists
 */
function validateRoute(from, to) {
  return buses.some(bus => 
    bus.from === from && bus.to === to
  );
}
```

---

## Commit Messages

Follow the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning (whitespace, semicolons, etc.)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests
- `chore:` Changes to build process, dependencies, etc.

### Examples

```
feat(scanner): add auto-focus for QR code scanning
```

```
fix(api): prevent duplicate check-ins on rapid scans

Fixes #123
Added check to prevent race condition when user scans QR code twice rapidly.
```

```
docs(readme): update installation instructions for Node v18
```

```
refactor(backend): split server.js into route modules

BREAKING CHANGE: Import paths have changed for API routes.
Update require statements when upgrading.
```

---

## Pull Requests

### Before Creating a PR

1. **Update your branch:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests:**
   ```bash
   # Manual testing - run both frontend and backend
   # Check for any console errors
   ```

3. **Check your code:**
   - No console.log() left in production code
   - Comments are clear and helpful
   - Code follows style guidelines
   - No hardcoded values (except constants)

### Creating a PR

```bash
# Push your branch
git push origin feature/your-feature-name
```

Then on GitHub:
1. Click "New Pull Request"
2. Select your branch
3. Fill in the PR template
4. Submit for review

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this change:
- [ ] Unit tests
- [ ] Manual testing
- [ ] Both frontend and backend tested

## Screenshots (if applicable)
Add screenshots of the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments are clear
- [ ] No breaking changes
- [ ] Updated documentation
- [ ] Tested locally
```

---

## Reporting Bugs

### Bug Report Template

```markdown
## Description
Brief description of the bug.

## Steps to Reproduce
1. Go to ...
2. Click on ...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node version: 14.x / 16.x / 18.x

## Screenshots
Add screenshots if helpful

## Additional Context
Any other information
```

---

## Requesting Features

### Feature Request Template

```markdown
## Summary
Brief one-line summary of the feature

## Description
Detailed description of what you want to add

## Motivation
Why do you want this feature?

## Proposed Solution
How would you implement this?

## Alternatives
Other ways to solve this problem

## Additional Context
Screenshots, relevant links, etc.
```

---

## Code Review Guidelines

When reviewing code:

1. **Be respectful** - Remember there's a person behind the code
2. **Be constructive** - Suggest improvements, not just criticism
3. **Ask questions** - Help the author explain their reasoning
4. **Recognize effort** - Acknowledge good work
5. **Be specific** - Point to exact lines and explain issues

### Example Review Comments

✅ **Good:**
```
This approach could be simplified using Array.filter() instead of a for loop.
See example in lines 45-50 of details.js
```

❌ **Bad:**
```
This code is wrong
```

---

## Git Best Practices

```bash
# Keep commits atomic (one feature per commit)
git add src/details.js
git commit -m "fix: correct bus filter logic"

# Update from main before pushing
git fetch origin
git rebase origin/main

# Use meaningful branch names
git checkout -b feature/passenger-notifications  # Good
git checkout -b bugfix1                           # Bad

# Write descriptive commit messages
git commit -m "Add passenger count warnings"      # Good
git commit -m "Update"                            # Bad
```

---

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug found?** File an Issue
- **Feature idea?** Open a Feature Request
- **Need support?** Check existing Issues/PRs first

---

## Recognition

Contributors will be recognized in:
- README.md Team Members section
- Release notes
- GitHub contributors page

---

**Thank you for contributing to BUS-FULL-AA! 🚌**

For more information, see our [README](../README.md) and [Architecture](ARCHITECTURE.md) documentation.
