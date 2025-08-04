# Refactoring Guide

Systematic approach to improving code structure without changing functionality.

## Refactoring Process

### 1. Pre-Refactoring Checklist
- [ ] Ensure comprehensive test coverage exists
- [ ] Run all tests and verify they pass
- [ ] Create a baseline performance benchmark
- [ ] Document current behavior
- [ ] Set up version control checkpoint
- [ ] Identify refactoring goals clearly

### 2. Code Smell Detection

#### Common Code Smells
- **Long Methods**: > 20-30 lines
- **Large Classes**: Too many responsibilities
- **Long Parameter Lists**: > 3-4 parameters
- **Duplicate Code**: Similar logic in multiple places
- **Feature Envy**: Method uses another class excessively
- **Data Clumps**: Groups of variables that appear together
- **Primitive Obsession**: Overuse of primitives
- **Switch Statements**: Can often be polymorphism
- **Parallel Inheritance Hierarchies**: Coupled class hierarchies
- **Lazy Class**: Class that doesn't do enough
- **Speculative Generality**: Unused flexibility
- **Temporary Fields**: Fields only used sometimes
- **Message Chains**: a.getB().getC().getD()
- **Middle Man**: Class that only delegates
- **Inappropriate Intimacy**: Classes know too much about each other
- **Alternative Classes**: Similar classes with different interfaces
- **Incomplete Library Class**: Need to extend library
- **Data Class**: Classes with only fields and getters/setters
- **Refused Bequest**: Subclass doesn't use parent methods
- **Comments**: Explaining bad code instead of fixing it

### 3. Refactoring Techniques

#### Method-Level Refactoring
```
- Extract Method
- Inline Method
- Extract Variable
- Inline Variable
- Replace Temp with Query
- Split Temporary Variable
- Remove Assignments to Parameters
- Replace Method with Method Object
```

#### Class-Level Refactoring
```
- Move Method/Field
- Extract Class
- Inline Class
- Hide Delegate
- Remove Middle Man
- Introduce Foreign Method
- Introduce Local Extension
```

#### Data-Level Refactoring
```
- Encapsulate Field
- Replace Data Value with Object
- Change Value to Reference
- Change Reference to Value
- Replace Array with Object
- Replace Magic Numbers with Constants
- Encapsulate Collection
```

#### Conditional Logic Refactoring
```
- Decompose Conditional
- Consolidate Conditional Expression
- Consolidate Duplicate Conditional Fragments
- Remove Control Flag
- Replace Nested Conditional with Guard Clauses
- Replace Conditional with Polymorphism
- Introduce Null Object
```

#### API Refactoring
```
- Rename Method
- Add Parameter
- Remove Parameter
- Separate Query from Modifier
- Parameterize Method
- Replace Parameter with Explicit Methods
- Preserve Whole Object
- Replace Parameter with Method Call
```

### 4. Refactoring Strategy

#### Safe Refactoring Steps
1. Make a small change
2. Run tests
3. Commit if tests pass
4. Repeat

#### Refactoring Priorities
1. **High-Traffic Code**: Most-used parts first
2. **Bug-Prone Areas**: History of issues
3. **Before Adding Features**: Clean before extending
4. **Complex Methods**: Simplify difficult logic
5. **Performance Bottlenecks**: After profiling

### 5. Modern Refactoring Patterns

#### JavaScript/TypeScript
- Convert callbacks to Promises/async-await
- Extract React hooks from components
- Convert class components to functional
- Introduce TypeScript gradually
- Extract utility functions
- Implement barrel exports

#### Python
- Convert to dataclasses
- Use type hints
- Extract decorators
- Implement context managers
- Use comprehensions appropriately
- Apply functional patterns

### 6. Refactoring Checklist
- [ ] Identify specific code smells
- [ ] Choose appropriate refactoring technique
- [ ] Ensure tests cover affected code
- [ ] Apply refactoring in small steps
- [ ] Run tests after each step
- [ ] Verify no behavior changes
- [ ] Check performance impact
- [ ] Update documentation
- [ ] Review with team

## Post-Refactoring
- [ ] Run full test suite
- [ ] Perform code review
- [ ] Update documentation
- [ ] Measure improvement metrics
- [ ] Share learnings with team
- [ ] Plan next refactoring targets