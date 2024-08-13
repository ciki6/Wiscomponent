import { BaseProperty, PropertyDictionaryItem } from "../types/property";

type Callback = (path: string, value: any) => void;

class PropertyManager {
  private property: BaseProperty;
  private propertyDic: PropertyDictionaryItem[];
  private callbacks: Callback[] = [];

  constructor(initialProperty: BaseProperty, initialPropertyDic: PropertyDictionaryItem[]) {
    // 确保 property 中的 basic 属性存在
    if (!initialProperty.basic) {
      throw new Error("The 'basic' property is required.");
    }
    this.property = this.createProxy(initialProperty);
    this.propertyDic = initialPropertyDic; // 使用传入的属性字典或空对象
  }

  private createProxy(target: any, path: string[] = []): any {
    const self = this;

    return new Proxy(target, {
      get(target, key) {
        const prop = Reflect.get(target, key);
        if (typeof prop === "object" && prop !== null) {
          return self.createProxy(prop, path.concat(String(key)));
        }
        return prop;
      },
      set(target, key, value) {
        const result = Reflect.set(target, key, value);
        if (result) {
          const fullPath = path.concat(String(key)).join(".");
          self.triggerCallbacks(fullPath, value);
        }
        return result;
      },
    });
  }

  private triggerCallbacks(path: string, value: any) {
    for (const callback of this.callbacks) {
      callback(path, value);
    }
  }

  public set(path: string, value: any) {
    const keys = path.split(".");
    let obj: any = this.property;
    while (keys.length > 1) {
      const key = keys.shift();
      if (key === undefined) {
        throw new Error(`Property ${key} does not exist on the object.`);
      } else {
        if (obj[key] === undefined) {
          throw new Error(`Property ${key} does not exist on the object.`);
        }
        obj = obj[key];
      }
    }
    obj[keys[0]] = value;
    console.log(this.property, "propertyManager");
  }

  public addProperty(property: any, propertyDic?: PropertyDictionaryItem[]) {
    this.property = this.createProxy({ ...this.property, ...property });
    if (propertyDic) {
      this.propertyDic = [...this.propertyDic, ...propertyDic];
    }
  }

  public getProperty(path: string): any {
    const keys = path.split(".");
    let obj = this.property;
    for (const key of keys) {
      if (obj[key] === undefined) {
        return undefined;
      }
      obj = obj[key];
    }
    return obj;
  }

  public onPropertyChange(callback: Callback) {
    this.callbacks.push(callback);
  }

  public getPropertyDictionary(): PropertyDictionaryItem[] {
    return this.propertyDic;
  }

  public getPropertyList(): BaseProperty {
    return this.property;
  }
}

export default PropertyManager;
