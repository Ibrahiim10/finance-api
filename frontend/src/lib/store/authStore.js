import { create } from 'zustand';
import { persist } from 'zustand/middleware';




const useAuthStore = create(

    persist(

        (set, get) => ({

            user: null,
            token: null,
            isAuthenticated: false,


            // Set user and token after successfully login

            setAuth: (userData, token) => set({

                user: userData,
                token: token,
                isAuthenticated: true,
            }),

            // Clear user and token after logout

            clearAuth: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),

            // Get token (for outside of React components)

            getToken: () => get().token,
            
        }),

        {
            name: 'auth-storage', // name of the item in storage
            partialize: (state) => ({ 
                token: state.token, 
                user: state.user, 
                isAuthenticated: state.isAuthenticated 
            }), // only persist token and user
        }
    )
)


// export the store hook
export default useAuthStore;