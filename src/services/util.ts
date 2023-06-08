import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { permisionsRoutesApp } from 'src/config/permisos';
import { CODES } from './external/permisionDTO';

export function prepareToSelect(
  collection: any[],
  label: string,
  value: string
): SelectField[] {
  const res: SelectField[] = [];
  collection.forEach((elem) => {
    res.push({ value: elem[value], label: elem[label] });
  });
  return res;
}

export function prepareDataToTabla(array: any[], actions = false, hide: string[]) {
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
          classes: (!hide.includes(key)) ? '' : 'hidden',
          headerClasses: (!hide.includes(key)) ? '' : 'hidden',
        });
      } else {

        columns.push({
          name: key,
          label: key,
          align: alinearColumna(array[0][key]),
          field: key,
          sortable: true,
          classes: (!hide.includes(key)) ? '' : 'hidden',
          headerClasses: (!hide.includes(key)) ? '' : 'hidden',
        });
      }


    });
  }
  if (actions) {
    columns.push({
      name: 'actions',
      required: true,
      label: 'opciones',
      align: 'center',
      field: 'actions',
      sortable: false,
    });

    data = data.map((item: any) => { return { ...item, actions: true } })
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
  if (response.data) {
    return {
      payload: response.data,
      status: response.status
    } as ResponseExternal<T>

  } else if (response.response) {
    console.log('response')
    console.log(response.response)
    if (response.response.data) {
      return {
        payload: null,
        status: response.response.status,
        error: (typeof response.response.data === 'string') ? response.response.data : response.response.data?.message
      } as ResponseExternal<T>
    } else
      return {
        payload: null,
        status: response.response.status,
        error: response.message
      } as ResponseExternal<T>
  }
  return {
    payload: null,
    status: 0,
    error: 'error no controlado'
  } as ResponseExternal<T>
}


export function maskObject(obj: any, mask: any) {
  let objnew = {}
  Object.keys(mask).forEach(keyMask => {
    objnew = { ...objnew, [mask[keyMask]]: obj[keyMask] }
  });
  return objnew
}

export function revisarPermisosRouter(route: string, permises: any[]): boolean {
  return verifyHavePermisionsRoutesApp(route, permises);
}

function verifyHavePermisionsRoutesApp(route: string, permises: CODES[]): boolean {
  const finded = permisionsRoutesApp.find(it => it.routename == route)
  if (finded) {
    let flag = true
    finded.dependencies.forEach(per => {
      if (!permises.includes(per)) {
        flag = false
      }
    })
    return flag
  } else return true
}