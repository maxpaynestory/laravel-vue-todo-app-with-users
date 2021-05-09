<template>
    <div class="container">
        <div class="d-flex justify-content-center">
            <div class="vue-tempalte">
                <form @submit="onSubmitRegisterForm">
                    <h3>Register</h3>

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

                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" class="form-control form-control-lg" v-model="password_confirmation" />
                    </div>

                    <button type="submit" class="btn btn-dark btn-lg btn-block">Register</button>
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
                password_confirmation: null,
            };
        },
        methods: {
            onSubmitRegisterForm: function (e) {
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

                if (this.password !== this.password_confirmation) {
                    this.errors.push("Please confirm password");
                    return;
                }

                var credentials = new FormData();
                credentials.set('email', this.email);
                credentials.set('password', this.password);
                credentials.set('password_confirmation', this.password_confirmation);
                axios({
                    url: '/api/register',
                    method: 'post',
                    data: credentials,
                    headers: {'Content-Type': 'multipart/form-data' }
                })
                .then(resp => {
                    localStorage.setItem('token',resp.data.access_token);
                    localStorage.setItem('expiry',resp.data.expires_in);
                    this.$router.push({name:"todos"});
                }).catch(err => {
                    this.errors = [];
                    this.errors.push("Registration Failed");
                    if(err.response.status == 422){
                        const servererrors = err.response.data.errors;
                        servererrors.map(ele => {
                            this.errors.push(ele);
                        })
                    }
                });
            }
        }
    }
</script>