export const features = {
  umkmRegistration: true,
  productApproval: true,
  storyApproval: true,
  eventApproval: true,
  whatsappOrder: true,
  promoSlider: true,
  waMessageTemplate: (productName: string, umkmName: string, price: number) =>
    `Halo! Saya tertarik dengan produk *${productName}* dari *${umkmName}* seharga Rp ${price.toLocaleString('id-ID')}. Apakah masih tersedia?`,
  maxProductImages: 3,
  maxImageSizeMB: 5,
};
