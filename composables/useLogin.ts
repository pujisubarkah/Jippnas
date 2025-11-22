import { ref } from 'vue';

export function useLogin() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const user = ref<any>(null);

  async function handleLogin({ username, email, password }: { username?: string; email?: string; password: string }) {
    loading.value = true;
    error.value = null;
    user.value = null;
    try {
      const res: { success?: boolean; user?: any; error?: string } = await ($fetch as any)('/api/login', {
        method: 'POST',
        body: { username, email, password },
      });
      if (res.success) {
        user.value = res.user;
      } else {
        error.value = res.error || 'Login gagal';
      }
    } catch (e: any) {
      error.value = e?.message || 'Terjadi kesalahan';
    } finally {
      loading.value = false;
    }
  }

  return { handleLogin, loading, error, user };
}
