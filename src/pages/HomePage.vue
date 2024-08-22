<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-sm-8"><q-card v-for="post in posts" :key="post.id" class="card-post q-mb-md" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://gravatar.com/userimage/253109897/f6275a84592080532215fc48abb9f140.jpeg?size=256">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">zakariae_azn</q-item-label>
              <q-item-label caption>
                {{ post.location }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-img :src="post.imageURL" />
          <q-card-section>
            <div>{{ post.caption }}</div>
            <div class="text-caption text-grey">{{ formatDate(post.date) }}</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="left">
            <q-btn flat round dense icon="eva-heart-outline" />
            <q-btn flat round dense icon="eva-message-circle-outline" />
            <q-btn flat round dense icon="eva-navigation-2-outline" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-4 large-screen-only"><q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://gravatar.com/userimage/253109897/f6275a84592080532215fc48abb9f140.jpeg?size=256">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">zak__azn</q-item-label>
            <q-item-label caption>
              Zakariae Azarkan
            </q-item-label>
          </q-item-section>
        </q-item></div>
    </div>
  </q-page>
</template>

<script setup>
import { date } from 'quasar';
import { ref } from 'vue';

defineOptions({
  name: "PageHome",
});


const posts = ref([
  { id: 1, caption: 'First Post', date: '1722127720909', location: 'Venice, Italy', imageURL: 'https://i.pinimg.com/564x/37/f5/aa/37f5aa9f92fce7d0775d3929a00c0757.jpg' },
  { id: 2, caption: 'Second Post', date: '1722127720909', location: 'Greece', imageURL: 'https://www.goldenhaven.com.ph/wp-content/uploads/2023/03/nueva-vizcaya-1.jpg' },
  { id: 3, caption: 'Third Post', date: '1722127720909', location: 'Warsaw, Poland', imageURL: 'https://i.pinimg.com/564x/f6/bd/26/f6bd268910f21ce58aa331c5cd4fac80.jpg' }
]);

const formatDate = (timestamp) => {
  const dateObj = new Date(parseInt(timestamp));
  return date.formatDate(dateObj, 'MMMM D h:mmA');
};
</script>


<style lang="sass">
.card-post
  .q-img
    min-height: 200px

.post-icons
  display: flex
  justify-content: start
  align-items: center

  q-icon
    font-size: 24px
    cursor: pointer
</style>