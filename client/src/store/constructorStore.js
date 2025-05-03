import { makeAutoObservable } from "mobx";

export default class ConstructorStore {
  constructor() {
    this._selectedType = null;
    this._selectedVariant = null;
    this._selectedAttributes = []; // [{ attribute, value }]
    this._price = 0;
    makeAutoObservable(this);
  }

  setType(type) {
    this._selectedType = type;
    this.reset();
  }

  setVariant(variant) {
    this._selectedVariant = variant;
    this.updatePrice();
  }

  addAttributeValue(attribute, value) {
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
    this._price = base + addons;
  }

  reset() {
    this._selectedVariant = null;
    this._selectedAttributes = [];
    this._price = 0;
  }

  get selectedType() {
    return this._selectedType;
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

  getSelectedVal(attributeId) {
    const selected = this.selectedAttributes.find(a => a.attribute.id === attributeId);
    return selected ? selected.value : null;
  }
}

