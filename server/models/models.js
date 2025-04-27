const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const CartItem = sequelize.define('cart_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
})

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    //img: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Color = sequelize.define('color', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    review: {type: DataTypes.STRING, allowNull: true},
})

const ItemInfo = sequelize.define('item_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

//const TypeBrand = sequelize.define('type_brand', {
//    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//})

const Shipping = sequelize.define('shipping', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const ShopImg = sequelize.define('shop_img', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    link: {type: DataTypes.STRING, allowNull: false},
})

const Checkout = sequelize.define('checkout', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    tg: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
})

const GalleryItem = sequelize.define('gallery_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const GalleryImg = sequelize.define('gallery_img', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    link: {type: DataTypes.STRING, allowNull: false},
})

const BCheckout = sequelize.define('b_checkout', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    tg: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
})

const BCart = sequelize.define('b_cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BCartItem = sequelize.define('b_cart_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BType = sequelize.define('b_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const BVariant = sequelize.define('b_variant', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    availability: {type: DataTypes.BOOLEAN, allowNull: false},
})

const BAttribute = sequelize.define('b_attribute', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const BAttributeVal = sequelize.define('b_attribute_val', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    availability: {type: DataTypes.BOOLEAN, allowNull: false},
})

const CheckoutItem = sequelize.define('checkout_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Cart.hasMany(CartItem)
CartItem.belongsTo(Cart)

Type.hasMany(Item)
Item.belongsTo(Type)

Color.hasMany(Item)
Item.belongsTo(Color)

Item.hasMany(Rating)
Rating.belongsTo(Item)

Item.hasMany(CartItem)
CartItem.belongsTo(Item)

Item.hasMany(ItemInfo, {as: 'info'});
ItemInfo.belongsTo(Item)

//Type.belongsToMany(Brand, {through: TypeBrand })
//Brand.belongsToMany(Type, {through: TypeBrand })

Item.hasMany(ShopImg)
ShopImg.belongsTo(Item)

Cart.hasOne(Checkout)
Checkout.belongsTo(Cart)

User.hasMany(Checkout)
Checkout.belongsTo(User)

Type.hasMany(GalleryItem)
GalleryItem.belongsTo(Type)

Color.hasMany(GalleryItem)
GalleryItem.belongsTo(Color)

GalleryItem.hasMany(GalleryImg)
GalleryImg.belongsTo(GalleryItem)

Shipping.hasMany(Checkout)
Checkout.belongsTo(Shipping)

Shipping.hasMany(BCheckout)
BCheckout.belongsTo(Shipping)

User.hasMany(BCheckout)
BCheckout.belongsTo(User)

User.hasOne(BCart)
BCart.belongsTo(User)

BCart.hasOne(BCheckout)
BCheckout.belongsTo(BCart)

BCart.hasMany(BCartItem)
BCartItem.belongsTo(BCart)

BVariant.hasMany(BCart)
BCart.belongsTo(BVariant)

BType.hasMany(BVariant)
BVariant.belongsTo(BType)

BAttribute.hasMany(BCartItem)
BCartItem.belongsTo(BAttribute)

BAttributeVal.hasMany(BCartItem)
BCartItem.belongsTo(BAttributeVal)

BAttribute.hasMany(BAttributeVal)
BAttributeVal.belongsTo(BAttribute)

BVariant.hasMany(BAttribute)
BAttribute.belongsTo(BVariant)


Checkout.hasMany(CheckoutItem);
CheckoutItem.belongsTo(Checkout);

Item.hasMany(CheckoutItem);
CheckoutItem.belongsTo(Item);


module.exports = {
    User,
    Cart,
    CartItem,
    Item,
    Type,
    Color,
    Rating,
    ItemInfo,
    Shipping,
    ShopImg,
    Checkout,
    GalleryItem,
    GalleryImg,
    BCheckout,
    BCart,
    BCartItem,
    BType,
    BVariant,
    BAttribute,
    BAttributeVal,
    CheckoutItem,
};
