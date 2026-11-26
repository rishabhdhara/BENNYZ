export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface PinCodeResult {
  valid: boolean;
  city?: string;
  state?: string;
  deliveryDays?: string;
  isCodAvailable?: boolean;
  message?: string;
}

export const checkIndianPinCode = (pin: string): PinCodeResult => {
  const clean = pin.trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      valid: false,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  const prefix = clean.substring(0, 2);
  let state = 'India';
  let city = 'Regional Service Hub';
  let deliveryDays = '4 – 6 Business Days (Estimated)';

  if (['11'].includes(prefix)) {
    state = 'Delhi NCR';
    city = 'New Delhi';
    deliveryDays = '2 – 3 Business Days (Estimated)';
  } else if (['12', '13', '14'].includes(prefix)) {
    state = 'Haryana / Punjab';
    city = 'Gurugram / Chandigarh';
    deliveryDays = '2 – 4 Business Days (Estimated)';
  } else if (['40', '41', '42', '43', '44'].includes(prefix)) {
    state = 'Maharashtra';
    city = 'Mumbai / Pune';
    deliveryDays = '2 – 3 Business Days (Estimated)';
  } else if (['56', '57', '58'].includes(prefix)) {
    state = 'Karnataka';
    city = 'Bengaluru';
    deliveryDays = '2 – 3 Business Days (Estimated)';
  } else if (['60', '61', '62', '63', '64'].includes(prefix)) {
    state = 'Tamil Nadu';
    city = 'Chennai / Coimbatore';
    deliveryDays = '2 – 4 Business Days (Estimated)';
  } else if (['50', '51', '52', '53'].includes(prefix)) {
    state = 'Telangana / Andhra Pradesh';
    city = 'Hyderabad';
    deliveryDays = '2 – 4 Business Days (Estimated)';
  } else if (['70', '71', '72', '73'].includes(prefix)) {
    state = 'West Bengal';
    city = 'Kolkata';
    deliveryDays = '3 – 5 Business Days (Estimated)';
  } else if (['30', '31', '32', '33', '34'].includes(prefix)) {
    state = 'Rajasthan';
    city = 'Jaipur';
    deliveryDays = '3 – 5 Business Days (Estimated)';
  } else if (['38', '39'].includes(prefix)) {
    state = 'Gujarat';
    city = 'Ahmedabad';
    deliveryDays = '3 – 4 Business Days (Estimated)';
  }

  return {
    valid: true,
    city,
    state,
    deliveryDays,
    isCodAvailable: true,
    message: `Delivery serviceable to ${city}, ${state}. Estimated timeline: ${deliveryDays}.`,
  };
};
