<template>
  <div class="codex-view">
    <h2>Codex du Monde</h2>
    
    <div class="codex-content">
      <div class="codex-categories">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: currentCategory === category.id }"
          @click="currentCategory = category.id"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-name">{{ category.name }}</div>
          <div class="entry-count">{{ getEntryCount(category.id) }}</div>
        </div>
      </div>
      
      <div class="codex-entries">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher dans le codex..." 
            class="search-input"
          />
          <button class="clear-search" @click="searchQuery = ''" v-if="searchQuery">✕</button>
        </div>
        
        <div class="entries-list" v-if="filteredEntries.length > 0">
          <div
            v-for="entry in filteredEntries"
            :key="entry.id"
            class="entry-item"
            :class="{ active: currentEntry && currentEntry.id === entry.id }"
            @click="selectEntry(entry)"
          >
            <h3 class="entry-title">{{ entry.title }}</h3>
            <div class="entry-summary">{{ entry.summary }}</div>
          </div>
        </div>
        
        <div class="no-entries" v-else>
          <p v-if="searchQuery">
            Aucune entrée ne correspond à votre recherche "{{ searchQuery }}".
          </p>
          <p v-else-if="allEntries.length === 0">
            Votre codex est encore vide. Explorez le monde pour découvrir de nouvelles connaissances.
          </p>
          <p v-else>
            Aucune entrée dans cette catégorie. Découvrez d'autres aspects du monde.
          </p>
        </div>
      </div>
      
      <div class="codex-detail">
        <div v-if="currentEntry" class="entry-detail">
          <h2>{{ currentEntry.title }}</h2>
          <div class="entry-metadata">
            <span class="entry-category">{{ getCategoryName(currentEntry.categoryId) }}</span>
            <span class="entry-discovered">Découvert le {{ formatDate(currentEntry.discoveredDate) }}</span>
          </div>
          
          <div class="entry-content">
            <div v-if="currentEntry.image" class="entry-image">
              <div class="image-placeholder">
                <span>{{ currentEntry.image }}</span>
              </div>
            </div>
            
            <div class="entry-text" v-html="currentEntry.content"></div>
          </div>
          
          <div v-if="currentEntry.relatedEntries && currentEntry.relatedEntries.length > 0" class="related-entries">
            <h4>Entrées connexes:</h4>
            <div class="related-links">
              <a 
                v-for="relatedId in currentEntry.relatedEntries" 
                :key="relatedId"
                @click.prevent="selectEntryById(relatedId)"
                href="#"
                class="related-link"
              >
                {{ getEntryTitle(relatedId) }}
              </a>
            </div>
          </div>
        </div>
        
        <div v-else class="no-selection">
          <p>Sélectionnez une entrée du codex pour afficher son contenu.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CodexEntry, CodexCategory } from '../core/types/ViewTypes';

// Catégories du codex
const categories = ref<CodexCategory[]>([
  { id: 'vestiges', name: 'Vestiges', icon: '🔮' },
  { id: 'world', name: 'Monde', icon: '🌍' },
  { id: 'characters', name: 'Personnages', icon: '👥' },
  { id: 'creatures', name: 'Créatures', icon: '🐉' },
  { id: 'history', name: 'Histoire', icon: '📜' },
  { id: 'magic', name: 'Magie', icon: '✨' }
]);

const currentCategory = ref('vestiges');
const currentEntry = ref<CodexEntry | null>(null);
const searchQuery = ref('');

// Entrées du codex (à remplacer par vos données réelles)
const allEntries = ref<CodexEntry[]>([
  {
    id: 'vestige-origins',
    categoryId: 'vestiges',
    title: 'Origines des Vestiges',
    summary: 'L\'histoire mystérieuse de l\'apparition des premiers vestiges.',
    discoveredDate: new Date(2024, 3, 1),
    image: '📚',
    content: `
      <p>Les vestiges sont apparus pour la première fois il y a plus de mille ans, lorsque le grand cataclysme a frappé le monde. Selon les anciennes chroniques, un héros nommé Eldrath fut le premier à découvrir qu'il pouvait transmettre une partie de son essence à travers la mort.</p>
      <p>Après être tombé au combat contre un dragon ancien, son esprit persista sous la forme d'un vestige lumineux que son apprenti put absorber, héritant ainsi d'une fraction de ses pouvoirs et de ses souvenirs.</p>
      <p>Les sages théorisent que le cataclysme a modifié la nature même de l'âme humaine, permettant cette transmission de pouvoir. D'autres pensent que les vestiges étaient toujours présents, mais que les humains n'avaient simplement pas découvert comment les percevoir et les utiliser.</p>
      <p>Quoi qu'il en soit, les vestiges sont devenus une partie intégrante de notre civilisation, changeant fondamentalement notre rapport à la mort et à l'héritage.</p>
    `,
    relatedEntries: ['vestige-incorporation', 'history-cataclysm']
  },
  {
    id: 'vestige-incorporation',
    categoryId: 'vestiges',
    title: 'Incorporation des Vestiges',
    summary: 'Le processus d\'absorption d\'un vestige et ses effets.',
    discoveredDate: new Date(2024, 3, 5),
    image: '✨',
    content: `
      <p>L'incorporation d'un vestige est un processus à la fois mystique et physique. Lorsqu'un héros découvre un vestige, il doit entrer dans un état méditatif profond pour permettre à l'essence du vestige de fusionner avec la sienne.</p>
      <p>Ce processus peut prendre de quelques minutes à plusieurs heures, selon la puissance du vestige et la compatibilité avec le receveur. Les témoins décrivent une lueur qui enveloppe le corps du héros pendant l'incorporation, dont la couleur varie selon la nature du vestige.</p>
      <p>Une fois incorporé, le vestige confère généralement des améliorations statistiques permanentes, et parfois même des capacités uniques héritées du héros original. Plus rare encore, certains vestiges transmettent des fragments de mémoire ou de personnalité.</p>
      <p>Un même héros peut incorporer plusieurs vestiges au cours de sa vie, mais des études suggèrent qu'il existe une limite naturelle au-delà de laquelle l'esprit du récepteur risque de se fragmenter.</p>
    `,
    relatedEntries: ['vestige-origins', 'magic-soul-binding']
  },
  {
    id: 'world-vestifall',
    categoryId: 'world',
    title: 'Ville de Vestifall',
    summary: 'La capitale du royaume, centre d\'étude des vestiges.',
    discoveredDate: new Date(2024, 3, 10),
    image: '🏙️',
    content: `
      <p>Vestifall, souvent appelée la Cité des Héritiers, est la plus grande ville du royaume et le centre névralgique de l'étude des vestiges. Fondée il y a cinq siècles sur les ruines d'une ancienne cité, elle tire son nom de la légende selon laquelle c'est ici que le premier vestige serait "tombé" du ciel.</p>
      <p>La ville est dominée par la Grande Bibliothèque, un bâtiment imposant où sont archivées toutes les connaissances connues sur les vestiges. L'Académie des Héritiers, adjacente à la bibliothèque, forme les jeunes talents à maîtriser leurs vestiges et à en découvrir de nouveaux.</p>
      <p>Les quartiers de Vestifall sont organisés en cercles concentriques, avec les institutions liées aux vestiges au centre, entourées par les quartiers nobles, marchands, et finalement les quartiers populaires à la périphérie.</p>
      <p>La ville est dirigée par le Conseil des Vestiges, composé des sept héros ayant incorporé les vestiges les plus puissants et les plus anciens.</p>
    `,
    relatedEntries: ['characters-council', 'world-academy']
  },
  {
    id: 'history-cataclysm',
    categoryId: 'history',
    title: 'Le Grand Cataclysme',
    summary: 'L\'événement qui a changé le monde et fait apparaître les vestiges.',
    discoveredDate: new Date(2024, 3, 15),
    image: '🌋',
    content: `
      <p>Il y a approximativement mille ans, un événement catastrophique connu sous le nom de Grand Cataclysme bouleversa le monde entier. Les récits de cette époque sont fragmentaires, mais tous s'accordent sur l'immensité de la destruction.</p>
      <p>Le ciel s'embrasa pendant des jours, la terre trembla pendant des semaines, et des vagues gigantesques engloutirent des côtes entières. Lorsque le chaos s'apaisa enfin, le monde avait changé de façon permanente.</p>
      <p>C'est dans les années qui suivirent que les premiers vestiges furent découverts. Beaucoup pensent que le Cataclysme a déchiré le voile entre notre monde et celui des esprits, permettant aux âmes des défunts de persister sous forme de vestiges.</p>
      <p>Certains textes anciens suggèrent que le Cataclysme ne fut pas un accident, mais le résultat d'une expérience magique à grande échelle qui aurait mal tourné. D'autres évoquent l'intervention d'entités divines ou extraplanaires.</p>
      <p>Quelle que soit sa cause, le Grand Cataclysme marque la fin de l'Ère Ancienne et le début de l'Ère des Vestiges dans laquelle nous vivons aujourd'hui.</p>
    `,
    relatedEntries: ['vestige-origins', 'magic-ancient-arts']
  },
  {
    id: 'creatures-spectral-remnants',
    categoryId: 'creatures',
    title: 'Vestiges Spectraux',
    summary: 'Entités nées de vestiges corrompus ou abandonnés.',
    discoveredDate: new Date(2024, 3, 20),
    image: '👻',
    content: `
      <p>Les Vestiges Spectraux, également appelés Échos ou Aberrations, sont des entités dangereuses qui apparaissent lorsqu'un vestige est corrompu ou abandonné trop longtemps sans être incorporé par un héros.</p>
      <p>Ces créatures conservent une partie des souvenirs et des pouvoirs du héros original, mais sont dépourvues de conscience ou de moralité. Elles sont attirées par les lieux imprégnés de magie et par les héros possédant des vestiges.</p>
      <p>Les Vestiges Spectraux les plus faibles apparaissent comme de simples silhouettes lumineuses, tandis que les plus puissants peuvent prendre forme solide et manipuler les éléments. Certains sont même capables d'imiter l'apparence et la voix du héros dont ils sont issus.</p>
      <p>La méthode la plus efficace pour les vaincre est d'utiliser des armes enchantées avec de la magie anti-vestige, ou de faire appel à un héros possédant un vestige particulièrement puissant ou antagoniste à la nature du spectre.</p>
    `,
    relatedEntries: ['magic-corruption', 'vestige-incorporation']
  },
  {
    id: 'magic-soul-binding',
    categoryId: 'magic',
    title: 'Magie de Liaison d\'Âme',
    summary: 'L\'art ancien de connecter son âme à un vestige.',
    discoveredDate: new Date(2024, 3, 25),
    image: '🔮',
    content: `
      <p>La Liaison d'Âme est une discipline magique qui s'intéresse à la connexion entre les vestiges et ceux qui les incorporent. C'est à la fois une science et un art mystique, pratiqué principalement par les Liants d'Âme de l'Académie de Vestifall.</p>
      <p>La théorie fondamentale de cette pratique stipule que chaque âme possède une "signature" unique qui peut entrer en résonance avec certains types de vestiges. Un bon Liant d'Âme peut déterminer la compatibilité entre un héros et un vestige avant même la tentative d'incorporation.</p>
      <p>Les techniques avancées de Liaison d'Âme permettent également de stabiliser des vestiges instables, de renforcer les liens avec des vestiges déjà incorporés, et même de faciliter la création de nouveaux vestiges plus puissants lors de la mort d'un héros.</p>
      <p>Certains Liants d'Âme particulièrement talentueux prétendent pouvoir communiquer directement avec l'essence originale présente dans un vestige, bien que ces affirmations restent controversées dans la communauté académique.</p>
    `,
    relatedEntries: ['vestige-incorporation', 'characters-soul-binders']
  }
]);

// Filtrer les entrées selon la catégorie et la recherche
const filteredEntries = computed(() => {
  let entries = allEntries.value;
  
  // Filtre par catégorie
  if (currentCategory.value !== 'all') {
    entries = entries.filter(entry => entry.categoryId === currentCategory.value);
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    entries = entries.filter(entry => 
      entry.title.toLowerCase().includes(query) || 
      entry.summary.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query)
    );
  }
  
  return entries;
});

// Compter les entrées par catégorie
function getEntryCount(categoryId: string): number {
  return allEntries.value.filter(entry => entry.categoryId === categoryId).length;
}

// Obtenir le nom d'une catégorie
function getCategoryName(categoryId: string): string {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : '';
}

// Sélectionner une entrée
function selectEntry(entry: CodexEntry): void {
  currentEntry.value = entry;
}

// Sélectionner une entrée par son ID
function selectEntryById(entryId: string): void {
  const entry = allEntries.value.find(e => e.id === entryId);
  if (entry) {
    currentCategory.value = entry.categoryId;
    currentEntry.value = entry;
  }
}

// Obtenir le titre d'une entrée par son ID
function getEntryTitle(entryId: string): string {
  const entry = allEntries.value.find(e => e.id === entryId);
  return entry ? entry.title : 'Entrée inconnue';
}

// Formater une date
function formatDate(date: Date): string {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.codex-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.codex-content {
  flex: 1;
  display: grid;
  grid-template-columns: 200px 300px 1fr;
  gap: 15px;
  height: calc(100% - 40px);
}

/* Catégories */
.codex-categories {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.category-item {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item:hover {
  background-color: #f5f5f5;
}

.category-item.active {
  background-color: #e6f7ff;
  border-right: 3px solid #1890ff;
}

.category-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.category-name {
  flex: 1;
}

.entry-count {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.8rem;
  color: #666;
}

/* Liste des entrées */
.codex-entries {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 30px 8px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}

.entries-list {
  flex: 1;
  overflow-y: auto;
}

.entry-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.entry-item:hover {
  background-color: #f5f5f5;
}

.entry-item.active {
  background-color: #e6f7ff;
}

.entry-title {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #1890ff;
}

.entry-summary {
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-clamp: 2;
}

.no-entries {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

/* Détail de l'entrée */
.codex-detail {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
}

.entry-detail h2 {
  margin-top: 0;
  color: #1890ff;
}

.entry-metadata {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}

.entry-content {
  line-height: 1.6;
}

.entry-image {
  float: right;
  margin: 0 0 15px 15px;
}

.image-placeholder {
  width: 150px;
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border-radius: 8px;
}

.entry-text {
  text-align: justify;
}

.related-entries {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.related-entries h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.related-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.related-link {
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #1890ff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.related-link:hover {
  background-color: #e6f7ff;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
  text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .codex-content {
    grid-template-columns: 120px 220px 1fr;
  }
  
  .category-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .codex-content {
    display: flex;
    flex-direction: column;
    height: auto;
  }
  
  .codex-categories {
    display: flex;
    overflow-x: auto;
    height: auto;
  }
  
  .category-item {
    flex-direction: column;
    padding: 10px;
    border-bottom: none;
    border-right: 1px solid #f0f0f0;
  }
  
  .category-icon {
    margin-right: 0;
    margin-bottom: 5px;
  }
  
  .codex-entries, .codex-detail {
    height: 300px;
  }
}
</style>