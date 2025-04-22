import {makeAutoObservable} from "mobx";

export default class GItemStore{
    constructor(){
        this._types = []
        this._colors = []
        this._gallery_items = []
        this._selectedType = {}
        this._selectedColor = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 3
        makeAutoObservable(this)
    }

    setTypes(types){
        this._types = types
    }

    setColors(colors){
        this._colors = colors
    }

    setItems(gallery_items){
        this._gallery_items = gallery_items
    }

    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }

    setSelectedColor(color) {
        this.setPage(1)
        this._selectedColor = color
    }

    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }


    get types () {
        return this._types
    }

    get colors () {
        return this._colors
    }

    get gallery_items () {
        return this._gallery_items
    }

    get selectedType () {
        return this._selectedType
    }

    get selectedColor () {
        return this._selectedColor
    }

    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }

    get totalCount() {
        return this._totalCount
    }
}