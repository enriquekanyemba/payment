<template>
  <form @submit.prevent="submitForm" class="register-form">
    <h2>Enter Your Details</h2>

    <div class="form-group">
      <input v-model="form.firstName" placeholder="First Name" required />
    </div>

    <div class="form-group">
      <input v-model="form.lastName" placeholder="Last Name" required />
    </div>

    <div class="form-group">
      <input v-model="form.email" type="email" placeholder="Email" required />
    </div>

    <div class="form-group">
      <input v-model="form.phone" type="tel" placeholder="Phone Number" required />
    </div>

    <button :disabled="loading">
      {{ loading ? 'Processing...' : 'Proceed to Payment' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const submitForm = async () => {
  loading.value = true

  try {
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'))
    if (!bookingDetails) {
      alert('No booking found. Please book a tour first.')
      loading.value = false
      router.push('/')
      return
    }

    // Prepare payload to backend
    const payload = {
      full_name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      packageId: bookingDetails.packageId,
      number_of_people: bookingDetails.people,
      // optionally, send townships/dates if needed by backend
      townships: bookingDetails.townships || [bookingDetails.township || bookingDetails.firstTownship || bookingDetails.firstTownship], 
      dates: bookingDetails.dates || [bookingDetails.date || bookingDetails.firstDate || bookingDetails.date],
    }

    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || 'Booking failed')

    // Save checkout URL or session ID to localStorage
    localStorage.setItem('checkoutUrl', data.checkoutUrl)

    // Redirect to checkout page or open Stripe checkout page
    window.location.href = data.checkoutUrl
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}
button {
  padding: 10px;
  background: #2d89ef;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: #1865c1;
}
</style>
