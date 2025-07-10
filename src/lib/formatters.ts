export const formatAmount = (amount: number, type: 'income' | 'expense') => {
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

export const formatCurrency = (amount: number) => {
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

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

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
