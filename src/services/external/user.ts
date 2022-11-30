import { api } from 'src/boot/axios';

export async function register() {
  const data = {
    role: 'ADMIN_ROLE',
    secret: 'clave',
    username: 'usuario2',
  };
  const resp = await api.post('/auth/user/register', data);
  console.log(resp);
}
