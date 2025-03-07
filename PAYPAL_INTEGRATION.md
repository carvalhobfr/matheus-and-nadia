# PayPal Integration Guide for Wedding Website

This guide provides instructions on how to set up PayPal integration for your wedding gift registry.

## Current Implementation

The current implementation is a simple "manual" PayPal payment option. When users select PayPal as their payment method, they are shown your PayPal email address to which they can send payments directly through their PayPal account.

## Setting Up Advanced PayPal Integration (Optional)

If you would like to implement a more advanced PayPal integration with direct payment processing, follow these steps:

### 1. Create a PayPal Business Account

1. If you don't already have one, create a PayPal Business account at [PayPal.com](https://www.paypal.com/business)
2. Complete the verification process

### 2. Register a PayPal Developer Application

1. Go to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal Business account
3. Navigate to "My Apps & Credentials"
4. Create a new app for your wedding website
5. Make note of the Client ID and Secret

### 3. Install the PayPal JavaScript SDK

1. Install the PayPal JavaScript SDK:
   ```bash
   npm install @paypal/react-paypal-js
   ```

2. Wrap your application with the PayPal provider in `src/App.jsx`:
   ```jsx
   import { PayPalScriptProvider } from "@paypal/react-paypal-js";

   // Inside your App component
   return (
     <PayPalScriptProvider options={{ 
       "client-id": "YOUR_PAYPAL_CLIENT_ID",
       currency: "EUR" 
     }}>
       {/* Your existing app structure */}
     </PayPalScriptProvider>
   );
   ```

### 4. Implement the PayPal Button Component

1. Modify the payment modal in `src/components/Gifts/index.jsx` to include the PayPal button when PayPal is selected:

```jsx
import { PayPalButtons } from "@paypal/react-paypal-js";

// Inside your payment modal
{paymentMethod === 'paypal' && (
  <div className="mt-4">
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: totalAmount.toString(),
                currency_code: currency === 'EUR' ? 'EUR' : 'BRL'
              },
              description: t('gifts.paymentDescription')
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
          // Handle successful payment
          setIsProcessing(false);
          setShowPaymentModal(false);
          setShowConfirmation(true);
          // Clear the cart
          setSelectedActivities([]);
          setTotalAmount(0);
        });
      }}
      onError={(err) => {
        // Handle errors
        console.error('PayPal error:', err);
        alert(t('gifts.paymentModal.error'));
      }}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay'
      }}
    />
  </div>
)}
```

### 5. Add Error Handling and Payment Status Translations

1. Add error handling and payment success/failure translations to your `src/i18n.js` file:

```js
paymentModal: {
  error: 'There was an error processing your payment. Please try again.',
  success: 'Payment successful! Thank you for your gift!'
}
```

### 6. Testing PayPal Integration

1. Use the Sandbox environment for testing:
   - Make sure your PayPal integration is configured to use the Sandbox environment during development
   - Use the provided test accounts to simulate the payment flow
   - Test with different amounts and in both EUR and BRL currencies

2. Switching to Production:
   - Once you're satisfied with testing, update your client ID to the production client ID
   - Make sure to test the final integration before sharing with your wedding guests

## Security Considerations

- Never include your PayPal Secret in client-side code
- For enhanced security, consider implementing a server-side component to handle payment verification
- If implementing server-side verification, you'll need to set up a simple backend service (e.g., using Node.js with Express)

## Additional Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/checkout/)
- [React PayPal JS SDK Documentation](https://paypal.github.io/react-paypal-js/)
- [PayPal Sandbox Testing](https://developer.paypal.com/tools/sandbox/)

## Customization

You can customize the appearance of the PayPal buttons through the `style` property to match your wedding website's theme.

---

If you have any questions or need further assistance with PayPal integration, please consult the official PayPal documentation or reach out to PayPal developer support. 