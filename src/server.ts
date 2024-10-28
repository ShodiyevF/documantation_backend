import app from './app'

import projects from './module/projects/projects.index'
import auth from './module/auth/auth.index'

app([auth, projects]);