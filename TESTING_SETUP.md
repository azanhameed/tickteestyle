# Testing Setup Instructions

## 📦 Install Testing Dependencies

Run this command to install all required testing packages:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

Or with legacy peer deps (recommended for this project):

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest --legacy-peer-deps
```

## 🧪 Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Writing Your First Test

Create a test file next to your component with `.test.tsx` or `.test.ts` extension:

```tsx
// components/ui/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

## ✅ Test Coverage Goals

- **Utilities**: 80%+ coverage
- **Components**: 70%+ coverage
- **Hooks**: 80%+ coverage
- **API Routes**: 60%+ coverage

## 🎯 What to Test

### High Priority
1. Utility functions (formatPrice, validation)
2. Critical user flows (add to cart, checkout)
3. Authentication logic
4. Form validation

### Medium Priority
5. UI components (rendering, props)
6. State management (Zustand stores)
7. API routes

### Low Priority
8. Styling
9. Simple presentational components

## 📚 Testing Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Note**: Testing files have been created as examples. You can add more tests as you develop new features.
