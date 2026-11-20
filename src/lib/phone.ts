/** Formats a US number stored as E.164 or digits for display. Falls back to the stored value. */
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return local.length === 10 ? `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}` : phone;
}
