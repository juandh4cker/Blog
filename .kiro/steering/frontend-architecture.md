# Frontend Architecture Guide

## KindsManager Component System

The entire UI component library is built on a custom abstraction layer called `KindsManager`. This is the core pattern — every UI component follows it.

### Concept

KindsManager is a polymorphic component renderer with two levels of configuration:

1. **Kingdoms** — define which underlying component renders (e.g., HeroUI's `Button`, `ButtonGroup`, `Snippet`)
2. **Kinds** — define preset prop combinations that map to a kingdom

This allows a single component like `<Button kind="primary">` to resolve to a specific HeroUI component with specific default props, while still accepting overrides.

### Structure of a UI Component

Every UI component in `components/ui/` follows this exact pattern:

```jsx
import { SomeHeroComponent } from '@heroui/react';
import KindsManager from '../KindsManager';

// 1. Base props applied to ALL variants
const baseProps = {};

// 2. Kingdoms: map a key to a { component, kingdomProps }
//    - component: the actual React component to render
//    - kingdomProps: default props for this kingdom
const kingdoms = {
  default: {
    component: (props) => <SomeHeroComponent {...props}>{props.children}</SomeHeroComponent>,
    kingdomProps: {},
  },
  variant: {
    component: (props) => <CustomWrapper {...props}>{props.children}</CustomWrapper>,
    kingdomProps: { someProp: true },
  },
};

// 3. Kinds: map a kind name to a { kingdom, props }
//    - kingdom: which kingdom to use
//    - props: additional default props for this kind
const kinds = {
  default: { kingdom: 'default', props: {} },
  primary: { kingdom: 'variant', props: { color: 'primary', size: 'md' } },
};

const defaultKind = 'primary';

// 4. The exported component
const MyComponent = ({ kind, children, ...props }) => (
  <KindsManager
    baseProps={baseProps}
    kingdoms={kingdoms}
    kinds={kinds}
    kind={kind}
    defaultKind={defaultKind}
    {...props}
  >
    {children}
  </KindsManager>
);

export default MyComponent;
```

### Prop Merge Order

KindsManager merges props in this order (later wins):
`baseProps → kingdomProps → kindProps → user props`

For `className`, it uses `clsx` to merge all levels (not override).

### Sub-components Pattern

Compound components use `createSub` to attach sub-components:

```jsx
const createSub = (defaultKingdom) => ({ children, kind, ...props }) => (
  <KindsManager
    baseProps={baseProps}
    kingdom={kingdoms[defaultKingdom]}
    kinds={kinds}
    kind={kind}
    defaultKind={defaultKingdom}
    {...props}
  >
    {children}
  </KindsManager>
);

Container.Header = createSub('header');
Container.Body = createSub('body');
Container.Footer = createSub('footer');
```

Usage: `<Container.Header>`, `<Modal.Footer>`, `<Dropdown.Trigger>`, etc.

### When Creating a New UI Component

1. Create the file in `components/ui/YourComponent.jsx`
2. Define `baseProps`, `kingdoms`, `kinds`, `defaultKind`
3. Wrap with `KindsManager`
4. Add sub-components with `createSub` if needed
5. Export from `components/index.js`

## Component Organization

### `components/ui/` — Presentational
Reusable, domain-agnostic. Built on KindsManager + HeroUI. Examples: Button, Input, Modal, Container, Text, Form, Dropdown, Image, Loading, Divider, Tabs.

### `components/compound/` — Domain-specific
Compose UI components for specific features. Examples: Posts, Comments, UserCard, Share, Error.

### `components/globals/` — App-wide
Components that appear across the app: Menu, Background.

### Barrel Exports
Every folder has an `index.js` that re-exports all public members. Always import from the barrel:
```jsx
import { Button, Container, Text, Modal } from '@/components';
```

## API Layer

### Structure
- `api/api.js` — Axios instance + `apiRequest` wrapper
- `api/auth.js`, `api/posts.js`, `api/users.js`, `api/comments.js` — Domain-specific functions

### `apiRequest` Pattern
All API calls go through `apiRequest(endpoint, method, body)`. It:
- Strips the response to `response.data.data`
- Throws structured errors with `{ message, status, data }`

### Adding a New API Function
```js
// api/newDomain.js
import { apiRequest } from './api';

export const fetchThing = (id) => apiRequest(`thing/${id}`);
export const createThing = (data) => apiRequest('thing/create', 'POST', data);
```
Then export from `api/index.js`.

## Hooks

### `useApi` — Centralized Data Hook
All server interactions go through `useApi()`. It wraps TanStack Query and provides:
- Queries: `fetchPosts()`, `fetchPost(ID)`, `fetchUser(username)`
- Mutations: `login()`, `register()`, `addPost()`, `editPost()`, `deletePost()`, `likePost()`, `addComment()`, `deleteComment()`, `followOrUnfollowUser()`

Mutations are created with `createMutation(mutationFn, defaults)` which returns a factory function. Call it with optional overrides:
```jsx
const addPostMutation = addPost({ onSuccess: (id) => navPost(id) });
addPostMutation.mutate(data);
```

Auth-protected calls use `callWithAuth(fn)` which checks `auth.isAuthenticated` before executing.

### `useNav` — Navigation
Wraps `useNavigate` and `useLocation`. Provides named navigation functions:
`navBlog()`, `navPost(id)`, `navUser(username)`, `navDashboard()`, `navConfig()`, `navWelcome()`, `navBack()`, etc.

### `useAuth` — Auth State
Reads from `AuthContext`. Returns `{ auth, setAuth, logout }`.

### `useToast` — Notifications
Returns `toastMessage()`, `toastSuccess()`, `toastWarning()`, `toastError()`.

### `useTitle` — SEO/Page Title
Sets document title and meta description via `react-helmet-async`.

### `useConfig` — User Preferences
Language and theme from `ConfigContext`, persisted in localStorage.

## Context Providers

Providers are composed in `AppContext.jsx` using `reduceRight`:
```
HeroUIProvider → QueryProvider → ConfigProvider → AuthProvider → TitleProvider
```

Each provider lives in `context/` with its own file. The pattern is always:
1. `createContext()` export
2. Provider component with state
3. Matching `useXxx` hook in `hooks/`

## Forms

Forms use `react-hook-form` + `zod` + HeroUI's Form component:
```jsx
<Form schema={postSchema} onSubmit={handleSubmit} isSubmitting={mutation.isPending}>
  <Input name="fieldName" label="Label" />
  <Button kind="primary" type="submit">Submit</Button>
</Form>
```

- `Form` wraps children in `FormProvider`
- `Input` auto-registers with `useFormContext().register(name)`
- Validation schemas live in `schema/` as Zod objects
- Error messages are in Spanish

## Routing

Routes are defined as a config array in `routes/routes.jsx`:
```jsx
{
  key: 'post',
  path: '/post/:ID',
  element: <Post />,
  auth: ['private'],  // 'all', 'private', 'guest', or role names
  children: [...]     // nested routes
}
```

`AppRoutes` renders them with auth checking. The `Menu` component uses `<Outlet />` for nested routes.

## File Conventions

- UI components: `.jsx` in `components/ui/`
- Compound components: `.jsx` in `components/compound/`
- Pages: `.jsx` in `pages/`
- Hooks: `.js` in `hooks/`
- API functions: `.js` in `api/`
- Utilities: `.ts` or `.tsx` in `utils/`
- Schemas: `.js` in `schema/`
- Contexts: `.jsx` in `context/`
- Entry points and App: `.tsx`
- All imports use the `@/` alias (maps to `src/`)
- UI text is in Spanish
