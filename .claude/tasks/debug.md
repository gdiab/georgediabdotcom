# Debugging Guide

Systematic approach to identifying and fixing bugs efficiently.

## Debugging Process

### 1. Problem Identification
- [ ] Reproduce the issue consistently
- [ ] Identify exact error messages/symptoms
- [ ] Determine scope and impact
- [ ] Check when issue started (git bisect if needed)
- [ ] Gather system/environment information

### 2. Investigation Steps
- [ ] Check application logs
- [ ] Review recent code changes
- [ ] Examine error stack traces
- [ ] Use debugger/breakpoints
- [ ] Add strategic console.log/print statements
- [ ] Check network requests (if applicable)
- [ ] Verify data flow

### 3. Common Bug Categories

#### JavaScript/TypeScript
- Type mismatches
- Async/Promise issues
- Undefined/null references
- Scope and closure problems
- Event listener memory leaks
- State management issues

#### Python
- Import errors
- Indentation issues
- Type errors
- Unicode/encoding problems
- Mutable default arguments
- Circular imports

#### General
- Race conditions
- Memory leaks
- Performance degradation
- Integration failures
- Configuration issues
- Environment differences

### 4. Debugging Tools

#### Browser DevTools
- Console for errors
- Network tab for API issues
- Performance profiler
- Memory profiler
- React/Vue DevTools

#### Backend Debugging
- Application logs
- Database query logs
- APM tools (New Relic, DataDog)
- Profilers (cProfile, pprof)
- Debuggers (pdb, node --inspect)

### 5. Root Cause Analysis
- [ ] Identify the actual cause, not just symptoms
- [ ] Understand why the bug occurred
- [ ] Check for similar issues elsewhere
- [ ] Consider edge cases
- [ ] Verify assumptions

### 6. Fix Implementation
- [ ] Write minimal fix addressing root cause
- [ ] Add tests to prevent regression
- [ ] Handle edge cases
- [ ] Add appropriate error handling
- [ ] Update documentation if needed

### 7. Verification
- [ ] Confirm fix resolves original issue
- [ ] Run all related tests
- [ ] Check for side effects
- [ ] Test in different environments
- [ ] Verify performance impact

## Debugging Strategies

### Divide and Conquer
- Isolate the problem area
- Comment out code sections
- Use binary search approach
- Create minimal reproduction

### Rubber Duck Debugging
- Explain the code line by line
- Question assumptions
- Walk through data flow
- Consider alternative approaches

### Time Travel Debugging
- Use git bisect for regressions
- Check version control history
- Review deployment logs
- Compare working vs broken states

## Post-Fix Actions
- [ ] Document the bug and fix
- [ ] Share knowledge with team
- [ ] Add monitoring for similar issues
- [ ] Consider preventive measures
- [ ] Update runbooks if applicable