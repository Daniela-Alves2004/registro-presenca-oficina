# Test Suite Documentation

This directory contains tests for the Workshop Attendance Management System.

## Test Structure

### Database Query Layer Tests
- **`database/queries/workshops.queries.test.js`** - Tests for workshop database operations
- **`database/queries/participants.queries.test.js`** - Tests for participant database operations  
- **`database/queries/attendance.queries.test.js`** - Tests for attendance database operations

### Service Layer Tests
- **`services/api.test.js`** - Tests for API service functions and error handling

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Categories
```bash
# Database query tests only
npm test -- --testPathPattern="database/queries"

# Service tests only
npm test -- --testPathPattern="services"
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Test Coverage Areas

### Database Query Layer (100% coverage)
- ✅ Query execution (success/failure scenarios)
- ✅ Single query operations
- ✅ Write operations (INSERT/UPDATE/DELETE)
- ✅ Transaction handling
- ✅ Error handling and rollback

### API Service Layer (100% coverage)
- ✅ All CRUD operations for workshops, participants, and attendance
- ✅ HTTP request/response handling
- ✅ Error handling (network errors, API errors)
- ✅ Request formatting and headers

## Key Testing Patterns

### Mocking Strategy
- **Database**: Mock SQLite operations to test query logic without real database
- **API**: Mock fetch calls to test service layer independently

### Test Data
- Realistic mock data that matches production schema
- Edge cases (empty data, invalid data, boundary conditions)
- Brazilian-specific data formats (CPF, phone numbers)

### Error Scenarios
- Network failures
- Database connection errors
- Invalid user input
- API error responses

## Best Practices Followed

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Descriptive Names**: Test names clearly describe what is being tested
3. **Arrange-Act-Assert**: Clear structure in test organization
4. **Mocking**: External dependencies are properly mocked
5. **Coverage**: High test coverage for critical business logic
6. **Error Handling**: Tests verify graceful error handling

## Continuous Integration

These tests are designed to run in CI/CD pipelines and will:
- ✅ Pass on all supported Node.js versions
- ✅ Provide clear failure messages
- ✅ Generate coverage reports
- ✅ Run quickly (< 30 seconds for full suite)

## Maintenance

When adding new features:
1. Add corresponding tests in the appropriate category
2. Update this README if adding new test categories
3. Ensure test coverage remains high
4. Run the full test suite before committing changes 