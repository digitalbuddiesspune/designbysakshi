import mongoose from 'mongoose';
import Address from '../models/Address.js';

export const addressFingerprint = (address) => {
  const fullName =
    address.fullName || `${address.firstName || ''} ${address.lastName || ''}`.trim();
  return [
    String(address.phone || '').trim(),
    String(address.pincode || '').trim(),
    String(address.street || '').trim().toLowerCase(),
    String(address.city || '').trim().toLowerCase(),
    String(address.state || '').trim().toLowerCase(),
    String(fullName).trim().toLowerCase(),
  ].join('|');
};

export const dedupeAddressDocuments = (addresses) => {
  const byKey = new Map();

  for (const addr of addresses) {
    const key = addressFingerprint(addr);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, addr);
      continue;
    }
    const pickPreferred = (a, b) => {
      if (a.isDefault && !b.isDefault) return a;
      if (!a.isDefault && b.isDefault) return b;
      return new Date(a.createdAt) > new Date(b.createdAt) ? a : b;
    };
    byKey.set(key, pickPreferred(addr, existing));
  }

  return [...byKey.values()].sort((a, b) => {
    if (Boolean(a.isDefault) !== Boolean(b.isDefault)) {
      return a.isDefault ? -1 : 1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const resolveOrderAddress = async (userId, user, shippingAddress) => {
  const savedId = shippingAddress?.id || shippingAddress?._id;
  if (savedId && mongoose.Types.ObjectId.isValid(String(savedId))) {
    const existing = await Address.findOne({ _id: savedId, user: userId });
    if (existing) return existing;
  }

  const matchQuery = {
    user: userId,
    phone: String(shippingAddress.phone || '').trim(),
    pincode: String(shippingAddress.pincode || '').trim(),
    street: String(shippingAddress.street || '').trim(),
    city: String(shippingAddress.city || '').trim(),
    state: String(shippingAddress.state || '').trim(),
  };

  const matched = await Address.findOne(matchQuery);
  if (matched) return matched;

  const nameParts = (shippingAddress.fullName || '').split(' ');
  return Address.create({
    fullName: shippingAddress.fullName || user.name || '',
    email: user.email || '',
    firstName: nameParts[0] || 'Unknown',
    lastName: nameParts.slice(1).join(' ') || '',
    phone: matchQuery.phone,
    street: matchQuery.street,
    city: matchQuery.city,
    state: matchQuery.state,
    pincode: matchQuery.pincode,
    landmark: String(shippingAddress.landmark || '').trim(),
    user: userId,
  });
};
