<template>
  <div class="booking-form">
    <h2>🌍 Full Cape Culture Tour</h2>
    <p>R6000 total • 4 Days (5 hrs/day)</p>
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
      v-for="(town, index) in selectedTownships"
      :key="index"
      class="form-group"
    >
      <label>Select Township {{ index + 1 }}:</label>
      <select v-model="town.name">
        <option disabled value="">Choose township</option>
        <option v-for="option in townships" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <label>Select Date:</label>
      <input
        type="date"
        v-model="town.date"
        :min="minDate"
      />
    </div>

    <button
      v-if="selectedTownships.length < 4"
      @click="addTownship"
      class="add-township-btn"
    >
      + Add Township
    </button>

    <div class="summary">
      <strong>Total: R{{ total }}</strong>
    </div>

    <button @click="bookNow">Book Now</button>
  </div>
</template>

<script>
export default {
  name: "FullCapeCulture",
  data() {
    return {
      people: 1,
      selectedTownships: [
        { name: "", date: "" },
        { name: "", date: "" },
        { name: "", date: "" },
        { name: "", date: "" },
      ],
      townships: ["Bo-Kaap", "Khayelitsha", "Mitchells Plain", "Langa"],
      packageId: 3,
      packageName: "Full Cape Culture Tour",
      pricePerPerson: 6000,
    };
  },
  computed: {
    total() {
      return this.pricePerPerson * this.people;
    },
    minDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    },
  },
  methods: {
    addTownship() {
      if (this.selectedTownships.length < 4) {
        this.selectedTownships.push({ name: "", date: "" });
      }
    },
    bookNow() {
      if (
        this.selectedTownships.some((t) => !t.name || !t.date) ||
        this.people < 1
      ) {
        alert("Please fill all township selections and dates.");
        return;
      }

      // Optionally validate duplicate dates or same township here

      const totalPrice = this.pricePerPerson * this.people;

      const bookingDetails = {
        packageId: this.packageId,
        packageName: this.packageName,
        people: this.people,
        townships: this.selectedTownships.map((t) => t.name),
        dates: this.selectedTownships.map((t) => t.date),
        total: totalPrice,
      };

      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.booking-form {
  max-width: 500px;
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
input.duplicate-date {
  border-color: red;
}
.error {
  color: red;
  font-size: 12px;
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
.add-township-btn {
  background: #4caf50;
  margin-bottom: 10px;
}
.add-township-btn:hover {
  background: #3a8b38;
}
.summary {
  text-align: center;
  font-weight: bold;
  margin: 20px 0;
}
</style>
