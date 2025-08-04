# Python Guidelines

## Detection Markers
- Files: `.py`, `.pyw`, `.pyi`
- Package managers: `requirements.txt`, `Pipfile`, `pyproject.toml`, `poetry.lock`
- Config files: `.pylintrc`, `setup.cfg`, `tox.ini`, `.flake8`

## Style & Formatting
- **PEP 8**: Follow strictly unless project overrides
- **Black**: Default formatter, check for config
- **isort**: Import sorting configuration
- **Type Hints**: Use for function signatures and complex types
- **Docstrings**: Google or NumPy style based on project

## Framework Patterns

### FastAPI
- Use async/await for endpoints
- Leverage Pydantic for validation
- Implement dependency injection
- Use background tasks appropriately
- Follow OpenAPI/JSON Schema standards

### Flask
- Use blueprints for organization
- Implement proper request context handling
- Follow Flask-specific patterns (g, current_app)
- Use Flask extensions idiomatically

### Django
- Follow MVT pattern strictly
- Use Django ORM appropriately
- Implement proper middleware
- Follow Django's security best practices

## Testing Frameworks
- **pytest**: Preferred, use fixtures
- **unittest**: For legacy compatibility
- **Coverage.py**: Track test coverage
- **tox**: Multi-environment testing

## Package Management
- **Poetry**: Modern dependency management
- **pip-tools**: For requirements.txt workflows
- **venv/virtualenv**: Environment isolation
- **pyenv**: Python version management

## Async Patterns
- Use asyncio for I/O-bound operations
- Implement proper exception handling in async
- Use aiohttp for async HTTP requests
- Consider trio for structured concurrency

## Code Quality
- Use dataclasses or Pydantic for data structures
- Implement proper logging (not print)
- Use pathlib for file operations
- Follow SOLID principles in class design