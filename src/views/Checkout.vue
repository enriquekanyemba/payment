<template>
  <div class="checkout">
    <h2>Complete Payment</h2>
    <p>Please confirm your package and proceed to payment.</p>
    <p><strong>Package:</strong> {{ booking?.package || 'No booking found' }}</p>

    <button :disabled="!booking" @click="handleCheckout">Pay Now</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51Rt7PRCpnBRvaWSUf1MvcSdjYBY1LHk3YaLhXZdpibKGMo4qzru3OxQvWwfPl6LEkGGJAeTM0f5UPoWe8QulkBq000l57EV9Gd')

const booking = ref(null)

// Map package names to your Stripe price IDs
const priceMap = {
  'Single Township Tour': 'price_1RtSxxCpnBRvaWSUfOQgieaI',
  'Township Duo Tour': 'price_1RtSuKCpnBRvaWSULMnhrj3q',
  'Full Cape Culture Tour': 'price_1RtT0LCpnBRvaWSUtXLjjCSY'
}

onMounted(() => {
  const storedBooking = localStorage.getItem('bookingDetails')
  if (storedBooking) booking.value = JSON.parse(storedBooking)
})

const handleCheckout = async () => {
  if (!booking.value) {
    alert('No booking info found')
    return
  }

  const stripe = await stripePromise
  const priceId = priceMap[booking.value.package]

  if (!priceId) {
    alert('Invalid package for payment')
    return
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: booking.value.people || 1 }],
    mode: 'payment',
    successUrl: 'http://localhost:8080/success',
    cancelUrl: 'http://localhost:8080/cancel'
  })

  if (error) {
    console.error('Stripe error:', error)
  }
}
</script>

<style scoped>
.checkout {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
button {
  padding: 10px 20px;
  background: #2d89ef;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
