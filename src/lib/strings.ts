/**
 * Get initials from a name (first letter of first and last name)
 * @param name Full name to get initials from
 * @returns Two letter initials in uppercase
 */
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};
