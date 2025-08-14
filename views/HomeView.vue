<template>
  <div>
    <!-- Slideshow -->
    <div class="slideshow-container">
      <div
        class="slideshow-wrapper"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="slide"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
      </div>
    </div>

    <!-- Hero Text -->
    <div class="hero-text-below">
      <h1>Cape Route Tours</h1>
      <p>Experience the heartbeat of Cape Town’s communities</p><br>
      <p>
        Cape Route Tours is a cultural tourism service that goes beyond the usual.
        We offer guided taxi experiences through Cape Town’s iconic communities.
        Our routes include Mitchells Plain, Langa, Khayelitsha, and Bo-Kaap.
        Each ride includes local food, music, stories, and real human connection.
      </p><br>
      <p>
        Tourism in South Africa is rich, but often misses the heart of the people.
        Cape Route Tours was created to bring visitors closer to real township life.
        Our tours are immersive, safe, and built to celebrate local culture.
        We invite you to not just visit, but truly experience Cape Town.
      </p><br>
      <p>
        Today’s travelers want more than just photo ops and landmarks.
        They crave connection, authenticity, and lasting memories.
        Cape Route Tours is designed for this kind of meaningful travel.
        We turn every journey into a powerful story worth telling.
      </p>
    </div>

    <!-- Community Icons -->
  <div class="community-icons">
  <h2>Explore Our Communities</h2>
  <div class="icon-grid">
    <router-link
      v-for="(community, index) in communities"
      :key="index"
      :to="`/tours/${community.slug}`"
      class="community-link"
    >
      <img :src="community.image" :alt="community.name" />
      <span>{{ community.name }}</span>
    </router-link>
  </div>
</div>
 
<SiteFooter />
  </div>
</template>

<script>
import SiteFooter from '@/components/SiteFooter.vue';

export default {
  data() {
    return {
      currentIndex: 0,
      images: [
        'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=450,height=450,dpr=2/tour_img/b25eee60c655631ccbc96c51128556e88b9b04a105e1e7fc722c093a33b72589.jpeg',
        "https://widevisiontravel.com/wp-content/uploads/fimg-cape-town-ships-tours-jpeg.webp",
        'https://capetowndiva.com/wp-content/uploads/2019/06/tomazile-mpanu-stands-at-his-winning-ultra-2019-mural-on-bitterhout-street--1024x611.jpeg',
        'https://landlopers.com/wp-content/uploads/2014/08/Kayamandi-Township-Stellenbosch-South-Africa.jpg'
      ],
     communities: [
  {
    name: "Mitchells Plain",
    slug: "mitchellsplain",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxF4VAJtPBCQhCEb9aRuqb_YQCa9hSIoOM2A&s"
  },
  {
    name: "Khayelitsha",
    slug: "khayelitsha",
    image: "https://adct.org.za/wp-content/uploads/2023/03/Screen-Shot-2023-03-16-at-08.46.35.png"
  },
  {
    name: "Langa",
    slug: "langa",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLQjfnpD-z6AUBO0TdAE2qlupyirNBZvNdDg&s"
  },
  {
    name: "Bo-Kaap",
    slug: "bokaap",
    image: "https://www.andbeyond.com/wp-content/uploads/sites/5/bo-kaap.jpg"
  }
]

    };
  },name: 'HomeView',
  components: {
    SiteFooter
  },
  mounted() {
    setInterval(() => {
      if (this.images && this.images.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }
    }, 4000);
  }
};
</script>

<style>
.slideshow-container {
  width: 100%;
  height: 70vh;
  overflow: hidden;
  position: relative;
}

.slideshow-wrapper {
  display: flex;
  transition: transform 1s ease-in-out;
  height: 100%;
}

.slide {
  min-width: 100%;
  background-size: cover;
  background-position: center;
}

.hero-text-below {
  text-align: center;
  padding: 2rem;
}

.hero-text-below h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-text-below p {
  font-size: 1.2rem;
  color: #151515;
}

.community-icons {
  text-align: center;
  padding: 2rem;
}

.icon-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.community-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s;
}

.community-link img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.community-link span {
  margin-top: 0.5rem;
  font-weight: 500;
}

.community-link:hover {
  transform: scale(1.05);
}
</style>

