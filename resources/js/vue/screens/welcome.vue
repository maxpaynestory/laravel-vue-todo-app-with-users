<template>
    <div class="container">
        <div class="d-flex justify-content-center">
            <div class="welcome-box">
                <div class="row">
                    <div class="col">
                        <h1>Welcome to Vue Todo App</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center">
                        <router-link to="/login" class="btn btn-primary">To Login</router-link>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center">
                        <router-link to="/register" class="btn btn-secondary">To Register</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>