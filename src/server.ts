import app from './app'

import projects from './module/projects/projects.index'
import users from './module/users/users.index'
import auth from './module/auth/auth.index'
import apis from './module/apis/apis.index'

app([auth, projects, apis, users]);