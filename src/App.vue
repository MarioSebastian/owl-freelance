<template>
  <div id="app">
    <div class="m-3">
      <div class="row justify-content-center">
        <div class="col-3 text-center">
          <h5>Ip Address Fingerprint</h5>
          <input
              type="text"
              class="form-control"
              v-model="ipAddress"
          />
          <br/>
          <button class="btn btn-success" @click="getAbsensi()">Tarik Absensi</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      ipAddress: '127.0.0.1',
      users: [
        {
          userId: '123456',
          name: 'Test User'
        },
        {
          userId: '11111',
          name: 'Test User 1'
        },
        {
          userId: '222222',
          name: 'Test User 2'
        }
      ]
    };
  },
  mounted() {
  },
  computed: {

  },
  created: {
    //syncron waktu dengan mesin
    //tarik user dari database (assumsikan 'users' adalah data yang kembali dari server)
    //tarik user dari fingerprint
    //if( user dari database ada yang baru ) send add new fingerprint to fingerprint
    //else if (user dari database ada yng hilang ) send delete user ke fingerprint
  },
  methods: {
    getAbsensi(){
      //tarik absensi dari mesin
      axios.get(this.ipAddress)

    }
  }
};
</script>
