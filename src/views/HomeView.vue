<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <div class="home-container">
      <h1>Welcome to Vestige</h1>
      
      <div class="game-description">
        <p>Embark on a journey where death is not the end, but a new beginning.</p>
        
        <h2>The Legacy System</h2>
        <p>
          In Vestige, when your hero falls in battle, they leave behind a spiritual remnant - a Vestige.
          These Vestiges can be incorporated by future heroes, granting them powers and abilities from their predecessors.
        </p>
        
        <h2>Features</h2>
        <ul>
          <li>Create heroes with different classes and abilities</li>
          <li>When a hero dies, they leave behind a Vestige containing a portion of their power</li>
          <li>New heroes can incorporate these Vestiges, creating a spiritual lineage</li>
          <li>Each new hero can build upon the legacy of those who came before</li>
          <li>Accumulate power across multiple hero lifetimes</li>
        </ul>
        
        <div class="cta-container">
          <RouterLink to="/game" class="play-button">Start Your Legacy</RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #1890ff;
  text-align: center;
  margin-bottom: 30px;
}

.game-description {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

h2 {
  color: #333;
  margin-top: 25px;
  margin-bottom: 15px;
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
}

ul {
  margin-bottom: 25px;
}

li {
  margin-bottom: 8px;
}

.cta-container {
  text-align: center;
  margin-top: 40px;
}

.play-button {
  display: inline-block;
  background-color: #1890ff;
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.play-button:hover {
  background-color: #40a9ff;
}
</style>