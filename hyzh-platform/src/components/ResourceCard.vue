<template>
  <div class="resource-card">
    <div class="image-container">
      <img
        :src="imageUrl || '/assets/default-resource.png'"
        :alt="title"
        class="resource-image"
      />
    </div>
    <div class="content">
      <h4 class="title">{{ title }}</h4>
      <p v-if="description" class="description">{{ description }}</p>
      <a
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="visit-btn"
      >
        访问资源
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.resource-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  height: 120px;
  overflow: hidden;
}

.resource-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
}

.description {
  margin: 0 0 15px;
  font-size: 14px;
  color: #666;
  flex: 1;
}

.visit-btn {
  display: inline-block;
  padding: 8px 15px;
  background: #1e88e5;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  transition: background 0.3s;
}

.visit-btn:hover {
  background: #1565c0;
}
</style>
