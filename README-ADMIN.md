# Braj Camp Registration System - Admin Guide

## 🎯 Overview
This guide explains how to access devotee registration data, configure email confirmations, and manage the Braj Camp registration system.

## 📧 Email Configuration

### Setting Up Email Confirmations
1. **Copy Environment File**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Email Settings** in `.env.local`:
   ```env
   # For Gmail (recommended)
   EMAIL_USER=your_camp_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ADMIN_EMAIL=admin@yourdomain.com
   ```

3. **Gmail App Password Setup**:
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for "Mail"
   - Use the App Password (not your regular password)

### Email Features
- ✅ **Automatic Confirmation Emails**: Sent to devotees after successful payment
- ✅ **Admin Notifications**: Sent to admin email for each registration
- ✅ **Beautiful HTML Templates**: Professional email design with camp branding
- ✅ **Registration Details**: Complete devotee information included

## 📊 Accessing Registration Data

### Admin API Endpoint
**URL**: `http://localhost:3000/api/admin/registrations`

### Authentication
Add this header to your requests:
```
x-api-key: braj-camp-admin-2025
```

### Example API Calls

#### Get All Registrations
```bash
curl -H "x-api-key: braj-camp-admin-2025" \
     http://localhost:3000/api/admin/registrations
```

#### Filter by Facilitator
```bash
curl -H "x-api-key: YOUR_ADMIN_API_KEY" \
     "http://localhost:3000/api/admin/registrations?facilitator=John"
```

#### Filter by Area
```bash
curl -H "x-api-key: YOUR_ADMIN_API_KEY" \
     "http://localhost:3000/api/admin/registrations?area=Delhi"
```

#### Filter by Accommodation
```bash
curl -H "x-api-key: YOUR_ADMIN_API_KEY" \
     "http://localhost:3000/api/admin/registrations?accommodation=room"
```

### Response Format
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "reg_1234567890_abc123",
        "devotee": {
          "name": "Devotee Name",
          "email": "devotee@email.com",
          "facilitator": "Facilitator Name",
          "area": "Area Name",
          "level": "Level",
          "accommodation": "room",
          "medicalNotes": "Any medical notes"
        },
        "payment": {
          "paymentId": "pay_xyz123",
          "orderId": "order_abc456",
          "amount": 2500,
          "status": "completed"
        },
        "registrationTime": "2025-01-21T10:30:00.000Z"
      }
    ],
    "statistics": {
      "totalRegistrations": 1,
      "roomBookings": 1,
      "dormitoryBookings": 0,
      "totalRevenue": 2500,
      "facilitatorBreakdown": {
        "Facilitator Name": 1
      },
      "areaBreakdown": {
        "Area Name": 1
      },
      "levelBreakdown": {
        "Level": 1
      }
    }
  }
}
```

## 💰 Razorpay Dashboard Access

### What You'll Find in Razorpay
1. **Payment Details**: All successful payments with amounts
2. **Order Information**: Order IDs linked to registrations
3. **Transaction History**: Complete payment timeline
4. **Settlement Reports**: Revenue and payout information

### Linking Razorpay to Registration Data
- Each payment in Razorpay has an Order ID
- Use the Admin API to match Order IDs with devotee details
- Cross-reference using the `orderId` field in API responses

## 🔧 System Features

### Performance Improvements ✅
- **Optimized React Components**: Using useCallback and useMemo
- **Reduced Re-renders**: Memoized functions and calculations
- **Better Error Handling**: Comprehensive error states
- **Loading States**: Clear feedback during operations

### Form Improvements ✅
- **Removed IYF-Mahipalpur**: From area selection as requested
- **Enhanced Validation**: Better form validation
- **Error Display**: Clear error messages for users
- **Payment Error Handling**: Specific payment error states

### Email System ✅
- **Confirmation Emails**: Automatic after successful payment
- **Admin Notifications**: Real-time registration alerts
- **Professional Design**: Branded email templates
- **Error Resilience**: Email failures don't affect payments

### Admin Features ✅
- **Registration API**: Complete devotee data access
- **Filtering Options**: By facilitator, area, level, accommodation
- **Statistics**: Revenue, bookings, and breakdowns
- **Secure Access**: API key authentication

## 🚀 Quick Start for Admins

1. **Configure Emails**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your email credentials
   ```

2. **Test Registration Flow**:
   - Visit: http://localhost:3000
   - Complete a test registration
   - Check email confirmation

3. **Access Registration Data**:
   ```bash
   curl -H "x-api-key: YOUR_ADMIN_API_KEY" \
        http://localhost:3000/api/admin/registrations
   ```

4. **Monitor Payments**:
   - Check Razorpay dashboard for payment details
   - Use Admin API for devotee information

## 📞 Support

For technical issues or questions:
- Check the terminal logs for error messages
- Verify email configuration in `.env.local`
- Ensure Razorpay credentials are correct
- Test API endpoints with the provided examples

---

**Hare Krishna! 🙏**

*This system is designed to make camp registration smooth and efficient for both devotees and administrators.*