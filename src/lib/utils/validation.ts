import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 * Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Phone number validation schema (optional)
 */
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional();

/**
 * Name validation schema
 */
export const nameSchema = z.string().min(1).max(50);

/**
 * Login form validation
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

/**
 * Registration form validation
 */
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: nameSchema,
    lastName: nameSchema,
    phoneNumber: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

/**
 * Checkout form validation
 */
export const checkoutSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    shippingStreet: z.string().min(5, 'Street address is required'),
    shippingCity: z.string().min(2, 'City is required'),
    shippingState: z.string().min(2, 'State/Province is required'),
    shippingPostalCode: z.string().min(3, 'Postal code is required'),
    shippingCountry: z.string().min(2, 'Country is required').default('USA'),
    paymentMethod: z.enum(['card', 'paypal']).default('card'),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    cvv: z.string().optional(),
}).refine((data) => {
    if (data.paymentMethod === 'card') {
        return data.cardNumber && data.expirationDate && data.cvv;
    }
    return true;
}, {
    message: 'Card details are required',
    path: ['cardNumber'],
});

/**
 * Change password validation
 */
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

/**
 * Reset password validation
 */
export const resetPasswordSchema = z.object({
    email: emailSchema,
    token: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

/**
 * Shipping address validation
 */
export const shippingAddressSchema = z.object({
    shippingStreet: z.string().min(1, 'Street address is required'),
    shippingCity: z.string().min(1, 'City is required'),
    shippingState: z.string().min(1, 'State is required'),
    shippingPostalCode: z.string().min(1, 'Postal code is required'),
    shippingCountry: z.string().min(1, 'Country is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
