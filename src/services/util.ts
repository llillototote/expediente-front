import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { permisionsRoutesApp } from 'src/config/permisos';
import { Mask } from './external/utilDTO';

export function prepareToSelect<T>(
  collection: T[],
  label: keyof T,
  value: keyof T
): SelectField[] {
  const res: SelectField[] = [];
  collection.forEach((elem) => {
    res.push({ value: elem[value], label: elem[label] });
  });
  return res;
}

export function prepareDataToTabla(
  array: any[],
  actions = false,
  hide: string[]
) {
  const columns: any[] = [];
  let data = array;
  if (array.length > 0) {
    Object.keys(array[0]).forEach((key, pos) => {
      if (pos == 0) {
        columns.push({
          name: key,
          required: true,
          label: key,
          align: alinearColumna(array[0][key]),
          field: key, //(row:any)=>row[key],
          format: (val: any) => `${val}`,
          sortable: true,
          classes: !hide.includes(key) ? '' : 'hidden',
          headerClasses: !hide.includes(key) ? '' : 'hidden',
        });
      } else {
        columns.push({
          name: key,
          label: key,
          align: alinearColumna(array[0][key]),
          field: key,
          sortable: true,
          classes: !hide.includes(key) ? '' : 'hidden',
          headerClasses: !hide.includes(key) ? '' : 'hidden',
        });
      }
    });
  }
  if (actions) {
    columns.push({
      name: 'actions',
      required: true,
      label: 'OPCIONES',
      align: 'center',
      field: 'actions',
      sortable: false,
    });

    data = data.map((item: any) => {
      return { ...item, actions: true };
    });
  }
  return { columns, data };
}

function alinearColumna(valor: any) {
  switch (typeof valor) {
    case 'string':
      return 'left';
      break;
    case 'number':
      return 'right';
      break;
    case 'boolean':
      return 'center';
      break;

    default:
      return 'left';
      break;
  }
  typeof valor;
}

export function preloadResponseExternal<T>(response: any): ResponseExternal<T> {
  console.log('response');
  console.log(response);
  if (response.data) {
    return {
      payload: response.data,
      status: response.status,
    } as ResponseExternal<T>;
  } else if (response.status == 204) {
    return {
      payload: response.data,
      status: response.status,
    } as ResponseExternal<T>;
  } else if (response.response) {
    if (response.response.data) {
      return {
        payload: null,
        status: response.response.status,
        error:
          typeof response.response.data === 'string'
            ? response.response.data
            : response.response.data?.message,
      } as ResponseExternal<T>;
    } else
      return {
        payload: null,
        status: response.response.status,
        error: response.message,
      } as ResponseExternal<T>;
  }
  return {
    payload: null,
    status: 0,
    error: 'error no controlado',
  } as ResponseExternal<T>;
}

export function maskObject<T>(obj: T, mask: Mask<T>) {
  let objnew = {};
  Object.keys(mask).forEach((keyMask) => {
    objnew = { ...objnew, [mask[keyMask]]: obj[keyMask] };
  });
  return objnew;
}

export function revisarPermisosRouter(route: string, permises: any[]): boolean {
  console.log('route', route);
  console.log('permises', permises);
  return verifyHavePermisionsRoutesApp(route, permises);
}

function verifyHavePermisionsRoutesApp(
  route: string,
  permises: string[]
): boolean {
  const finded = permisionsRoutesApp.find((it) => it.routename == route);
  if (finded) {
    let flag = true;
    finded.dependencies.forEach((per) => {
      if (!permises.includes(per)) {
        flag = false;
      }
    });
    return flag;
  } else return true;
}
