<template>
    <div class="container">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <h1>Todo App</h1>
                </div>
                <ul class="nav navbar-nav">
                    <li class="pull-right"><button class="btn btn-secondary" @click="signout()">Signout</button></li>
                </ul>
            </div>
        </nav>
        
        <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <div class="alert alert-danger" role="alert" v-for="(error, index) in errors" :key="index">{{ error }}</div>
        </div>

        <div class="row">
            <div class="col">
                <div v-if="!isEditing">
                    <div class="form-group">
                        <input type="text" class="form-control" v-model="title" placeholder="Title">
                    </div>
                    <div class="form-group">
                        <textarea v-model="description" class="form-control" placeholder="Description"></textarea>
                    </div>
                    <button type="button" @click="storeTodo" class="btn btn-success">Add</button>
                </div>
                <div v-else>
                    <div class="form-group">
                        <input type="text" class="form-control" v-model="title">
                    </div>
                    <div class="form-group">
                        <textarea v-model="description" class="form-control"></textarea>
                    </div>
                    <button type="button" @click="updateTodo" class="btn btn-success">Update</button>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="search-container">
                    <form @submit="searchsubmitted">
                        <input type="text" placeholder="Search.." name="search" v-model="search">
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </form>
                </div>
                <ol class="list-group">
                    <li v-for="todo in todos" :key="todo.id" class="list-group-item">
                        {{ todo.title }}
                        <span class="badge">
                            <button @click="editTodo(todo.id, todo)" type="button"  class="btn btn-primary btn-sm">Edit</button>
                            <button @click="removeTodo(todo.id)" type="button"  class="btn btn-danger btn-sm">Delete</button>
                        </span>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            isEditing: false,
            title: '',
            description: '',
            todos: [],
            selectedTodo: null,
            errors: [],
            search: '',
        };
    },
    created(){
        this.getTodos();
    },
    methods: {
        searchsubmitted(e){
            e.preventDefault();
            this.getTodos();
        },
        signout(){
            localStorage.removeItem('token');
            this.$router.push({name:"login"});
        },
        editTodo(id, todo){
            this.isEditing = true;
            this.title = todo.title;
            this.description = todo.description;
            this.selectedTodo = id;
        },
        updateTodo(){
            this.errors = [];

            if (!this.title) {
                this.errors.push("Title required.");
                return;
            }
            if (!this.description) {
                this.errors.push("Description required.");
                return;
            }

            var credentials = new FormData();
            credentials.set('title', this.title);
            credentials.set('description', this.description);
            axios({
                url: `/api/update_task/${this.selectedTodo}`,
                method: 'post',
                data: credentials,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(resp => {
                this.title = '';
                this.description = '';
                this.selectedTodo = null;
                this.isEditing = false;
                this.getTodos();
            }).catch(err => {
                if(err.response.status == 400){
                    const servererrors = err.response.data.errors;
                    servererrors.map(ele => {
                        this.errors.push(ele);
                    })
                }
            });
        },
        getTodos(){
            let url = '/api/task';
            if(this.search.length > 1){
                url += '?q=' + encodeURIComponent(this.search);
            }
            axios({
                url: url,
                method: 'get',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(resp => {
                this.todos = resp.data;
            })
            .catch(err => {
                localStorage.removeItem('token');
                this.$router.push({name: "login"});
            });
        },
        removeTodo(task_id) {
            axios({
                url: `/api/task/${task_id}`,
                method: 'delete',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(resp => {
                this.getTodos();
            }).catch(err => {
                if(err.response.status == 400){
                    const servererrors = err.response.data.errors;
                    servererrors.map(ele => {
                        this.errors.push(ele);
                    })
                }
            });
        },
        storeTodo() {
            this.errors = [];

            if (!this.title) {
                this.errors.push("Title required.");
                return;
            }
            if (!this.description) {
                this.errors.push("Description required.");
                return;
            }

            var credentials = new FormData();
            credentials.set('title', this.title);
            credentials.set('description', this.description);
            axios({
                url: '/api/task',
                method: 'post',
                data: credentials,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(resp => {
                this.title = '';
                this.description = '';
                this.getTodos();
            }).catch(err => {
                this.errors.push("Unable to add todo");
                if(err.response.status == 422){
                    const servererrors = err.response.data.errors;
                    servererrors.map(ele => {
                        this.errors.push(ele);
                    })
                }
            });
        },
    }
}
</script>