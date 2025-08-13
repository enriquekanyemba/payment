<template>
  <div class="tours-container">
    <h1>🌍 Cape Culture Tours</h1>

    <div class="package-cards">
      <SingleTownship />
      <TownshipDuo />
      <FullCapeCulture />
    </div>
  </div>
</template>

<script>
import SingleTownship from '../views/SingleTownship.vue'
import TownshipDuo from '../views/TownshipDuo.vue'
import FullCapeCulture from '../views/FullCapeCulture.vue'


export default {
  name: "TourPackages",
  components: {
    SingleTownship,
    TownshipDuo,
    FullCapeCulture
  }
}
</script>

<style scoped>
.tours-container {
  padding: 2rem;
  background: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.package-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.package-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  width: 300px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.package-card h2 {
  margin-bottom: 0.5rem;
}

.package-card ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.package-card button {
  background-color: #2d89ef;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.package-card button:hover {
  background-color: #1c5fbf;
}
</style>
