import { api } from 'src/boot/axios';

export async function obtenerProvincias() {
  const resp = await api.get('/v1/nomenclador/provincia');
  console.log(resp);
  return resp;
}
