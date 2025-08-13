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
      error.value = data.error || 'No booking data found.';
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

    <div v-else-if="error">
      <p class="error-msg">{{ error }}</p>
    </div>

    <div v-else-if="booking">
      <!-- your existing booking display -->
    </div>

    <div v-else>
      <p>No booking information found.</p>
    </div>
  </div>
</template>


<style scoped>
.checkout {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
.success-msg {
  color: green;
  font-weight: bold;
  margin-top: 20px;
}
.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>
