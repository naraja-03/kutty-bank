/**
 * Utility functions for formatting amounts and time
 * Used across multiple components to maintain consistency
 */

/**
 * Format currency amounts with appropriate abbreviations for large numbers
 * @param amount - The amount to format
 * @param type - Whether it's income or expense (affects +/- prefix)
 * @returns Formatted amount string
 */
export const formatAmount = (amount: number, type: 'income' | 'expense') => {
  // Handle large amounts by abbreviating them for transaction cards
  if (Math.abs(amount) >= 10000000) { // 1 crore
    return `${type === 'expense' ? '-' : '+'}₹${(Math.abs(amount) / 10000000).toFixed(1)}Cr`;
  } else if (Math.abs(amount) >= 100000) { // 1 lakh
    return `${type === 'expense' ? '-' : '+'}₹${(Math.abs(amount) / 100000).toFixed(1)}L`;
  } else if (Math.abs(amount) >= 1000) { // 1 thousand
    return `${type === 'expense' ? '-' : '+'}₹${(Math.abs(amount) / 1000).toFixed(1)}K`;
  }
  
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return type === 'expense' ? `-${formatted}` : `+${formatted}`;
};

/**
 * Format currency amounts for display (without +/- prefix)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number) => {
  // Handle large amounts by abbreviating them
  if (Math.abs(amount) >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (Math.abs(amount) >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (Math.abs(amount) >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format timestamp for display
 * @param timestamp - Date string or Date object
 * @returns Formatted time string
 */
export const formatTime = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get user initials from name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Format a date range for display in threads and filters
 * @param start - Start date
 * @param end - End date
 * @param options - Optional formatting options
 * @returns Formatted date range string
 */
export const formatDateRange = (start: Date, end: Date, options?: { includeYear?: boolean }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: options?.includeYear || start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return `${formatDate(start)} - ${formatDate(end)}`;
};
