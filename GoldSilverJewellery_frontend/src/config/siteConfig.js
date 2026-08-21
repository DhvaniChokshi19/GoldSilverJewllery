// Site Configuration & Jewellery Price Utilities

export const SITE_CONFIG = {
  storeName: "Chokshi Bapulal Amthabhai and Sons",
  tagline: "Chokshi Navinchandra and Kaushal",
  whatsappNumber: "+919825567478", // Primary WhatsApp number for inquiries
  address: "Chokshi bajar",
  cityState: "Padra, Gujarat 391440",
  landmark: "opposite Kumbharvada ni gali ",
  googleMapsUrl: "https://maps.app.goo.gl/G1RDFCN9VAokXcMA8",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.040669234409!2d73.07887407506742!3d22.238535679731086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fb981508455ad%3A0x46cd88585649e5d!2sChokshi%20Bapulal%20Amthabhai%20and%20Sons!5e0!3m2!1sen!2sin!4v1786111790120!5m2!1sen!2sin",
  gstin: "24AAACG9876K1Z9",//demo
  bisLicense: "HM-GUJ-916999-2024", //demo
  gstRatePercent: 3.0, // Standard GST on Gold/Silver Jewellery in India
  defaultMakingChargePercent: 12.0, // Default making charge %
  hallmarkBadge: "BIS 916 / 999 Certified",
  workingHours: [
    { days: "Monday - Sunday", hours: "10:00 AM - 7:30 PM", openHour: 10, closeHour: 19.5 },
    { days: "Tuesday", hours: "Weekly Holiday", openHour: 0, closeHour: 0 }
  ],
  
  // Default base market rates (in INR per gram)
  defaultRates: {
    gold24k: 7450,
    gold22k: 6830,
    gold18k: 5590,
    gold14k: 4350,
    silver999: 89,
    silver925: 82,
    gold24kChange: 0.45,
    silver999Change: -0.12,
    lastUpdated: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }
};

/**
 * Calculates itemized jewellery price breakdown
 */
export const calculateJewelleryPrice = ({
  weightGrams = 10,
  baseRatePerGram = 6830,
  makingChargeType = "percent", // 'percent' or 'fixed_per_gram'
  makingChargeValue = 12,
  wastagePercent = 0,
  gstPercent = 3.0,
  discountPercent = 0
}) => {
  const weight = parseFloat(weightGrams) || 0;
  const rate = parseFloat(baseRatePerGram) || 0;
  
  // 1. Raw Metal Cost
  const rawMetalCost = weight * rate;
  
  // 2. Wastage Cost (if applicable)
  const wastageWeight = weight * ((parseFloat(wastagePercent) || 0) / 100);
  const wastageCost = wastageWeight * rate;
  const totalMetalCost = rawMetalCost + wastageCost;

  // 3. Making Charge Cost
  let makingChargeCost = 0;
  if (makingChargeType === "percent") {
    makingChargeCost = totalMetalCost * ((parseFloat(makingChargeValue) || 0) / 100);
  } else {
    // Fixed per gram
    makingChargeCost = weight * (parseFloat(makingChargeValue) || 0);
  }

  // 4. Subtotal before Tax
  const subtotalBeforeDiscount = totalMetalCost + makingChargeCost;
  const discountAmount = subtotalBeforeDiscount * ((parseFloat(discountPercent) || 0) / 100);
  const subtotal = subtotalBeforeDiscount - discountAmount;

  // 5. GST / Tax Amount
  const gstAmount = subtotal * ((parseFloat(gstPercent) || 0) / 100);

  // 6. Final Total Price
  const totalPrice = Math.round(subtotal + gstAmount);

  return {
    weightGrams: weight,
    baseRatePerGram: rate,
    rawMetalCost: Math.round(rawMetalCost),
    wastageCost: Math.round(wastageCost),
    totalMetalCost: Math.round(totalMetalCost),
    makingChargeCost: Math.round(makingChargeCost),
    discountAmount: Math.round(discountAmount),
    subtotal: Math.round(subtotal),
    gstPercent,
    gstAmount: Math.round(gstAmount),
    totalPrice
  };
};

/**
 * Formats a clean WhatsApp direct chat URL with a structured message
 */
export const getWhatsAppInquiryUrl = ({
  productName = "",
  metalPurity = "",
  weight = "",
  estimatedPrice = "",
  productCode = "",
  customMessage = ""
}) => {
  const rawNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  
  let text = `✨ *GSJ Jewellery Inquiry* ✨\n\n`;
  if (productName) {
    text += `*Item:* ${productName}\n`;
  }
  if (productCode) {
    text += `*Code:* ${productCode}\n`;
  }
  if (metalPurity) {
    text += `*Purity:* ${metalPurity}\n`;
  }
  if (weight) {
    text += `*Approx Weight:* ${weight} g\n`;
  }
  if (estimatedPrice) {
    text += `*Estimated Price:* ₹${Number(estimatedPrice).toLocaleString("en-IN")}\n`;
  }
  
  if (customMessage) {
    text += `\n*Note/Question:* ${customMessage}\n`;
  } else {
    text += `\nHello GSJ Jewellers, I am interested in this item. Please share live availability and best offer!`;
  }

  return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
};
