<template>
  <div class="package-card booking-form">
    <h2>🌍 Full Cape Culture Tour</h2>
    <p>R6000 total • 4 Days (5 hrs/day)</p>
    <ul>
      <li>Meals Included</li>
      <li>Taxi Included</li>
      <li>Cultural Activities</li>
    </ul>

    <!-- Number of People -->
    <div class="form-group">
      <label for="people">Number of People:</label>
      <input type="number" id="people" v-model.number="people" min="1" />
    </div>

    <!-- Township and Date Selection -->
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
        :class="{ 'duplicate-date': isDuplicateDate(town.date, index) }"
      />
      <small v-if="isDuplicateDate(town.date, index)" class="error">
        This date has already been selected.
      </small>
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
  name: "FullCapeCultureTour",
  data() {
    return {
      people: 1,
      selectedTownships: [
        { name: "", date: "" },
        { name: "", date: "" },
      ],
      townships: ["Bo-Kaap", "Khayelitsha", "Mitchell Plain", "Langa"],
    };
  },
  computed: {
    total() {
      return 6000 * this.people;
    },
    minDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
  },
  methods: {
    addTownship() {
      if (this.selectedTownships.length < 4) {
        this.selectedTownships.push({ name: "", date: "" });
      }
    },
    isDuplicateDate(date, index) {
      return (
        date !== "" &&
        this.selectedTownships.some((t, i) => t.date === date && i !== index)
      );
    },
    bookNow() {
      if (this.selectedTownships.length !== 4) {
        alert("Please select exactly 4 townships.");
        return;
      }

      if (this.selectedTownships.some((t) => !t.name || !t.date)) {
        alert("Please fill in all townships and their dates.");
        return;
      }

      if (
        this.selectedTownships.some(
          (t, i) => this.isDuplicateDate(t.date, i)
        )
      ) {
        alert("Please make sure each township is booked on a unique date.");
        return;
      }

      if (
        this.selectedTownships.some(
          (t) => t.date < this.minDate
        )
      ) {
        alert("Please select dates from tomorrow onwards.");
        return;
      }

      const bookingDetails = {
        package: "Full Cape Culture Tour",
        people: this.people,
        townships: this.selectedTownships.map((t) => t.name),
        dates: this.selectedTownships.map((t) => t.date),
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
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: none;
}
h2 {
  text-align: center;
}
ul {
  padding-left: 20px;
  margin-bottom: 15px;
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
.add-township-btn {
  width: auto;
  padding: 8px 16px;
  margin-top: 10px;
  background: #4caf50;
}
.add-township-btn:hover {
  background: #3a8b38;
}
</style>
