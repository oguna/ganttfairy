<template>
  <div class="users">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstname }}</td>
            <td>{{ user.lastname }}</td>
            <td>{{ user.mail }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { User } from "../types";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  computed: {
    users(): User[] {
      return this.$store.state.users.items;
    },
  },
});
</script>