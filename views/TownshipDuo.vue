<template>
  <div class="booking-form">
    <h2>🏙️ Township Duo Tour</h2>
    <p>R3000 per person • 2 Townships • 6 hours</p>
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
      <label>Township 1:</label>
      <select v-model="township1">
        <option disabled value="">Select first township</option>
        <option v-for="town in townships" :key="town">{{ town }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>Pick a Date for Township 1:</label>
      <input type="date" v-model="date1" :min="minDate" />
    </div>

    <div class="form-group">
      <label>Township 2:</label>
      <select v-model="township2">
        <option disabled value="">Select second township</option>
        <option v-for="town in townships" :key="town">{{ town }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>Pick a Date for Township 2:</label>
      <input type="date" v-model="date2" :min="minDate" />
    </div>

    <div v-if="date1 && date2 && date1 === date2" class="error-msg">
      ❌ The two dates must be different.
    </div>

    <div class="summary">
      <strong>Total: R{{ total }}</strong>
    </div>

    <button @click="bookNow">Book Now</button>
  </div>
</template>

<script>
export default {
  name: 'TownshipDuo',
  data() {
    return {
      people: 1,
      township1: '',
      township2: '',
      date1: '',
      date2: '',
      townships: ['Bo-Kaap', 'Khayelitsha', 'Mitchell Plain', 'Langa']
    };
  },
  computed: {
    total() {
      return this.people * 3000;
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
      if (!this.township1 || !this.date1 || !this.township2 || !this.date2) {
        alert('Please complete both township selections and dates.');
        return;
      }
      if (this.date1 === this.date2) {
        alert('The two dates must be different.');
        return;
      }
      if (this.date1 < this.minDate || this.date2 < this.minDate) {
        alert('Please select dates from tomorrow onwards.');
        return;
      }

      localStorage.setItem('bookingDetails', JSON.stringify({
        package: 'Township Duo Tour',
        township1: this.township1,
        date1: this.date1,
        township2: this.township2,
        date2: this.date2,
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
  margin-top: 10px;
}
button:hover {
  background: #1865c1;
}
.summary {
  text-align: center;
  margin: 15px 0;
  font-size: 18px;
}
.error-msg {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}
</style>
