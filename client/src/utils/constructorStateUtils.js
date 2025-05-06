import {
    fetchBTypes,
    fetchBVariants,
    fetchBAttributesByVariant,
    fetchBAttributeVals,
  } from "../http/bConstructorAPI";
  
  // Сохранение состояния конструктора в JSON
  export const downloadConstructorState = (constructorStore) => {
    const data = {
      typeId: constructorStore.selectedBType?.id || null,
      variantId: constructorStore.selectedVariant?.id || null,
      attributes: constructorStore.selectedAttributes.map(({ attribute, value }) => ({
        attributeId: attribute.id,
        valueId: value.id,
      })),
      smallSize: constructorStore.smallSizeEnabled || false,
    };
  
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-order.json";
    a.click();
  
    URL.revokeObjectURL(url);
  };
  
  // Загрузка состояния конструктора из JSON
  export const uploadConstructorState = async (file, constructorStore) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
  
          const [allTypes, allVariants] = await Promise.all([
            fetchBTypes(),
            fetchBVariants(),
          ]);
  
          const type = allTypes.find((t) => t.id === parsed.typeId);
          const variant = allVariants.find((v) => v.id === parsed.variantId);
  
          if (type) constructorStore.setType(type);
          if (variant) constructorStore.setVariant(variant);
          if (typeof parsed.smallSize === "boolean") constructorStore.setSmallSize(parsed.smallSize);
  
          const attrs = await fetchBAttributesByVariant(parsed.variantId);
          const attrVals = await Promise.all(attrs.map((attr) => fetchBAttributeVals(attr.id)));
  
          parsed.attributes.forEach(({ attributeId, valueId }) => {
            const attr = attrs.find((a) => a.id === attributeId);
            const vals = attrVals.find((list) => list?.[0]?.bAttributeId === attributeId) || [];
            const val = vals.find((v) => v.id === valueId);
            if (attr && val) constructorStore.addAttributeValue(attr, val);
          });
  
          resolve();
        } catch (err) {
          reject(err);
        }
      };
  
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  export const uploadConstructorStateFromJson = async (json, constructorStore) => {
    const [allTypes, allVariants] = await Promise.all([
      fetchBTypes(),
      fetchBVariants()
    ]);
  
    const type = allTypes.find(t => t.id === json.typeId);
    const variant = allVariants.find(v => v.id === json.variantId);
  
    constructorStore.setType(type);
    constructorStore.setVariant(variant);
    constructorStore.setSmallSize(json.smallSize);
  
    const attrs = await fetchBAttributesByVariant(variant.id);
    const attrVals = await Promise.all(attrs.map(attr => fetchBAttributeVals(attr.id)));
  
    json.attributes.forEach(({ attributeId, valueId }) => {
      const attr = attrs.find(a => a.id === attributeId);
      const vals = attrVals.find(list => list[0]?.bAttributeId === attributeId) || [];
      const val = vals.find(v => v.id === valueId);
      if (attr && val) constructorStore.addAttributeValue(attr, val);
    });
  };
  
  