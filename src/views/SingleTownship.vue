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
      <input type="number" id="people" v-model.number="people" min="1" />
    </div>

    <div class="form-group">
      <label for="township">Select Township:</label>
      <select id="township" v-model="selectedTownship">
        <option disabled value="">Choose township</option>
        <option v-for="town in townships" :key="town" :value="town">{{ town }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="date">Select Date:</label>
      <input
        id="date"
        type="date"
        v-model="date"
        :min="minDate"
      />
    </div>

    <!-- Show total -->
    <div class="summary">
      <strong>Total: R{{ total }}</strong>
    </div>

    <button @click="bookNow">Book Now</button>
  </div>
</template>

<script>
export default {
  name: "SingleTownship",
  data() {
    return {
      people: 1,
      selectedTownship: "",
      date: "",
      townships: ["Bo-Kaap", "Khayelitsha", "Mitchells Plain", "Langa"],
      packageId: 1,
      packageName: "Single Township Tour",
      pricePerPerson: 1500,
    };
  },
  computed: {
    minDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    },
    total() {
      return this.people * this.pricePerPerson;
    }
  },
  methods: {
    bookNow() {
      if (!this.selectedTownship || !this.date || this.people < 1) {
        alert("Please fill all fields correctly.");
        return;
      }
      if (this.date < this.minDate) {
        alert("Please select a date from tomorrow onwards.");
        return;
      }

      const bookingDetails = {
        packageId: this.packageId,
        packageName: this.packageName,
        people: this.people,
        township: this.selectedTownship,
        date: this.date,
        total: this.total,
      };

      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.booking-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
}
h2 {
  text-align: center;
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
  color: white;
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
  font-weight: bold;
  margin: 20px 0;
}
</style>
