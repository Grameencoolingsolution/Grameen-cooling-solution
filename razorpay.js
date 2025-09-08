// Razorpay placeholder integration
// IMPORTANT: Replace RAZORPAY_KEY_ID with your live/test key from Razorpay dashboard
export const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID_HERE"; // <-- TODO

export function payWithRazorpay({amount, orderId, name, email, phone, onSuccess, onCancel}) {
  // If no key id, simulate success (for demo/offline)
  if(!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes("YOUR_")){
    console.warn("Razorpay key not set. Simulating payment success.");
    setTimeout(()=> onSuccess && onSuccess({payment_id:"SIMULATED_PAYMENT"}), 700);
    return;
  }

  if (typeof Razorpay === "undefined") {
    alert("Razorpay SDK not loaded.");
    onCancel && onCancel();
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(Number(amount||0) * 100), // paise
    currency: "INR",
    name: "Grameen Cooling Solution",
    description: `Payment for ${orderId}`,
    notes: { orderId },
    prefill: {
      name, email, contact: phone
    },
    theme: { color: "#0a7cff" },
    handler: function (response) {
      onSuccess && onSuccess(response);
    },
    modal: {
      ondismiss: function () { onCancel && onCancel(); }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
