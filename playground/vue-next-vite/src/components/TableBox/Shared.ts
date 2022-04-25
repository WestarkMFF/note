import { onMounted, getCurrentInstance } from 'vue';

/**
 * 存放 table 实例的 store，用完销毁
 */
const store: { [name: string]: any } = {};

/**
 * 写入 table 实例
 * @param key
 */
export function setTableInstance(key: string) {
  onMounted(() => {
    store[key] = getCurrentInstance();
  });
}

/**
 * 返回 table 实例
 * @param key
 * @returns tableInstance
 */

export function getTableInstance(key: string) {
  return new Promise(resolve => {
    if (store[key] && store[key].exposed) {
      resolve(store[key].exposed);
    }
    onMounted(() => {
      console.log('store', store[key]);
      resolve(store[key].exposed);
    });
  });
}

export function deleteTableInstance(key: string) {
  if (!store[key]) return;
  delete store[key];
}

/**
 * hasOwnProperty 封装函数
 * @param obj
 * @param key
 * @returns
 */
export function hasOwn(obj: any, key: string) {
  if (!obj) return null;
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Array => Object 数组根据一个key转换成对象
 * @param arr
 * @param key
 */
export function arr2Obj(arr: Array<{ [name: string]: any }>, key: string | number) {
  const obj: { [name: typeof key]: any } = {};

  arr.forEach(item => {
    if (item[key]) obj[item[key]] = item;
  });

  return obj;
}

/**
 * 模糊搜索
 * @param data
 * @param key
 * @returns
 */
export function FuzzyFilterForTableBox(DataAndCols: any, key: string = '') {
  const { data, columns: cols, _originData } = DataAndCols;
  const result: Array<any> = [];

  if (!Array.isArray(data)) {
    console.warn(`Method: FuzzyFilter params wrong, type Array expected but got ${typeof data}`);
    return [];
  }

  const logicFilterKey = key.toLowerCase();

  if (!logicFilterKey) {
    return _originData; // originData, 不要动这个数据
  }

  const objCols = arr2Obj(cols, 'dataIndex');

  for (let dataItem of _originData as Array<any>) {
    for (let dataItemKey in dataItem) {
      if (hasOwn(objCols, dataItemKey)) {
        let source = dataItem[dataItemKey].toString().toLowerCase();
        if (hasOwn(objCols[dataItemKey], 'formatter')) {
          source = objCols[dataItemKey].formatter({ record: dataItem }).toString().toLowerCase();
        }

        if (source.includes(logicFilterKey)) {
          result.push(dataItem);
          break;
        }
      }
    }
  }

  return result;
}
/**
 * 从路径中拿到文件名 './plugins/FuzzyFilter.vue' => FuzzyFilter
 * @param path 路径
 * @returns
 */
export function getFileNameFromPath(path: string): string {
  const pos1 = path.lastIndexOf('/');
  const pos2 = path.lastIndexOf('\\');
  const pos = Math.max(pos1, pos2);
  if (pos < 0) {
    return path;
  } else {
    let tempPath = path.substring(pos + 1);
    return tempPath.substring(0, tempPath.lastIndexOf('.'));
  }
}
