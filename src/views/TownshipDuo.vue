<template>
  <div class="booking-form">
    <h2>🏙️ Township Duo Tour</h2>
    <p>R3000 per person • Visit 2 townships</p>
    <ul>
      <li>Meals Included</li>
      <li>Taxi Included</li>
      <li>Cultural Activities</li>
    </ul>

    <div class="form-group">
      <label for="people">Number of People:</label>
      <input type="number" id="people" v-model.number="people" min="1" />
    </div>

    <div
      class="form-group"
      v-for="(township, index) in selectedTownships"
      :key="index"
    >
      <label>Select Township {{ index + 1 }}:</label>
      <select v-model="township.name">
        <option disabled value="">Choose township</option>
        <option
          v-for="town in townships"
          :key="town"
          :value="town"
        >
          {{ town }}
        </option>
      </select>

      <label>Select Date:</label>
      <input type="date" v-model="township.date" :min="minDate" />
    </div>

    <!-- Only date error now -->
    <div v-if="dateError" class="error-msg">
      ❌ The two dates must be different.
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
  name: "TownshipDuo",
  data() {
    return {
      people: 1,
      selectedTownships: [
        { name: "", date: "" },
        { name: "", date: "" },
      ],
      townships: ["Bo-Kaap", "Khayelitsha", "Mitchells Plain", "Langa"],
      packageId: 2,
      packageName: "Township Duo Tour",
      pricePerPerson: 3000,
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
    },
    dateError() {
      return (
        this.selectedTownships[0].date &&
        this.selectedTownships[1].date &&
        this.selectedTownships[0].date === this.selectedTownships[1].date
      );
    }
  },
  methods: {
    bookNow() {
      if (
        this.selectedTownships.some((t) => !t.name || !t.date) ||
        this.people < 1
      ) {
        alert("Please fill all township selections and dates.");
        return;
      }
      if (this.dateError) {
        alert("The two dates must be different.");
        return;
      }

      const bookingDetails = {
        packageId: this.packageId,
        packageName: this.packageName,
        people: this.people,
        firstTownship: this.selectedTownships[0].name,
        firstDate: this.selectedTownships[0].date,
        secondTownship: this.selectedTownships[1].name,
        secondDate: this.selectedTownships[1].date,
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
.error-msg {
  color: red;
  text-align: center;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
