<template>
  <div class="booking-form">
    <h2>🏙️ Single Township Tour</h2>
    <p class="tour-info">R1500 per person • 5 hours</p>
    <ul class="tour-features">
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
      <input type="date" id="date" v-model="date" :min="minDate" />
    </div>

    <div class="summary">
      <span>Total:</span> <strong>R{{ total }}</strong>
    </div>

    <button @click="bookNow" class="book-btn">Book Now</button>
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
    },
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
  max-width: 450px;
  margin: 30px auto;
  padding: 25px 30px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #2d89ef;
}

.tour-info {
  text-align: center;
  font-weight: 500;
  margin-bottom: 15px;
}

.tour-features {
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 25px;
  color: #555;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

input,
select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

input:focus,
select:focus {
  border-color: #2d89ef;
  outline: none;
  box-shadow: 0 0 5px rgba(45, 137, 239, 0.3);
}

.summary {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 25px;
  color: #2d89ef;
}

.book-btn {
  width: 100%;
  padding: 12px;
  background: #2d89ef;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.book-btn:hover {
  background: #1865c1;
}
</style>
