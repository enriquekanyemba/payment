<template>
  <div class="booking-form">
    <h2>🏙️ Single Township Tour</h2>
    <p>R1500 per person • 5 hours</p>
    <ul>
      <li>Meals Included</li>
      <li>Taxi Included</li>
      <li>Cultural Activities</li>
    </ul>

    <div class="form-group">
      <label for="people">Number of People:</label>
      <input type="number" v-model.number="people" min="1" />
    </div>

    <div class="form-group">
      <label for="township">Township:</label>
      <select v-model="township">
        <option disabled value="">Select a township</option>
        <option v-for="town in townships" :key="town">{{ town }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="date">Pick a Date:</label>
      <input type="date" v-model="date" :min="minDate" />
    </div>

    <div class="summary">
      <strong>Total: R{{ total }}</strong>
    </div>

    <button @click="bookNow">Book Now</button>
  </div>
</template>

<script>
export default {
  name: 'SingleTownship',
  data() {
    return {
      township: '',
      date: '',
      people: 1,
      townships: ['Bo-Kaap', 'Khayelitsha', 'Mitchell Plain', 'Langa']
    };
  },
  computed: {
    total() {
      return this.people * 1500;
    },
    minDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  },
  methods: {
    bookNow() {
      if (!this.township || !this.date) {
        alert('Please select a township and date.');
        return;
      }
      if (this.date < this.minDate) {
        alert('Please select a date from tomorrow onwards.');
        return;
      }

      // Save booking details to localStorage
      localStorage.setItem('bookingDetails', JSON.stringify({
        package: 'Single Township Tour',
        township: this.township,
        date: this.date,
        people: this.people,
        total: this.total
      }));

      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
.booking-form {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
}
ul {
  padding-left: 20px;
}
.form-group {
  margin-bottom: 15px;
}
input,
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background: #2d89ef;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
button:hover {
  background: #1865c1;
}
.summary {
  text-align: center;
  margin: 15px 0;
  font-size: 18px;
}
</style>
