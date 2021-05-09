<template>
  <div class="container">
    <div class="d-flex justify-content-center">
      <div class="vue-tempalte">
          <form @submit="onSubmitLogin">
              <h3>Sign In</h3>

              <div v-if="errors.length">
                  <b>Please correct the following error(s):</b>
                  <div class="alert alert-danger" role="alert" v-for="(error, index) in errors" :key="index">{{ error }}</div>
              </div>

              <div class="form-group">
                  <label>Email address</label>
                  <input type="email" class="form-control form-control-lg" v-model="email" />
              </div>

              <div class="form-group">
                  <label>Password</label>
                  <input type="password" class="form-control form-control-lg" v-model="password" />
              </div>

              <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

          </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
      email: null,
      password: null,
    };
  },
  methods: {
    onSubmitLogin: function (e) {
      e.preventDefault();
      this.errors = [];

      if (!this.email) {
        this.errors.push("Email required.");
        return;
      }
      if (!this.password) {
        this.errors.push("Password required.");
        return;
      }
      var credentials = new FormData();
      credentials.set('email', this.email);
      credentials.set('password', this.password);
      axios({
          url: '/api/login',
          method: 'post',
          data: credentials,
          headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(resp => {
          localStorage.setItem('token',resp.data.access_token);
          localStorage.setItem('expiry',resp.data.expires_in);
          this.$router.push({name:"todos"});
      }).catch(res => {
          localStorage.removeItem('token');
          this.errors = [];
          this.errors.push("Login failed");
      });
      
    },
  },
};
</script>