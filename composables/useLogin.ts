import { ref } from 'vue';
import { useAuth } from './useAuth';

export function useLogin() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const user = ref<any>(null);
  const { login } = useAuth();

  async function handleLogin({ username, email, password }: { username?: string; email?: string; password: string }) {
    console.log('🔐 Login attempt:', { username, email, password: '***' });
    loading.value = true;
    error.value = null;
    user.value = null;
    try {
      const res: { success?: boolean; user?: any; role?: string; redirectPath?: string; error?: string } = await ($fetch as any)('/api/login', {
        method: 'POST',
        body: { username, email, password },
      });
      console.log('📡 API Response:', res);
      
      if (res.success && res.user) {
        // Merge role and redirectPath into user object
        const userData = { ...res.user, role: res.role, redirectPath: res.redirectPath };
        console.log('✅ Login successful, userData:', userData);
        user.value = userData;
        login(userData); // Save to localStorage via useAuth
        console.log('💾 Session saved to localStorage');
      } else {
        console.error('❌ Login failed:', res.error);
        error.value = res.error || 'Login gagal';
      }
    } catch (e: any) {
      console.error('🔥 Login error exception:', e);
      error.value = e?.message || 'Terjadi kesalahan';
    } finally {
      loading.value = false;
      console.log('🏁 Login process completed. Loading:', loading.value);
    }
  }

  return { handleLogin, loading, error, user };
}
