# SwipeableModal Component

A reusable swipeable modal component that can be positioned above the BottomNav or as a standard overlay modal.

## Features

- ✅ Swipe-to-dismiss animation with spring physics
- ✅ Configurable dismissibility (can be made non-dismissible)
- ✅ Automatic positioning above BottomNav or standard overlay
- ✅ Handle bar for visual swipe indication
- ✅ Clean header design without close button (swipe to dismiss)
- ✅ Backdrop click to dismiss (when dismissible)
- ✅ Smooth framer-motion animations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal should close |
| `title` | `string?` | - | Optional modal title |
| `subtitle` | `string?` | - | Optional modal subtitle |
| `dismissible` | `boolean` | `true` | Whether modal can be dismissed |
| `children` | `ReactNode` | - | Modal content |
| `showAboveBottomNav` | `boolean` | `true` | Position above BottomNav (z-60) or standard (z-50) |

## Usage Examples

### Basic Modal
```tsx
<SwipeableModal isOpen={isOpen} onClose={onClose} title="Settings">
  <p>Modal content here</p>
</SwipeableModal>
```

### Non-dismissible Modal (like SignIn)
```tsx
<SwipeableModal 
  isOpen={isOpen} 
  onClose={onClose} 
  title="Sign In Required"
  dismissible={false}
>
  <p>You must sign in to continue</p>
</SwipeableModal>
```

### Above BottomNav
```tsx
<SwipeableModal 
  isOpen={isOpen} 
  onClose={onClose} 
  showAboveBottomNav={true}
>
  <p>This appears above the bottom navigation</p>
</SwipeableModal>
```

## Current Implementation

The `SignInModal` component has been refactored to use this wrapper:

```tsx
// Before: Custom modal implementation
// After: Uses SwipeableModal wrapper
<SwipeableModal
  isOpen={isOpen}
  onClose={onClose}
  title={title}
  dismissible={dismissible}
  showAboveBottomNav={true}
>
  {/* SignIn content */}
</SwipeableModal>
```
