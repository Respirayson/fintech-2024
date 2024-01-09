import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

const mountRoutes = (app) => {
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/auth', authRoutes)
}

export default mountRoutes;