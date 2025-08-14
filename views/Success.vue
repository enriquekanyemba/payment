<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const booking = ref(null);
const error = ref(null);

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  if (!sessionId) {
    error.value = 'No session ID provided.';
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/payment-confirm?session_id=${sessionId}`);
    const data = await response.json();

    if (response.ok && data.booking) {
      booking.value = data.booking;
    } else {
      error.value = data.error || 'Failed to confirm booking.';
      console.error('Failed to confirm payment:', data.error);
    }
  } catch (err) {
    error.value = 'Failed to confirm payment. Please try again later.';
    console.error('Error confirming payment:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="checkout">
    <h2>Booking Confirmation</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error"><p class="error-msg">{{ error }}</p></div>
    <div v-else-if="booking">
      <p class="success-msg">Your payment has been confirmed!</p>
      <p><strong>Name:</strong> {{ booking?.Customer?.name || 'N/A' }}</p>
      <p><strong>Email:</strong> {{ booking?.Customer?.email || 'N/A' }}</p>
      <p><strong>Package:</strong> {{ booking?.Package?.packageName || 'N/A' }}</p>
      <p><strong>Total Paid:</strong> R{{ Number(booking?.totalPrice || 0).toFixed(2) }}</p>
      <p><strong>Date & Time:</strong> {{ booking?.date || new Date().toISOString().split('T')[0] }} at 11:00 AM</p>
      <p><strong>Meeting Point:</strong> Cape of Good Hope (Central Pick-Up Point)</p>
    </div>
    <div v-else><p>No booking information found.</p></div>
  </div>
</template>

<style scoped>
.checkout {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.success-msg { color: green; font-weight: bold; margin-bottom: 20px; }
.error-msg { color: red; font-weight: bold; margin-bottom: 20px; }
</style>
