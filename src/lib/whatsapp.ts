export function generateWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '').replace(/^0/, '62');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
