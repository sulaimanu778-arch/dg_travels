// Phone numbers must be exactly 11 digits, for example 08012345678.

export const PHONE_MESSAGE = 'Phone number must be exactly 11 digits.'

// Keeps only the digits and stops at 11, so letters and spaces cannot be typed.
export function cleanPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function isPhone(value: string): boolean {
  return /^\d{11}$/.test(value)
}
