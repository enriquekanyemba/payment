<template>
  <div class="form-container">
    <h2>Tour Booking Form</h2>
    <form @submit.prevent="submitForm">
      <input v-model="form.firstName" placeholder="First Name" required />
      <input v-model="form.lastName" placeholder="Last Name" required />
      <input v-model="form.email" type="email" placeholder="Email" required />

      <h3>Next of Kin</h3>
      <input v-model="form.kinName" placeholder="Full Name" required />
      <input v-model="form.kinContact" placeholder="Contact Number" required />
      <input v-model="form.kinRelationship" placeholder="Relationship" required />

      <button type="submit">Proceed</button>
    </form>

    <div class="summary" v-if="booking">
      <h3>Booking Summary</h3>
      <p><strong>Package:</strong> {{ booking.package }}</p>

      <template v-if="booking.package === 'Township Duo Tour'">
        <p><strong>Township 1:</strong> {{ booking.township1 }}</p>
        <p><strong>Date 1:</strong> {{ booking.date1 }}</p>
        <p><strong>Township 2:</strong> {{ booking.township2 }}</p>
        <p><strong>Date 2:</strong> {{ booking.date2 }}</p>
      </template>

      <template v-else-if="booking.package === 'Full Cape Culture Tour'">
        <p><strong>Townships:</strong> {{ booking.townships?.join(', ') }}</p>
        <p><strong>Dates:</strong> {{ booking.dates?.join(', ') }}</p>
      </template>

      <template v-else>
        <p><strong>Township:</strong> {{ booking.township }}</p>
        <p><strong>Date:</strong> {{ booking.date }}</p>
      </template>

      <p><strong>People:</strong> {{ booking.people }}</p>
      <p><strong>Total:</strong> R{{ booking.total }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        kinName: '',
        kinContact: '',
        kinRelationship: ''
      },
      booking: null
    };
  },
  mounted() {
    const storedBooking = localStorage.getItem('bookingDetails');
    if (storedBooking) {
      this.booking = JSON.parse(storedBooking);
    }
  },
  methods: {
    submitForm() {
      // Save form info along with booking to localStorage
      localStorage.setItem('userDetails', JSON.stringify(this.form));

      // You can also send to backend here if needed

      this.$router.push('/checkout');  // Go to payment page
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
  padding: 24px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  padding: 10px 20px;
  background: teal;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #004d4d;
}
.summary {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
}
</style>
