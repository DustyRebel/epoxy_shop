import { makeAutoObservable } from "mobx";

export default class ConstructorStore {
  constructor() {
    this._bTypes = [];
    this._selectedBType = null;
    this._selectedVariant = null;
    this._selectedAttributes = []; // [{ attribute, value }]
    this._price = 0;
    this._smallSizeEnabled = false;
    makeAutoObservable(this);
  }

  setType(type) {
    this._selectedBType = type;
    this.reset();
  }

  setBTypes(types) {
    this._bTypes = types;
  }


  setVariant(variant) {
    this._selectedVariant = variant;
    this.updatePrice();
  }

  addAttributeValue(attribute, value) {
    console.log("Добавляем значение", value, "для атрибута", attribute);
  
    // Проверка: если у атрибута есть renderRole
    if (attribute.renderRole) {
      // Удаляем все выбранные атрибуты с тем же renderRole
      this._selectedAttributes = this._selectedAttributes.filter(
        a => a.attribute.renderRole !== attribute.renderRole
      );
    }
  
    // Добавляем новый или заменяем
    const existing = this._selectedAttributes.find(a => a.attribute.id === attribute.id);
    if (existing) {
      existing.value = value;
    } else {
      this._selectedAttributes.push({ attribute, value });
    }
  
    this.updatePrice();
  }

  removeAttribute(attributeId) {
    this._selectedAttributes = this._selectedAttributes.filter(a => a.attribute.id !== attributeId);
    this.updatePrice();
  }

  updatePrice() {
    const base = this._selectedVariant?.price || 0;
    const addons = this._selectedAttributes.reduce(
      (sum, a) => sum + (a.value?.price || 0),
      0
    );
    let total = base + addons;
  
    if (this._smallSizeEnabled) {
      total = Math.round(total * 0.9); // скидка 10%
    }

    if (this._selectedBType?.name === "Серьги") {
      total = Math.round(total * 2);
    }
  
    this._price = total;
  }

  reset() {
    this._selectedVariant = null;
    this._selectedAttributes = [];
    this._price = 0;
  }

  get selectedBType() {
    return this._selectedBType;
  }

  get selectedVariant() {
    return this._selectedVariant;
  }

  get selectedAttributes() {
    return this._selectedAttributes;
  }

  get totalPrice() {
    return this._price;
  }

  get bTypes() {
    return this._bTypes;
  }

  getSelectedVal(attributeId) {
    const selected = this.selectedAttributes.find(a => a.attribute.id === attributeId);
    return selected ? selected.value : null;
  }

  setSmallSize(value) {
    this._smallSizeEnabled = value;
    this.updatePrice();
  }
  
  get smallSizeEnabled() {
    return this._smallSizeEnabled;
  }

}

