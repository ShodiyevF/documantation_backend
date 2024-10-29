import app from './app'

import projects from './module/projects/projects.index'
import auth from './module/auth/auth.index'
import apis from './module/apis/apis.index'

app([auth, projects, apis]);