# Backend Architecture Guide

## Three-Layer Architecture

The backend follows a strict three-layer separation:

```
api.py (HTTP layer) → app.py (Business logic) → modules/ (Domain models + Data access)
```

Each layer has a single responsibility and a consistent coding style.

## Layer 1: `api.py` — HTTP Layer

Flask routes that handle request/response. This layer:
- Extracts data from `request.get_json()` or URL params
- Calls `App.method()` for business logic
- Returns responses via `returny(data, code)` or `set_token(token, code)`
- Catches all exceptions via `excepty(exception)`

### Route Pattern
```python
@api.route("/api/resource/<string:id>/action", methods=["PUT"])
@verify_token  # if auth required
def route_handler(id: str) -> Tuple[Response, Any]:
    try:
        data: Dict[str, Any] = request.get_json()
        field: str = data["field"]
        result = App.some_method(id, field, request.user)  # type: ignore
        return returny(result)
    except Exception as e:
        return excepty(e)
```

### Key Helpers
- `returny(data, code)` — wraps response as `{"data": ...}` or `{"error": ...}` based on code
- `set_token(token, code)` — sets JWT in httpOnly cookie + returns username
- `excepty(exception)` — routes `CustomException` to its code, others to 500
- `verify_token` — decorator that validates JWT cookie, injects `request.user`, refreshes token on response

### URL Conventions
- All routes prefixed with `/api/`
- Auth routes: `/api/app/login`, `/api/app/register`, `/api/app/logout`, `/api/app/verify`
- Resource routes: `/api/resource/<id>/action`
- Toggle actions use PUT (follow/unfollow, like/unlike)

## Layer 2: `app.py` — Business Logic

A single `App` class with all `@staticmethod` methods. This layer:
- Validates inputs
- Orchestrates domain model operations
- Raises custom exceptions
- Logs operations via `Log`

### Method Pattern
```python
@staticmethod
def method_name(param: str, request_user: Dict[str, Any]) -> ReturnType:
    """
    Docstring with Args, Raises, Returns sections.
    """
    try:
        # 1. Build domain objects from raw dicts
        request_User: User_lite = User_lite(request_user)

        # 2. Fetch/validate entities
        entity: Entity = Entities.get_entity(param)
        if not entity:
            raise NotFound("entity")

        # 3. Authorization check
        if request_User != entity.creator:
            raise Unauthorized()

        # 4. Business operation
        result = Entities.do_something(entity, data)

        # 5. Log and return
        Log.info(f"Entity {entity.ID} operated by {request_User.ID}")
        return result

    except Exception as e:
        raise GeneralError(
            data="Error description",
            error=e,
            log=logify(["password"])  # exclude sensitive fields
        ) from e
```

### Conventions
- `request_user` parameter is always `Dict[str, Any]` (raw JWT payload)
- Convert to `User_lite` immediately inside the method
- Variable naming: `request_User` (with capital U) for the User_lite instance
- All methods wrapped in try/except that raises `GeneralError`
- Use `logify(["excluded_fields"])` to auto-log function args minus sensitive data
- Usernames are `.capitalize()`'d, emails are `.lower()`'d

## Layer 3: Domain Models

### Model Classes Pattern

Each domain entity has two classes:
1. **Entity class** (e.g., `User`, `Post`, `Comment`) — full data model
2. **Manager class** (e.g., `Users`, `Posts`) — static operations that bridge models and DB

### Entity Class Structure
```python
class Entity:
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        try:
            self.valid: bool = True
            if not data:
                self.valid = False
            else:
                self.ID: ObjectId = ObjectId(data.get("_id", ObjectId()))
                self.field: str = str(data["field"])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        except Exception as e:
            raise ValueError(f"Error initializing the Entity: {e}")

    def __bool__(self) -> bool:
        return self.valid

    def json(self) -> Dict[str, Any]:
        """Full MongoDB-ready dict with _id."""
        ...

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        """Public-facing dict: _id → ID (as str), adds editable flag, filters nested objects."""
        ...
```

### Key Model Conventions
- `__init__` accepts `Optional[Dict[str, Any]]` — if `None` or empty, sets `self.valid = False`
- `__bool__` returns `self.valid` — allows `if entity:` checks
- `__eq__` compares by `self.ID`
- `json()` returns the full MongoDB document format (with `_id`)
- `filter()` returns the API response format:
  - Renames `_id` to `ID` (as string)
  - Adds `editable: bool` based on `request_user == creator`
  - Filters nested objects (e.g., comments get filtered too)
  - Replaces creator object with just `creator.username`
- `lite()` returns a minimal version (for lists/previews)
- `User_lite` is a lightweight user reference (just ID + username), used for auth context and creator references
- `User` extends `User_lite` with full profile data

### Manager Class Structure
```python
class Entities:
    @classmethod
    def get_entity(cls, value: Any, field: str = "_id") -> Entity:
        try:
            data: Dict[str, Any] = db.get_entity(value, field)
            return Entity(data)
        except Exception as e:
            raise RuntimeError(f"Error fetching the entity: {e}") from e

    @classmethod
    def create_entity(cls, field1: str, creator: User_lite) -> Entity:
        try:
            new_entity: Entity = Entity({
                "field1": field1,
                "creator": creator.json()
            })
            return new_entity if db.add_entity(new_entity.json(), creator.ID) else Entity()
        except Exception as e:
            raise RuntimeError(f"Error creating the entity: {e}") from e
```

### Manager Conventions
- All methods are `@classmethod`
- Return domain objects (not raw dicts)
- On failure, return an empty/invalid instance: `Entity()` (which is falsy via `__bool__`)
- Delegate all DB operations to the `DB` class

## Data Access: `modules/database.py`

The `DB` class handles all MongoDB operations:

```python
class DB:
    __client: MongoClient = MongoClient(MONGO_URI)
    __db: Database = __client["worldblog"]
    __users_collection: Collection = __db["users"]
    __posts_collection: Collection = __db["posts"]
```

### DB Method Conventions
- All methods are `@classmethod`
- Public methods: `get_user`, `add_user`, `get_post`, `add_post`, `get_posts`, etc.
- Private methods: `__get_users`, `__count_users`, `__edit_user`, `__delete_user`
- Return `Dict[str, Any]` or `bool` — never domain objects
- On not found: return `{}` (not None)
- On success: return `True`
- On failure: raise `RuntimeError`
- Use `ObjectId(value) if field == "_id" else value` for flexible lookups

## Exception Hierarchy

All custom exceptions live in `modules/utils/exceptions.py`:

```
CustomException (base)
├── GeneralError      — 500, wraps any exception
├── NotFound          — 404
├── Unauthorized      — 401
├── AlreadyInUse      — 409
├── IncorrectCredential — 400
└── InvalidCredential   — 400
```

### Key Behavior
- All exceptions auto-log on instantiation via `Log.error()`
- `GeneralError` preserves the original exception's code via `getattr(error, "code", code)`
- Exception `error` attribute is what gets returned to the client
- Use `raise GeneralError(data="context", error=e, log=logify([...])) from e` pattern

## Authentication

- JWT tokens stored in httpOnly secure cookies (SameSite=Strict, max_age=86400)
- Token contains `_id` and `username`, expires in 1 day
- `verify_token` decorator on protected routes:
  1. Reads token from cookie
  2. Validates via `App.verify_token()`
  3. Injects `request.user` with decoded payload
  4. Refreshes token on every authenticated response
- Token operations in `modules/utils/token.py` (`Token` class)

## Utilities (`modules/utils/`)

- `generals.py` — `creation_date()`, `check_password()`, `encode_password()`, `logify()`, validators (`is_valid_username`, `is_valid_email`, `is_valid_password`, `is_valid_image`)
- `log.py` — `Log` class with `info()`, `error()`, `warning()` (writes to file + stdout)
- `token.py` — `Token` class with `encode()`, `is_valid()`, private `__decode()`
- `exceptions.py` — Custom exception hierarchy

## Docstring Style

Google-style docstrings on all public methods:
```python
def method(param: str) -> ReturnType:
    """
    Brief description.

    Args:
        param (str): Description.

    Raises:
        ExceptionType: When it happens.

    Returns:
        ReturnType: What it returns.
    """
```

## Type Hints

All function signatures use type hints:
```python
from typing import Any, Dict, List, Optional, Tuple
```
- Parameters: always typed
- Return types: always annotated
- Variables: typed inline where it adds clarity (`user: User = Users.get_user(...)`)

## Adding a New Domain Entity

1. Create model class in `modules/new_entity.py` with `__init__`, `__bool__`, `json()`, `filter()`, `lite()`
2. Create manager class in same file with `@classmethod` CRUD methods
3. Add DB methods in `modules/database.py`
4. Add business logic methods in `app.py` as `@staticmethod` on `App`
5. Add Flask routes in `api.py`
6. Export from `modules/__init__.py`
